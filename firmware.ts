import {TRAVEL_TIME} from './config';

export enum ElevatorStatus {
    Idle = 'Idle',
    Running = 'Running',
}

export enum ElevatorDirection {
    Up = 'Up',
    Down = 'Down',
}
export interface Request {
    floor: number;
    direction: ElevatorDirection;
}
export interface InternalControlEventHandlers {
    // Handler gets called before reaching any floor
    shouldStopAtFloor: (floor: number, direction: ElevatorDirection) => boolean;

    onStop: (floor: number, direction: ElevatorDirection) => void;
}

export interface InternalControl {
    getCurrentStatus(): ElevatorStatus;

    getCurrentDirection(): ElevatorDirection;

    getCurrentFloor(): number;

    // Make elevator starting to go up, it will stop at the floor where shouldStopAtFloor returns true
    // calling this function again while elevator is running will throw an error
    startMoveUp(): void;

    // Make elevator starting to go down, it will stop at the floor where shouldStopAtFloor returns true
    // calling this function again while elevator is running will throw an error
    startMoveDown(): void;
}

export function wait(round: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, round * TRAVEL_TIME);
    });
}

export class InternalControlMock implements InternalControl {
    private status: ElevatorStatus = ElevatorStatus.Idle;
    private direction: ElevatorDirection = ElevatorDirection.Up;
    private floor: number = 0;
    private requests: Request[] = [];

    constructor(
        private eventHandlers: InternalControlEventHandlers,
        private minFloor: number,
        private maxFloor: number
    ) {
        return this;
    }

    getCurrentStatus(): ElevatorStatus {
        return this.status;
    }

    getCurrentFloor(): number {
        return this.floor;
    }

    getCurrentDirection(): ElevatorDirection {
        return this.direction;
    }

    // Getter method to access requests
    public getRequests(): Request[] {
        return this.requests;
    }

    // Setter method to update requests
    public addRequest(floor: number, direction: ElevatorDirection): void {
        this.requests.push({ floor, direction });
    }

    private async move(direction: ElevatorDirection): Promise<void> {
        if (this.status === ElevatorStatus.Running) {
            throw new Error('Elevator is already running');
        }

        this.status = ElevatorStatus.Running;
        console.log(`Elevator is moving ${direction}`);

        this.direction = direction;
        const delta = direction === ElevatorDirection.Up ? 1 : -1;

        while (
            direction === ElevatorDirection.Up ? this.floor < this.maxFloor : this.floor > this.minFloor
            ) {
            let shouldStop = this.eventHandlers.shouldStopAtFloor(this.floor + delta, direction);
            await wait(1);
            this.floor += delta;
            console.log(`Elevator reaching ${this.floor}...`);

            if (shouldStop) {
                break;
            }
        }

        console.log(`Elevator stopped at ${this.floor}`);
        this.status = ElevatorStatus.Idle;
        this.eventHandlers.onStop(this.floor, direction);
    }

    startMoveDown(): void {
        this.move(ElevatorDirection.Down);
    }
// Event handlers
const elevatorControl = new InternalControlMock(
    {
        shouldStopAtFloor: (floor: number, direction: ElevatorDirection) => {
            // Check if there are any requests for the current floor in the current direction
            for (let req of elevatorControl.getRequests()) {
                if (req.floor === floor && req.direction === direction) {
                    console.log(`Elevator should stop at floor ${floor}`);
                    return true; // Elevator should stop
                }
            }
            return false; // Elevator should not stop
        },
        onStop: (floor: number, direction: ElevatorDirection) => {
            console.log(`Elevator stopped at floor ${floor}`);
            // Once the elevator stops at a floor, remove the fulfilled request
            elevatorControl.getRequests().splice(0, 1); // Remove the request for this floor
            // Do NOT automatically process the next request in the queue
            // Wait for an external request to come in before continuing
        },
    },
    0, // Min floor
    20 // Max floor
);

// Main function to call the elevator from a specific floor
function callElevator(floor: number, direction: ElevatorDirection): void {
    const currentFloor = elevatorControl.getCurrentFloor();
    const currentStatus = elevatorControl.getCurrentStatus();
    
    // Add the request to the queue
    elevatorControl.addRequest(floor, direction);
    
    // If the elevator is idle, start moving
    if (currentStatus === ElevatorStatus.Idle) {
        console.log(`Elevator is idle. Starting to move.`);
        if (floor > currentFloor && direction === ElevatorDirection.Up) {
            elevatorControl.startMoveUp();
        } else if (floor < currentFloor && direction === ElevatorDirection.Down) {
            elevatorControl.startMoveDown();
        }
    } else {
        // If the elevator is already running, just log that the request is added to the queue
        console.log(`Elevator is running. Request queued for floor ${floor}.`);
    }
}

// Function called when a user presses a button inside the elevator to select a floor
function selectFloor(floor: number): void {
    const currentFloor = elevatorControl.getCurrentFloor();

    if (floor > currentFloor) {
        console.log(`User requested floor ${floor}. Moving up.`);
        callElevator(floor, ElevatorDirection.Up);
    } else if (floor < currentFloor) {
        console.log(`User requested floor ${floor}. Moving down.`);
        callElevator(floor, ElevatorDirection.Down);
    } else {
        console.log(`Elevator is already at floor ${floor}.`);
    }
}


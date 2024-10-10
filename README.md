# elevatorsystem

# Elevator Control System

This project simulates the behavior of an elevator system that responds to user requests to move between floors. It is designed to handle up and down requests, optimize stops, and efficiently process multiple concurrent requests.

## Features

- Supports up to 20 floors.
- Handles user requests to move up or down from specific floors.
- Allows users inside the elevator to select destination floors.
- Optimizes elevator movement by deciding when to stop or skip floors


//function callElevator(floor: number, direction: ElevatorDirection): void;


// function called when a user presses the button at the  specific floor

//function selectFloor(floor: number): void;

// Main function to handle when users press the button to call the elevator from a specific floor



// Elevator is idle at F0
// User A request DOWN from F9 => Elevator should start move up
// Elevator is moving up, currently reaching F3
// User B request UP from F5 => Elevator should stop at F5 first
// User C request UP from f2 => Elevator should ignore this request for now
// Elevator is moving up, currently stop at F5, User B is in, User B request to F8 => Elevator should stop at F8 first
// Elevator is moving up, currently stop at F8, User B is out
// User D request DOWN from F15 => Elevator should skip F9, and stop at F15 first
// Elevator is moving up, currently stop at F15, User D is in, User D request to f11 => Elevator starts to move down towards F11
// Elevator is moving down, currently stop at F11, User D is out
// Elevator is moving down, currently stop at F9, User A is in, User A request to F0
// Elevator is moving down, currently stop at F0, User A is out
// Elevator is moving up, currently stop at F2, User C is in

// send email to evan@partly.com

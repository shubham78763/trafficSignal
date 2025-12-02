# Traffic Signal Management System

## Objective
A Core Java-based traffic signal simulation system that manages multiple intersections, controls signal timing, simulates vehicle flow, and persists data using CSV files.

## Core Java Concepts Implemented
- **OOP**: Classes, Inheritance, Polymorphism, Encapsulation, Abstraction
- **Exception Handling**: Custom exceptions with try-catch-finally
- **File I/O**: CSV reading/writing using BufferedReader/FileWriter
- **Collections**: ArrayList, HashMap for data management
- **Multithreading**: Thread-based signal timing and vehicle simulation
- **Streams & Lambda**: Filtering and reporting

## Project Structure
```
src/
├── model/          - Entity classes (Signal, Intersection, Vehicle)
├── service/        - Business logic (SignalController, TrafficSimulator)
├── util/           - File operations and utilities
└── main/           - Main application entry point
```

## Features
1. Manage multiple traffic intersections
2. Control signal timing (Red, Yellow, Green)
3. Simulate vehicle flow through intersections
4. Generate traffic reports
5. Persist data in CSV files

## How to Run
```bash
javac -d bin src/**/*.java
java -cp bin main.TrafficSignalApp
```

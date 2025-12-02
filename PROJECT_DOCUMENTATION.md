# Traffic Signal Management System - Project Documentation

## 1. Objective
Develop a traffic signal simulation system using Core Java that manages multiple intersections, controls signal timing, simulates vehicle flow, and persists data using CSV files.

## 2. Modules

### Model Package
- **Vehicle** (Abstract): Base class for all vehicles with priority system
- **Car**: Regular vehicle implementation
- **EmergencyVehicle**: High-priority vehicle (ambulance, fire truck)
- **TrafficSignal**: Represents individual traffic lights
- **SignalState** (Enum): RED, YELLOW, GREEN states
- **Intersection**: Manages 4-way intersection with signals

### Service Package
- **TrafficManager**: Main business logic coordinator
- **SignalController**: Thread-based signal timing control
- **TrafficSimulator**: Thread-based vehicle arrival simulation

### Util Package
- **CSVFileHandler**: File I/O operations for CSV
- **InvalidSignalException**: Custom checked exception
- **FileOperationException**: Custom checked exception for file errors

### Main Package
- **TrafficSignalApp**: Entry point with menu-driven interface

## 3. Core Java Concepts Demonstrated

### OOP Concepts
- **Encapsulation**: Private fields with getters/setters
- **Inheritance**: Vehicle → Car, EmergencyVehicle
- **Polymorphism**: Vehicle.getPriority() overridden in subclasses
- **Abstraction**: Abstract Vehicle class, interface-like behavior

### Exception Handling
- **Custom Exceptions**: InvalidSignalException, FileOperationException
- **Try-Catch-Finally**: Proper resource management in CSVFileHandler
- **Checked Exceptions**: Forces caller to handle file/signal errors

### File Handling
- **FileReader/BufferedReader**: Reading CSV files
- **FileWriter/BufferedWriter**: Writing CSV files
- **CSV Operations**: String.split(",") for parsing
- **Resource Management**: Finally blocks for closing streams

### Collections Framework
- **ArrayList**: Storing signals, data records
- **HashMap**: Managing intersections, threads, controllers
- **List Interface**: Generic collection operations

### Multithreading
- **Runnable Interface**: SignalController, TrafficSimulator
- **Thread Management**: Starting, stopping threads
- **Thread.sleep()**: Timing control
- **Synchronized Methods**: Thread-safe vehicle counting
- **Volatile Variables**: Safe thread communication

### Streams & Lambda
- **Stream API**: Processing intersection data
- **mapToInt()**: Calculating total vehicles
- **max()**: Finding busiest intersection
- **sorted()**: Ordering intersections
- **forEach()**: Displaying results
- **Optional**: Safe handling of max() result

## 4. Algorithmic Flow

### Main Application Flow
```
START
  ↓
Load existing data from CSV
  ↓
Display Menu Loop:
  1. Add Intersection → Create new intersection object
  2. Start Intersection → Launch signal controller + simulator threads
  3. Stop Intersection → Stop threads for specific intersection
  4. Generate Report → Use streams to analyze data
  5. Save & Exit → Stop all threads, save to CSV
  ↓
END
```

### Signal Controller Thread Flow
```
START Thread
  ↓
WHILE running:
  ↓
  Cycle 1: North-South GREEN (25s) → YELLOW (5s)
           East-West RED
  ↓
  Cycle 2: East-West GREEN (25s) → YELLOW (5s)
           North-South RED
  ↓
  Repeat
  ↓
END Thread
```

### Traffic Simulator Thread Flow
```
START Thread
  ↓
WHILE running:
  ↓
  Generate random vehicle (90% Car, 10% Emergency)
  ↓
  Add to intersection
  ↓
  Increment vehicle count
  ↓
  Sleep 2-5 seconds (random)
  ↓
  Repeat
  ↓
END Thread
```

### CSV File Operations Flow
```
WRITE:
  Open FileWriter → BufferedWriter
  ↓
  Write header line
  ↓
  For each object: Write CSV line
  ↓
  Close in finally block

READ:
  Open FileReader → BufferedReader
  ↓
  Read line by line
  ↓
  Split by comma
  ↓
  Store in List<String[]>
  ↓
  Close in finally block
```

## 5. Class Diagram

```
┌─────────────────────┐
│   TrafficSignalApp  │ (Main)
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   TrafficManager    │
├─────────────────────┤
│ - intersections     │
│ - signalThreads     │
│ - simulatorThreads  │
├─────────────────────┤
│ + addIntersection() │
│ + startIntersection()│
│ + stopAll()         │
│ + saveData()        │
│ + loadData()        │
│ + generateReport()  │
└──────────┬──────────┘
           │
           ├──────────────────────┬──────────────────────┐
           ↓                      ↓                      ↓
┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Intersection      │  │ SignalController │  │ TrafficSimulator │
├─────────────────────┤  ├──────────────────┤  ├──────────────────┤
│ - intersectionId    │  │ - intersection   │  │ - intersection   │
│ - location          │  │ - running        │  │ - running        │
│ - signals           │  │ - cycleIndex     │  │ - random         │
│ - vehicleCount      │  ├──────────────────┤  ├──────────────────┤
├─────────────────────┤  │ + run()          │  │ + run()          │
│ + getSignals()      │  │ + stop()         │  │ + stop()         │
│ + incrementCount()  │  │ - controlCycle() │  │ - simulateVehicle()│
│ + toCSV()           │  └──────────────────┘  └──────────────────┘
└──────────┬──────────┘           │                      │
           │                      │                      │
           ↓                      ↓                      ↓
┌─────────────────────┐  implements Runnable    implements Runnable
│   TrafficSignal     │
├─────────────────────┤
│ - signalId          │
│ - direction         │
│ - currentState      │
│ - duration          │
├─────────────────────┤
│ + changeState()     │
│ + toCSV()           │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   SignalState       │ (Enum)
├─────────────────────┤
│ RED                 │
│ YELLOW              │
│ GREEN               │
└─────────────────────┘

┌─────────────────────┐
│   Vehicle           │ (Abstract)
├─────────────────────┤
│ # vehicleId         │
│ # type              │
│ # currentIntersection│
├─────────────────────┤
│ + getPriority()     │ (abstract)
│ + toCSV()           │
└──────────┬──────────┘
           │
           ├──────────────────────┐
           ↓                      ↓
┌─────────────────────┐  ┌──────────────────┐
│       Car           │  │ EmergencyVehicle │
├─────────────────────┤  ├──────────────────┤
│ + getPriority(): 1  │  │ + getPriority(): 10│
└─────────────────────┘  └──────────────────┘

┌─────────────────────┐
│  CSVFileHandler     │ (Utility)
├─────────────────────┤
│ + writeToFile()     │
│ + readFromFile()    │
└─────────────────────┘

┌─────────────────────┐
│ InvalidSignalException│ (Custom Exception)
└─────────────────────┘

┌─────────────────────┐
│ FileOperationException│ (Custom Exception)
└─────────────────────┘
```

## 6. How to Compile and Run

### Compilation
```bash
javac -d bin src/model/*.java src/service/*.java src/util/*.java src/main/*.java
```

### Execution
```bash
java -cp bin main.TrafficSignalApp
```

## 7. Sample Usage

1. **Add Intersection**: Create INT001 at "Main Street & 5th Ave"
2. **Start Intersection**: Begin signal control and vehicle simulation
3. **Wait**: Let simulation run for 1-2 minutes
4. **Generate Report**: View traffic statistics
5. **Save & Exit**: Persist data to CSV files

## 8. CSV File Structure

### intersections.csv
```
IntersectionID,Location,VehicleCount
INT001,Main Street & 5th Ave,45
INT002,Park Ave & 2nd St,32
```

### signals.csv
```
SignalID,Direction,State,Duration
INT001_N,NORTH,GREEN,25
INT001_S,SOUTH,GREEN,25
INT001_E,EAST,RED,30
INT001_W,WEST,RED,30
```

## 9. Key Features

- Real-time signal timing control
- Concurrent vehicle simulation
- Emergency vehicle priority system
- Thread-safe operations
- Persistent data storage
- Statistical reporting with streams
- Proper exception handling
- Resource management with finally blocks

## 10. Learning Outcomes

Students will understand:
- Object-oriented design principles
- Thread synchronization and management
- File I/O operations in Java
- Exception handling best practices
- Collections framework usage
- Stream API for data processing
- CSV data manipulation
- Real-world simulation design

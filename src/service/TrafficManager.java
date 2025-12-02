package service;

import model.*;
import util.*;

import java.util.*;
import java.util.stream.Collectors;

public class TrafficManager {
    private Map<String, Intersection> intersections;
    private Map<String, Thread> signalThreads;
    private Map<String, Thread> simulatorThreads;
    private Map<String, SignalController> controllers;
    private Map<String, TrafficSimulator> simulators;
    
    public TrafficManager() {
        this.intersections = new HashMap<>();
        this.signalThreads = new HashMap<>();
        this.simulatorThreads = new HashMap<>();
        this.controllers = new HashMap<>();
        this.simulators = new HashMap<>();
    }
    
    public void addIntersection(String id, String location) {
        Intersection intersection = new Intersection(id, location);
        intersections.put(id, intersection);
        System.out.println("Added intersection: " + id + " at " + location);
    }
    
    public void startIntersection(String id) throws InvalidSignalException {
        Intersection intersection = intersections.get(id);
        if (intersection == null) {
            throw new InvalidSignalException("Intersection not found: " + id);
        }
        
        // Start signal controller
        SignalController controller = new SignalController(intersection);
        controllers.put(id, controller);
        Thread signalThread = new Thread(controller);
        signalThreads.put(id, signalThread);
        signalThread.start();
        
        // Start traffic simulator
        TrafficSimulator simulator = new TrafficSimulator(intersection);
        simulators.put(id, simulator);
        Thread simThread = new Thread(simulator);
        simulatorThreads.put(id, simThread);
        simThread.start();
    }
    
    public void stopIntersection(String id) {
        SignalController controller = controllers.get(id);
        if (controller != null) {
            controller.stop();
        }
        
        TrafficSimulator simulator = simulators.get(id);
        if (simulator != null) {
            simulator.stop();
        }
    }
    
    public void stopAll() {
        for (String id : intersections.keySet()) {
            stopIntersection(id);
        }
    }
    
    public void saveData() throws FileOperationException {
        // Save intersections
        List<String> intersectionData = new ArrayList<>();
        intersectionData.add("IntersectionID,Location,VehicleCount");
        for (Intersection intersection : intersections.values()) {
            intersectionData.add(intersection.toCSV());
        }
        CSVFileHandler.writeToFile("intersections.csv", intersectionData);
        
        // Save signals
        List<String> signalData = new ArrayList<>();
        signalData.add("SignalID,Direction,State,Duration");
        for (Intersection intersection : intersections.values()) {
            for (TrafficSignal signal : intersection.getSignals()) {
                signalData.add(signal.toCSV());
            }
        }
        CSVFileHandler.writeToFile("signals.csv", signalData);
    }
    
    public void loadData() throws FileOperationException {
        List<String[]> records = CSVFileHandler.readFromFile("intersections.csv");
        
        for (int i = 1; i < records.size(); i++) {
            String[] fields = records.get(i);
            if (fields.length >= 2) {
                addIntersection(fields[0], fields[1]);
            }
        }
    }
    
    public void generateReport() {
        System.out.println("\n========== TRAFFIC REPORT ==========");
        
        // Total vehicles using streams
        int totalVehicles = intersections.values().stream()
            .mapToInt(Intersection::getVehicleCount)
            .sum();
        
        System.out.println("Total Vehicles: " + totalVehicles);
        System.out.println("Total Intersections: " + intersections.size());
        
        // Busiest intersection
        Optional<Intersection> busiest = intersections.values().stream()
            .max(Comparator.comparingInt(Intersection::getVehicleCount));
        
        busiest.ifPresent(i -> 
            System.out.println("Busiest Intersection: " + i.getIntersectionId() + 
                             " (" + i.getVehicleCount() + " vehicles)"));
        
        // List all intersections
        System.out.println("\nIntersection Details:");
        intersections.values().stream()
            .sorted(Comparator.comparing(Intersection::getIntersectionId))
            .forEach(System.out::println);
        
        System.out.println("====================================\n");
    }
    
    public Map<String, Intersection> getIntersections() {
        return intersections;
    }
}

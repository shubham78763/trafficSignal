package model;

import java.util.ArrayList;
import java.util.List;

public class Intersection {
    private String intersectionId;
    private String location;
    private List<TrafficSignal> signals;
    private int vehicleCount;
    
    public Intersection(String intersectionId, String location) {
        this.intersectionId = intersectionId;
        this.location = location;
        this.signals = new ArrayList<>();
        this.vehicleCount = 0;
        initializeSignals();
    }
    
    private void initializeSignals() {
        signals.add(new TrafficSignal(intersectionId + "_N", "NORTH"));
        signals.add(new TrafficSignal(intersectionId + "_S", "SOUTH"));
        signals.add(new TrafficSignal(intersectionId + "_E", "EAST"));
        signals.add(new TrafficSignal(intersectionId + "_W", "WEST"));
    }
    
    public String getIntersectionId() {
        return intersectionId;
    }
    
    public String getLocation() {
        return location;
    }
    
    public List<TrafficSignal> getSignals() {
        return signals;
    }
    
    public synchronized void incrementVehicleCount() {
        vehicleCount++;
    }
    
    public int getVehicleCount() {
        return vehicleCount;
    }
    
    public String toCSV() {
        return intersectionId + "," + location + "," + vehicleCount;
    }
    
    @Override
    public String toString() {
        return "Intersection[" + intersectionId + "] at " + location + " - Vehicles: " + vehicleCount;
    }
}

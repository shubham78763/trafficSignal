package model;

public abstract class Vehicle {
    protected String vehicleId;
    protected String type;
    protected String currentIntersection;
    protected long entryTime;
    
    public Vehicle(String vehicleId, String type) {
        this.vehicleId = vehicleId;
        this.type = type;
        this.entryTime = System.currentTimeMillis();
    }
    
    public abstract int getPriority();
    
    public String getVehicleId() {
        return vehicleId;
    }
    
    public String getType() {
        return type;
    }
    
    public String getCurrentIntersection() {
        return currentIntersection;
    }
    
    public void setCurrentIntersection(String intersectionId) {
        this.currentIntersection = intersectionId;
    }
    
    public long getEntryTime() {
        return entryTime;
    }
    
    public String toCSV() {
        return vehicleId + "," + type + "," + currentIntersection + "," + entryTime;
    }
}

package model;

public class EmergencyVehicle extends Vehicle {
    
    public EmergencyVehicle(String vehicleId) {
        super(vehicleId, "EMERGENCY");
    }
    
    @Override
    public int getPriority() {
        return 10;
    }
}

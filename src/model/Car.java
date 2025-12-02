package model;

public class Car extends Vehicle {
    
    public Car(String vehicleId) {
        super(vehicleId, "CAR");
    }
    
    @Override
    public int getPriority() {
        return 1;
    }
}

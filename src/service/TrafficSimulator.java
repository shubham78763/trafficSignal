package service;

import model.*;

import java.util.Random;

public class TrafficSimulator implements Runnable {
    private Intersection intersection;
    private volatile boolean running;
    private Random random;
    private int vehicleCounter;
    
    public TrafficSimulator(Intersection intersection) {
        this.intersection = intersection;
        this.running = true;
        this.random = new Random();
        this.vehicleCounter = 0;
    }
    
    @Override
    public void run() {
        System.out.println("Traffic Simulator started for " + intersection.getIntersectionId());
        
        while (running) {
            try {
                simulateVehicleArrival();
                Thread.sleep(2000 + random.nextInt(3000)); // Random interval 2-5 seconds
            } catch (InterruptedException e) {
                System.out.println("Traffic simulator interrupted");
                break;
            }
        }
    }
    
    private void simulateVehicleArrival() {
        vehicleCounter++;
        String vehicleId = intersection.getIntersectionId() + "_V" + vehicleCounter;
        
        Vehicle vehicle;
        if (random.nextInt(10) == 0) { // 10% chance of emergency vehicle
            vehicle = new EmergencyVehicle(vehicleId);
        } else {
            vehicle = new Car(vehicleId);
        }
        
        vehicle.setCurrentIntersection(intersection.getIntersectionId());
        intersection.incrementVehicleCount();
        
        System.out.println("Vehicle " + vehicle.getVehicleId() + " (" + vehicle.getType() + 
                         ") arrived at " + intersection.getIntersectionId());
    }
    
    public void stop() {
        running = false;
    }
}

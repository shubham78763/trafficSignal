package main;

import service.TrafficManager;
import util.*;

import java.util.Scanner;

public class TrafficSignalApp {
    private static TrafficManager manager;
    private static Scanner scanner;
    
    public static void main(String[] args) {
        manager = new TrafficManager();
        scanner = new Scanner(System.in);
        
        System.out.println("=== Traffic Signal Management System ===\n");
        
        // Load existing data
        try {
            manager.loadData();
        } catch (FileOperationException e) {
            System.out.println("No existing data found. Starting fresh.");
        }
        
        boolean running = true;
        while (running) {
            displayMenu();
            
            try {
                int choice = Integer.parseInt(scanner.nextLine());
                
                switch (choice) {
                    case 1:
                        addIntersection();
                        break;
                    case 2:
                        startIntersection();
                        break;
                    case 3:
                        stopIntersection();
                        break;
                    case 4:
                        manager.generateReport();
                        break;
                    case 5:
                        saveAndExit();
                        running = false;
                        break;
                    default:
                        System.out.println("Invalid choice. Try again.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
            }
        }
        
        scanner.close();
    }
    
    private static void displayMenu() {
        System.out.println("\n--- Menu ---");
        System.out.println("1. Add Intersection");
        System.out.println("2. Start Intersection");
        System.out.println("3. Stop Intersection");
        System.out.println("4. Generate Report");
        System.out.println("5. Save & Exit");
        System.out.print("Enter choice: ");
    }
    
    private static void addIntersection() {
        System.out.print("Enter Intersection ID: ");
        String id = scanner.nextLine();
        
        System.out.print("Enter Location: ");
        String location = scanner.nextLine();
        
        manager.addIntersection(id, location);
    }
    
    private static void startIntersection() {
        System.out.print("Enter Intersection ID to start: ");
        String id = scanner.nextLine();
        
        try {
            manager.startIntersection(id);
            System.out.println("Intersection " + id + " started successfully.");
        } catch (InvalidSignalException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    private static void stopIntersection() {
        System.out.print("Enter Intersection ID to stop: ");
        String id = scanner.nextLine();
        
        manager.stopIntersection(id);
        System.out.println("Intersection " + id + " stopped.");
    }
    
    private static void saveAndExit() {
        System.out.println("\nStopping all intersections...");
        manager.stopAll();
        
        try {
            Thread.sleep(2000); // Allow threads to finish
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("Saving data...");
        try {
            manager.saveData();
            System.out.println("Data saved successfully.");
        } catch (FileOperationException e) {
            System.err.println("Error saving data: " + e.getMessage());
        }
        
        System.out.println("Goodbye!");
    }
}

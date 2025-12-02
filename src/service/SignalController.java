package service;

import model.*;
import util.InvalidSignalException;

import java.util.List;

public class SignalController implements Runnable {
    private Intersection intersection;
    private volatile boolean running;
    private int cycleIndex;
    
    public SignalController(Intersection intersection) {
        this.intersection = intersection;
        this.running = true;
        this.cycleIndex = 0;
    }
    
    @Override
    public void run() {
        System.out.println("Signal Controller started for " + intersection.getIntersectionId());
        
        while (running) {
            try {
                controlSignalCycle();
            } catch (InvalidSignalException e) {
                System.err.println("Signal Error: " + e.getMessage());
            } catch (InterruptedException e) {
                System.out.println("Signal controller interrupted");
                break;
            }
        }
    }
    
    private void controlSignalCycle() throws InvalidSignalException, InterruptedException {
        List<TrafficSignal> signals = intersection.getSignals();
        
        if (signals.isEmpty()) {
            throw new InvalidSignalException("No signals found at intersection");
        }
        
        // North-South Green, East-West Red
        if (cycleIndex == 0) {
            setSignalStates(signals.get(0), SignalState.GREEN, signals.get(1), SignalState.GREEN,
                          signals.get(2), SignalState.RED, signals.get(3), SignalState.RED);
            Thread.sleep(25000); // 25 seconds
            
            // Yellow transition
            setSignalStates(signals.get(0), SignalState.YELLOW, signals.get(1), SignalState.YELLOW,
                          signals.get(2), SignalState.RED, signals.get(3), SignalState.RED);
            Thread.sleep(5000); // 5 seconds
        }
        
        // East-West Green, North-South Red
        else {
            setSignalStates(signals.get(0), SignalState.RED, signals.get(1), SignalState.RED,
                          signals.get(2), SignalState.GREEN, signals.get(3), SignalState.GREEN);
            Thread.sleep(25000);
            
            // Yellow transition
            setSignalStates(signals.get(0), SignalState.RED, signals.get(1), SignalState.RED,
                          signals.get(2), SignalState.YELLOW, signals.get(3), SignalState.YELLOW);
            Thread.sleep(5000);
        }
        
        cycleIndex = (cycleIndex + 1) % 2;
    }
    
    private void setSignalStates(TrafficSignal s1, SignalState state1, TrafficSignal s2, SignalState state2,
                                 TrafficSignal s3, SignalState state3, TrafficSignal s4, SignalState state4) {
        s1.changeState(state1);
        s2.changeState(state2);
        s3.changeState(state3);
        s4.changeState(state4);
        
        System.out.println("[" + intersection.getIntersectionId() + "] Signals updated");
    }
    
    public void stop() {
        running = false;
    }
}

package model;

public class TrafficSignal {
    private String signalId;
    private String direction;
    private SignalState currentState;
    private int duration;
    private long lastChangeTime;
    
    public TrafficSignal(String signalId, String direction) {
        this.signalId = signalId;
        this.direction = direction;
        this.currentState = SignalState.RED;
        this.duration = currentState.getDefaultDuration();
        this.lastChangeTime = System.currentTimeMillis();
    }
    
    public TrafficSignal(String signalId, String direction, SignalState state, int duration) {
        this.signalId = signalId;
        this.direction = direction;
        this.currentState = state;
        this.duration = duration;
        this.lastChangeTime = System.currentTimeMillis();
    }
    
    public synchronized void changeState(SignalState newState) {
        this.currentState = newState;
        this.duration = newState.getDefaultDuration();
        this.lastChangeTime = System.currentTimeMillis();
    }
    
    public String getSignalId() {
        return signalId;
    }
    
    public String getDirection() {
        return direction;
    }
    
    public SignalState getCurrentState() {
        return currentState;
    }
    
    public int getDuration() {
        return duration;
    }
    
    public long getLastChangeTime() {
        return lastChangeTime;
    }
    
    public String toCSV() {
        return signalId + "," + direction + "," + currentState + "," + duration;
    }
    
    @Override
    public String toString() {
        return "Signal[" + signalId + "] " + direction + " - " + currentState + " (" + duration + "s)";
    }
}

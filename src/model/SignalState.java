package model;

public enum SignalState {
    RED(30),
    YELLOW(5),
    GREEN(25);
    
    private final int defaultDuration;
    
    SignalState(int defaultDuration) {
        this.defaultDuration = defaultDuration;
    }
    
    public int getDefaultDuration() {
        return defaultDuration;
    }
}

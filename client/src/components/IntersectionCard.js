import React from 'react';

const IntersectionCard = ({ intersection, onStart, onStop }) => {
  const { name, location, signals, vehicleCount, isActive } = intersection;

  return (
    <div className="intersection-card">
      <div className="intersection-header">
        <div className="intersection-name">{name}</div>
        <div className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
      
      <div className="intersection-location">{location}</div>
      
      {signals && (
        <div className="signals-grid">
          <div className="signal">
            <span className="signal-direction">North</span>
            <div className={`signal-light ${signals.north?.state || 'RED'}`}></div>
          </div>
          <div className="signal">
            <span className="signal-direction">South</span>
            <div className={`signal-light ${signals.south?.state || 'RED'}`}></div>
          </div>
          <div className="signal">
            <span className="signal-direction">East</span>
            <div className={`signal-light ${signals.east?.state || 'RED'}`}></div>
          </div>
          <div className="signal">
            <span className="signal-direction">West</span>
            <div className={`signal-light ${signals.west?.state || 'RED'}`}></div>
          </div>
        </div>
      )}
      
      <div className="vehicle-count">
        <div className="vehicle-count-number">{vehicleCount}</div>
        <div className="vehicle-count-label">Vehicles Passed</div>
      </div>
      
      <div className="intersection-controls">
        {isActive ? (
          <button className="btn btn-danger" onClick={onStop}>
            Stop Intersection
          </button>
        ) : (
          <button className="btn btn-success" onClick={onStart}>
            Start Intersection
          </button>
        )}
      </div>
    </div>
  );
};

export default IntersectionCard;
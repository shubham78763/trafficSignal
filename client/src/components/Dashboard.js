import React from 'react';
import IntersectionCard from './IntersectionCard';

const Dashboard = ({ intersections, vehicles, onStartIntersection, onStopIntersection }) => {
  const activeIntersections = intersections.filter(i => i.isActive).length;
  const totalVehicles = intersections.reduce((sum, i) => sum + i.vehicleCount, 0);
  const recentVehicles = vehicles.slice(0, 10);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{intersections.length}</div>
          <div className="stat-label">Total Intersections</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeIntersections}</div>
          <div className="stat-label">Active Intersections</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalVehicles}</div>
          <div className="stat-label">Total Vehicles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{recentVehicles.length}</div>
          <div className="stat-label">Recent Activity</div>
        </div>
      </div>

      <div className="intersection-grid">
        {intersections.map(intersection => (
          <IntersectionCard
            key={intersection._id}
            intersection={intersection}
            onStart={() => onStartIntersection(intersection._id)}
            onStop={() => onStopIntersection(intersection._id)}
          />
        ))}
      </div>

      {recentVehicles.length > 0 && (
        <div className="card">
          <h3>Recent Vehicle Activity</h3>
          <div className="vehicle-list">
            {recentVehicles.map(vehicle => (
              <div key={vehicle._id} className="vehicle-item">
                <div>
                  <strong>{vehicle.vehicleId}</strong>
                  <span className={`vehicle-type vehicle-${vehicle.type}`}>
                    {vehicle.type}
                  </span>
                </div>
                <div>
                  {new Date(vehicle.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
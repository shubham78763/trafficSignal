import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ intersections, vehicles }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/vehicles/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  const totalIntersections = intersections.length;
  const activeIntersections = intersections.filter(i => i.isActive).length;
  const totalVehicles = stats?.totalVehicles || 0;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalIntersections}</div>
          <div className="stat-label">Total Intersections</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeIntersections}</div>
          <div className="stat-label">Active Intersections</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalVehicles}</div>
          <div className="stat-label">Total Vehicles Processed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {activeIntersections > 0 ? Math.round(totalVehicles / activeIntersections) : 0}
          </div>
          <div className="stat-label">Avg Vehicles per Intersection</div>
        </div>
      </div>

      {stats?.vehiclesByType && (
        <div className="card">
          <h3>Vehicle Types Distribution</h3>
          <div className="stats-grid">
            {stats.vehiclesByType.map(item => (
              <div key={item._id} className="stat-card">
                <div className="stat-number">{item.count}</div>
                <div className="stat-label">{item._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.vehiclesByIntersection && stats.vehiclesByIntersection.length > 0 && (
        <div className="card">
          <h3>Traffic by Intersection</h3>
          <div className="intersection-stats">
            {stats.vehiclesByIntersection.map((item, index) => (
              <div key={item._id} className="intersection-stat-item" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <h4>{item.intersectionName}</h4>
                  <p style={{ color: '#666', margin: '5px 0' }}>{item.location}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {item.vehicleCount}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    vehicles
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3>System Performance</h3>
        <div className="performance-metrics">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                {((activeIntersections / totalIntersections) * 100).toFixed(1)}%
              </div>
              <div>System Utilization</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#17a2b8' }}>
                {totalVehicles > 0 ? (totalVehicles / Math.max(1, (Date.now() - new Date().setHours(0,0,0,0)) / 3600000)).toFixed(1) : 0}
              </div>
              <div>Vehicles per Hour</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                {vehicles.filter(v => v.type === 'EMERGENCY').length}
              </div>
              <div>Emergency Vehicles</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        {vehicles.length > 0 ? (
          <div className="vehicle-list">
            {vehicles.slice(0, 20).map(vehicle => (
              <div key={vehicle._id} className="vehicle-item">
                <div>
                  <strong>{vehicle.vehicleId}</strong>
                  <span className={`vehicle-type vehicle-${vehicle.type}`}>
                    {vehicle.type}
                  </span>
                  {vehicle.intersectionId && (
                    <span style={{ marginLeft: '10px', color: '#666' }}>
                      @ {intersections.find(i => i._id === vehicle.intersectionId)?.name || 'Unknown'}
                    </span>
                  )}
                </div>
                <div style={{ color: '#666' }}>
                  {new Date(vehicle.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No vehicle activity recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
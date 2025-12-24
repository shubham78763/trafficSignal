import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import IntersectionManager from './components/IntersectionManager';
import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics';

const socket = io('http://localhost:5000');

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [intersections, setIntersections] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntersections();
    fetchVehicles();

    // Socket event listeners
    socket.on('signalUpdate', (data) => {
      setIntersections(prev => 
        prev.map(intersection => 
          intersection._id === data.intersectionId 
            ? { ...intersection, signals: data.signals }
            : intersection
        )
      );
    });

    socket.on('vehicleArrival', (data) => {
      setVehicles(prev => [data.vehicle, ...prev.slice(0, 99)]);
      setIntersections(prev => 
        prev.map(intersection => 
          intersection._id === data.intersectionId 
            ? { ...intersection, vehicleCount: intersection.vehicleCount + 1 }
            : intersection
        )
      );
    });

    return () => {
      socket.off('signalUpdate');
      socket.off('vehicleArrival');
    };
  }, []);

  const fetchIntersections = async () => {
    try {
      const response = await axios.get('/api/intersections');
      setIntersections(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching intersections:', error);
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const addIntersection = async (intersectionData) => {
    try {
      const response = await axios.post('/api/intersections', intersectionData);
      setIntersections(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error adding intersection:', error);
      throw error;
    }
  };

  const startIntersection = async (intersectionId) => {
    try {
      await axios.post(`/api/intersections/${intersectionId}/start`);
      socket.emit('startIntersection', intersectionId);
      setIntersections(prev => 
        prev.map(intersection => 
          intersection._id === intersectionId 
            ? { ...intersection, isActive: true }
            : intersection
        )
      );
    } catch (error) {
      console.error('Error starting intersection:', error);
    }
  };

  const stopIntersection = async (intersectionId) => {
    try {
      await axios.post(`/api/intersections/${intersectionId}/stop`);
      socket.emit('stopIntersection', intersectionId);
      setIntersections(prev => 
        prev.map(intersection => 
          intersection._id === intersectionId 
            ? { ...intersection, isActive: false }
            : intersection
        )
      );
    } catch (error) {
      console.error('Error stopping intersection:', error);
    }
  };

  const deleteIntersection = async (intersectionId) => {
    try {
      await axios.delete(`/api/intersections/${intersectionId}`);
      setIntersections(prev => prev.filter(intersection => intersection._id !== intersectionId));
    } catch (error) {
      console.error('Error deleting intersection:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading Traffic Signal System...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🚦 Traffic Signal Management System</h1>
        <p>Real-time traffic control and monitoring</p>
      </div>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Intersections
        </button>
        <button 
          className={`nav-tab ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <Dashboard 
          intersections={intersections}
          vehicles={vehicles}
          onStartIntersection={startIntersection}
          onStopIntersection={stopIntersection}
        />
      )}

      {activeTab === 'manage' && (
        <IntersectionManager 
          intersections={intersections}
          onAddIntersection={addIntersection}
          onDeleteIntersection={deleteIntersection}
          onStartIntersection={startIntersection}
          onStopIntersection={stopIntersection}
        />
      )}

      {activeTab === 'statistics' && (
        <Statistics 
          intersections={intersections}
          vehicles={vehicles}
        />
      )}
    </div>
  );
}

export default App;
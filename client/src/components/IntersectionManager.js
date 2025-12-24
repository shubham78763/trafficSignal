import React, { useState } from 'react';

const IntersectionManager = ({ 
  intersections, 
  onAddIntersection, 
  onDeleteIntersection,
  onStartIntersection,
  onStopIntersection 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    lat: '',
    lng: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const intersectionData = {
        name: formData.name,
        location: formData.location,
        coordinates: {
          lat: parseFloat(formData.lat) || 0,
          lng: parseFloat(formData.lng) || 0
        }
      };

      await onAddIntersection(intersectionData);
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        lat: '',
        lng: ''
      });
    } catch (error) {
      setError('Failed to add intersection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (intersectionId) => {
    if (window.confirm('Are you sure you want to delete this intersection?')) {
      try {
        await onDeleteIntersection(intersectionId);
      } catch (error) {
        setError('Failed to delete intersection. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Add New Intersection</h2>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Intersection Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Main Street & 5th Avenue"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location Description</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Downtown Business District"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lat">Latitude (Optional)</label>
              <input
                type="number"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                placeholder="e.g., 40.7128"
                step="any"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lng">Longitude (Optional)</label>
              <input
                type="number"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                placeholder="e.g., -74.0060"
                step="any"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Intersection'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Manage Existing Intersections</h2>
        
        {intersections.length === 0 ? (
          <p>No intersections found. Add one above to get started!</p>
        ) : (
          <div className="intersection-list">
            {intersections.map(intersection => (
              <div key={intersection._id} className="intersection-item" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                <div>
                  <h4>{intersection.name}</h4>
                  <p style={{ color: '#666', margin: '5px 0' }}>{intersection.location}</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className={`status-badge ${intersection.isActive ? 'status-active' : 'status-inactive'}`}>
                      {intersection.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      {intersection.vehicleCount} vehicles
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {intersection.isActive ? (
                    <button 
                      className="btn btn-warning"
                      onClick={() => onStopIntersection(intersection._id)}
                    >
                      Stop
                    </button>
                  ) : (
                    <button 
                      className="btn btn-success"
                      onClick={() => onStartIntersection(intersection._id)}
                    >
                      Start
                    </button>
                  )}
                  
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(intersection._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntersectionManager;
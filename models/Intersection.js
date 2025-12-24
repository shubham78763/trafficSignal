const mongoose = require('mongoose');

const IntersectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  signals: {
    north: {
      state: { type: String, enum: ['RED', 'YELLOW', 'GREEN'], default: 'RED' },
      duration: { type: Number, default: 30 }
    },
    south: {
      state: { type: String, enum: ['RED', 'YELLOW', 'GREEN'], default: 'RED' },
      duration: { type: Number, default: 30 }
    },
    east: {
      state: { type: String, enum: ['RED', 'YELLOW', 'GREEN'], default: 'RED' },
      duration: { type: Number, default: 30 }
    },
    west: {
      state: { type: String, enum: ['RED', 'YELLOW', 'GREEN'], default: 'RED' },
      duration: { type: Number, default: 30 }
    }
  },
  vehicleCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Intersection', IntersectionSchema);
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['CAR', 'TRUCK', 'MOTORCYCLE', 'EMERGENCY'],
    required: true
  },
  intersectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Intersection',
    required: true
  },
  direction: {
    type: String,
    enum: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
    default: 'NORTH'
  },
  priority: {
    type: Number,
    default: function() {
      return this.type === 'EMERGENCY' ? 10 : 1;
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  waitTime: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
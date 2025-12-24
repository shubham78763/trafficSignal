const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('intersectionId', 'name location')
      .sort({ timestamp: -1 })
      .limit(100); // Limit to recent 100 vehicles
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vehicles by intersection
router.get('/intersection/:intersectionId', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ intersectionId: req.params.intersectionId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET traffic statistics
router.get('/stats', async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    
    const vehiclesByType = await Vehicle.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const vehiclesByIntersection = await Vehicle.aggregate([
      {
        $group: {
          _id: '$intersectionId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'intersections',
          localField: '_id',
          foreignField: '_id',
          as: 'intersection'
        }
      },
      {
        $unwind: '$intersection'
      },
      {
        $project: {
          intersectionName: '$intersection.name',
          location: '$intersection.location',
          vehicleCount: '$count'
        }
      },
      {
        $sort: { vehicleCount: -1 }
      }
    ]);

    res.json({
      totalVehicles,
      vehiclesByType,
      vehiclesByIntersection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create vehicle (for manual testing)
router.post('/', async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
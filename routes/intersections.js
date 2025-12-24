const express = require('express');
const router = express.Router();
const Intersection = require('../models/Intersection');

// GET all intersections
router.get('/', async (req, res) => {
  try {
    const intersections = await Intersection.find().sort({ createdAt: -1 });
    res.json(intersections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single intersection
router.get('/:id', async (req, res) => {
  try {
    const intersection = await Intersection.findById(req.params.id);
    if (!intersection) {
      return res.status(404).json({ message: 'Intersection not found' });
    }
    res.json(intersection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create intersection
router.post('/', async (req, res) => {
  try {
    const intersection = new Intersection({
      name: req.body.name,
      location: req.body.location,
      coordinates: req.body.coordinates || { lat: 0, lng: 0 }
    });

    const savedIntersection = await intersection.save();
    res.status(201).json(savedIntersection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update intersection
router.put('/:id', async (req, res) => {
  try {
    const intersection = await Intersection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!intersection) {
      return res.status(404).json({ message: 'Intersection not found' });
    }
    
    res.json(intersection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE intersection
router.delete('/:id', async (req, res) => {
  try {
    const intersection = await Intersection.findByIdAndDelete(req.params.id);
    if (!intersection) {
      return res.status(404).json({ message: 'Intersection not found' });
    }
    res.json({ message: 'Intersection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST start intersection
router.post('/:id/start', async (req, res) => {
  try {
    const intersection = await Intersection.findByIdAndUpdate(
      req.params.id,
      { isActive: true, lastUpdated: new Date() },
      { new: true }
    );
    
    if (!intersection) {
      return res.status(404).json({ message: 'Intersection not found' });
    }
    
    res.json({ message: 'Intersection started', intersection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST stop intersection
router.post('/:id/stop', async (req, res) => {
  try {
    const intersection = await Intersection.findByIdAndUpdate(
      req.params.id,
      { isActive: false, lastUpdated: new Date() },
      { new: true }
    );
    
    if (!intersection) {
      return res.status(404).json({ message: 'Intersection not found' });
    }
    
    res.json({ message: 'Intersection stopped', intersection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
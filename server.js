const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replacing MongoDB for now)
let intersections = [];
let vehicles = [];
let intersectionCounter = 1;

// Routes - Simple in-memory API
app.get('/api/intersections', (req, res) => {
  res.json(intersections);
});

app.post('/api/intersections', (req, res) => {
  const intersection = {
    _id: intersectionCounter++,
    name: req.body.name,
    location: req.body.location,
    coordinates: req.body.coordinates || { lat: 0, lng: 0 },
    signals: {
      north: { state: 'RED', duration: 30 },
      south: { state: 'RED', duration: 30 },
      east: { state: 'RED', duration: 30 },
      west: { state: 'RED', duration: 30 }
    },
    vehicleCount: 0,
    isActive: false,
    createdAt: new Date(),
    lastUpdated: new Date()
  };
  intersections.push(intersection);
  res.status(201).json(intersection);
});

app.get('/api/vehicles', (req, res) => {
  res.json(vehicles.slice(0, 100));
});

app.get('/api/vehicles/stats', (req, res) => {
  const totalVehicles = vehicles.length;
  const vehiclesByType = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.type] = (acc[vehicle.type] || 0) + 1;
    return acc;
  }, {});
  
  const vehiclesByIntersection = intersections.map(intersection => ({
    _id: intersection._id,
    intersectionName: intersection.name,
    location: intersection.location,
    vehicleCount: intersection.vehicleCount
  }));

  res.json({
    totalVehicles,
    vehiclesByType: Object.entries(vehiclesByType).map(([type, count]) => ({ _id: type, count })),
    vehiclesByIntersection
  });
});

// Traffic Signal Simulation
class TrafficController {
  constructor() {
    this.intersections = new Map();
    this.intervals = new Map();
  }

  async startIntersection(intersectionId) {
    try {
      const intersection = intersections.find(i => i._id == intersectionId);
      if (!intersection) return;

      intersection.isActive = true;
      intersection.signals = {
        north: { state: 'RED', duration: 30 },
        south: { state: 'RED', duration: 30 },
        east: { state: 'RED', duration: 30 },
        west: { state: 'RED', duration: 30 }
      };

      let cycle = 0;
      const interval = setInterval(() => {
        // North-South Green, East-West Red
        if (cycle % 2 === 0) {
          intersection.signals.north.state = 'GREEN';
          intersection.signals.south.state = 'GREEN';
          intersection.signals.east.state = 'RED';
          intersection.signals.west.state = 'RED';
        } else {
          // East-West Green, North-South Red
          intersection.signals.north.state = 'RED';
          intersection.signals.south.state = 'RED';
          intersection.signals.east.state = 'GREEN';
          intersection.signals.west.state = 'GREEN';
        }

        intersection.lastUpdated = new Date();

        // Emit to all connected clients
        io.emit('signalUpdate', {
          intersectionId: intersection._id,
          signals: intersection.signals
        });

        cycle++;
      }, 5000); // Change every 5 seconds for demo

      this.intervals.set(intersectionId, interval);

      // Simulate vehicle arrivals
      this.simulateVehicles(intersectionId);

    } catch (error) {
      console.error('Error starting intersection:', error);
    }
  }

  stopIntersection(intersectionId) {
    const interval = this.intervals.get(intersectionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(intersectionId);
    }
  }

  async simulateVehicles(intersectionId) {
    const vehicleInterval = setInterval(() => {
      try {
        const vehicleTypes = ['CAR', 'TRUCK', 'MOTORCYCLE', 'EMERGENCY'];
        const randomType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        
        const vehicle = {
          _id: Date.now(),
          vehicleId: `V${Date.now()}`,
          type: randomType,
          intersectionId: intersectionId,
          timestamp: new Date()
        };

        vehicles.push(vehicle);
        if (vehicles.length > 1000) vehicles.shift(); // Keep only last 1000

        // Update intersection vehicle count
        const intersection = intersections.find(i => i._id == intersectionId);
        if (intersection) {
          intersection.vehicleCount++;
        }

        io.emit('vehicleArrival', {
          intersectionId: intersectionId,
          vehicle: vehicle
        });

      } catch (error) {
        console.error('Error simulating vehicle:', error);
      }
    }, Math.random() * 3000 + 2000); // Random 2-5 seconds

    // Store vehicle interval (you might want to manage this better)
    setTimeout(() => clearInterval(vehicleInterval), 300000); // Stop after 5 minutes
  }
}

const trafficController = new TrafficController();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('startIntersection', (intersectionId) => {
    trafficController.startIntersection(intersectionId);
  });

  socket.on('stopIntersection', (intersectionId) => {
    trafficController.stopIntersection(intersectionId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
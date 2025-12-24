# 🚦 Traffic Signal Management System - Full Stack

A complete full-stack web application for managing traffic signals with real-time monitoring, built with React, Node.js, Express, MongoDB, and Socket.IO.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- HTML5 & CSS3
- JavaScript (ES6+)
- Socket.IO Client
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- RESTful APIs

## 🚀 Features

- **Real-time Traffic Control**: Live signal state updates using WebSockets
- **Interactive Dashboard**: Monitor all intersections in real-time
- **Vehicle Simulation**: Automatic vehicle generation and tracking
- **Statistics & Analytics**: Comprehensive traffic reports
- **Responsive Design**: Works on desktop and mobile devices
- **CRUD Operations**: Add, edit, delete intersections
- **Data Persistence**: MongoDB database storage

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env` file

### 3. Environment Configuration

Create `.env` file in root directory:
```env
MONGODB_URI=mongodb://localhost:27017/traffic_signals
PORT=5000
NODE_ENV=development
```

### 4. Run the Application

**Development Mode (Both servers):**
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start React frontend
npm run client
```

**Or run both simultaneously:**
```bash
# Install concurrently first
npm install -g concurrently

# Run both servers
npm run dev & npm run client
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## 📱 How to Use

### 1. Dashboard
- View all intersections and their current status
- See real-time signal states (Red/Yellow/Green)
- Monitor vehicle counts
- Start/stop intersections

### 2. Manage Intersections
- Add new intersections with name and location
- Delete existing intersections
- Control intersection operations

### 3. Statistics
- View traffic analytics
- See vehicle type distribution
- Monitor system performance
- Track recent activity

## 🔄 API Endpoints

### Intersections
```
GET    /api/intersections          # Get all intersections
POST   /api/intersections          # Create intersection
GET    /api/intersections/:id      # Get single intersection
PUT    /api/intersections/:id      # Update intersection
DELETE /api/intersections/:id      # Delete intersection
POST   /api/intersections/:id/start # Start intersection
POST   /api/intersections/:id/stop  # Stop intersection
```

### Vehicles
```
GET    /api/vehicles               # Get all vehicles
GET    /api/vehicles/intersection/:id # Get vehicles by intersection
GET    /api/vehicles/stats         # Get traffic statistics
POST   /api/vehicles               # Create vehicle (manual)
```

## 🌐 WebSocket Events

### Client → Server
- `startIntersection`: Start traffic simulation
- `stopIntersection`: Stop traffic simulation

### Server → Client
- `signalUpdate`: Real-time signal state changes
- `vehicleArrival`: New vehicle detected

## 📊 Database Schema

### Intersection Model
```javascript
{
  name: String,
  location: String,
  coordinates: { lat: Number, lng: Number },
  signals: {
    north: { state: String, duration: Number },
    south: { state: String, duration: Number },
    east: { state: String, duration: Number },
    west: { state: String, duration: Number }
  },
  vehicleCount: Number,
  isActive: Boolean,
  createdAt: Date,
  lastUpdated: Date
}
```

### Vehicle Model
```javascript
{
  vehicleId: String,
  type: String, // CAR, TRUCK, MOTORCYCLE, EMERGENCY
  intersectionId: ObjectId,
  direction: String,
  priority: Number,
  timestamp: Date,
  waitTime: Number
}
```

## 🎯 Testing the System

### Quick Test Flow:

1. **Start the application**
2. **Add an intersection**: Go to "Manage Intersections" → Add new
3. **Start simulation**: Click "Start Intersection" on dashboard
4. **Watch real-time updates**: Signals change every 5 seconds
5. **Monitor vehicles**: See vehicles arriving automatically
6. **Check statistics**: View analytics in Statistics tab

### Sample Data:
```javascript
// Sample intersection
{
  "name": "Main Street & 5th Avenue",
  "location": "Downtown Business District",
  "coordinates": { "lat": 40.7128, "lng": -74.0060 }
}
```

## 🔧 Customization

### Signal Timing
Edit `server.js` line 45 to change signal duration:
```javascript
}, 5000); // Change every 5 seconds
```

### Vehicle Generation Rate
Edit `server.js` line 85 to change vehicle frequency:
```javascript
}, Math.random() * 3000 + 2000); // Random 2-5 seconds
```

### Vehicle Types
Edit `server.js` line 73 to modify vehicle types:
```javascript
const vehicleTypes = ['CAR', 'TRUCK', 'MOTORCYCLE', 'EMERGENCY'];
```

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy backend code
3. Update frontend API URLs

### Frontend (Netlify/Vercel)
1. Build React app: `npm run build`
2. Deploy build folder
3. Update API endpoints

### Database (MongoDB Atlas)
1. Create cluster
2. Update connection string
3. Configure network access

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Socket.IO Connection Issues:**
- Check CORS settings in `server.js`
- Verify frontend Socket.IO URL matches backend

## 📈 Performance Tips

1. **Limit vehicle history**: Current limit is 100 vehicles
2. **Database indexing**: Add indexes for frequently queried fields
3. **Caching**: Implement Redis for session management
4. **Load balancing**: Use PM2 for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is for educational purposes. Feel free to use and modify!

---

**Happy Coding! 🚦✨**
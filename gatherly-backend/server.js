const seedTestEvent = require('./utils/seedTestEvent');

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const { authRoutes, eventRoutes, blogRoutes, profileRoutes } = require('./routes');
const afterglowRoutes = require('./routes/afterglow');
const socketHandler = require('./socket/socketHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// ✅ Allowed Origins Logic (Production Safe + Preview Safe)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

// CORS configuration for Express
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (origin.includes("localhost")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// ✅🔥 ADD THIS — DISABLE API CACHING (FIX 304 ISSUE)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Initialize Socket.io with same CORS logic
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin.includes("localhost") ||
        origin.includes("vercel.app") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  }
});

// Connect to MongoDB AND seed after successful connection
connectDB()
  .then(() => seedTestEvent())
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/afterglows', afterglowRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gatherly API is running' });
});

// Initialize Socket Handler
const cleanupSocket = socketHandler(io);

// Cleanup on server shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  if (cleanupSocket) cleanupSocket();
  process.exit(0);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
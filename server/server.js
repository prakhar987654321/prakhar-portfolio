const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection with Serverless cache handling
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prakhar_portfolio';
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('⚡ [MongoDB] Connected successfully to Database');
  } catch (err) {
    console.warn('⚠️ [MongoDB] Database connection skipped (Running in fallback mode):', err.message);
  }
};

// Connect DB initially
connectDB();

// Middleware to ensure DB connection on serverless requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    environment: process.version,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Mock',
    timestamp: new Date()
  });
});

// Routes
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/projects');
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Only start listen if not exported to serverless runtime (or on local)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 [Server] Prakhar's Portfolio is running at http://localhost:${PORT}`);
  });
}

module.exports = app;

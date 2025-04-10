const express = require('express');
const attendanceRoutes = require('./routes/attendance');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = 3001 || process.env.PORT;

// Connect to MongoDB
connectDB();

// CORS configuration for production
app.use(cors({
    origin: [
        process.env.CLIENT_URL,          // Your Netlify URL
        'https://bunker-baba.netlify.app', // Add your actual Netlify domain
        'http://localhost:5173'          // For local development
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Remove multer from here since it's already in the route
app.use('/api/attendance', attendanceRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', dbConnection: mongoose.connection.readyState === 1 });
});

app.get('/', (req, res) => {
  res.send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
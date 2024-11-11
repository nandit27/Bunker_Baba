const express = require('express');
const attendanceRoutes = require('./routes/attendance');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3001 || process.env.PORT;

// Global middleware
const allowedOrigins = [
  'http://localhost:5173',               // Local development
  'https://bunker-baba-n3p2.vercel.app/',      // Deployed frontend on Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Remove multer from here since it's already in the route
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express');
const attendanceRoutes = require('./routes/attendance');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3000;

// Global middleware
app.use(cors());
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
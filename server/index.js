import express from 'express';
import attendanceRoutes from './routes/attendance.js';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 3000;

// Global middleware
app.use(cors());
app.use(express.json());

// Remove multer from here since it's already in the route
app.use('/api/attendance', attendanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
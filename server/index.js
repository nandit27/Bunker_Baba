import express from 'express';
import attendanceRoutes from './routes/attendance.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/attendance', attendanceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
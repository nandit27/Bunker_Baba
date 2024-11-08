import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractAttendanceData } from '../utils/ocr.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const attendanceData = await extractAttendanceData(req.file.buffer);
    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/calculator', (req, res) => {
  res.sendFile(path.join(__dirname, '../../src/pages/AttendanceCalculator.jsx'));
});

export default router;
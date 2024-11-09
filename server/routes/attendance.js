import express from 'express';
import multer from 'multer';
import { extractAttendanceData, calculateAllowedSkips } from '../utils/ocr.js';

const router = express.Router();
const upload = multer();

router.post('/analyze', upload.single('screenshot'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageBuffer = req.file.buffer;
        const desiredAttendance = parseFloat(req.body.desiredAttendance);
        const timeFrame = req.body.timeFrame;

        // Extract attendance data using OCR
        const { ocrResults, parsedData } = await extractAttendanceData(imageBuffer);

        // Calculate remaining classes based on timeFrame
        const classesPerWeek = 5; // Adjust based on your schedule
        const weeksInTimeFrame = parseInt(timeFrame) || 4; // Default to 4 weeks if parsing fails
        const totalRemainingClasses = classesPerWeek * weeksInTimeFrame;

        // Calculate allowed skips
        const skipCalculation = calculateAllowedSkips(
            parsedData,
            parsedData.totalClasses + totalRemainingClasses,
            desiredAttendance
        );

        res.json({
            allowedSkips: skipCalculation.allowedSkips,
            attendanceData: parsedData,
            ocrResults: ocrResults,
            debug: {
                timeFrame,
                desiredAttendance,
                totalRemainingClasses,
                currentAttendance: parsedData.currentPercentage
            }
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
const express = require('express');
const multer = require('multer');
const { extractAttendanceData, calculateAllowedSkips } = require('../utils/ocr.js');

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
        // console.log('Parsed data:', parsedData);
        
        // Calculate remaining classes based on timeFrame
        const classesPerWeek = 20; // Adjust based on your schedule
        const weeksInTimeFrame = parseInt(timeFrame) || 4; // Default to 4 weeks if parsing fails
        const totalRemainingClasses = classesPerWeek * weeksInTimeFrame;
        // console.log('Total remaining classes:', totalRemainingClasses);
        

        // Calculate allowed skips
        const skipCalculation = calculateAllowedSkips(
            parsedData,
            desiredAttendance,
            parsedData.summary.totalClasses + totalRemainingClasses,
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

module.exports = router;
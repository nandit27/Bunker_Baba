const express = require('express');
const multer = require('multer');
const { extractAttendanceData, calculateAllowedSkips } = require('../utils/ocr.js');

const router = express.Router();
const upload = multer();;

router.post('/analyze', upload.single('screenshot'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageBuffer = req.file.buffer;
        const desiredAttendance = parseFloat(req.body.desiredAttendance) || 75; // Default to 75%
        const weeksRemaining = parseInt(req.body.timeFrame) || 4; // Default to 4 weeks

        // Extract attendance data using OCR
        const { ocrResults, parsedData } = await extractAttendanceData(imageBuffer);
        
        // Calculate allowed skips - just pass weeks remaining
        const skipCalculation = calculateAllowedSkips(
            parsedData,
            desiredAttendance,
            weeksRemaining  // Just pass the number of weeks
        );

        res.json({
            summary: skipCalculation.summary,
            courseWise: skipCalculation.courseWise,
            attendanceData: parsedData,
            ocrResults: ocrResults,
            debug: {
                weeksRemaining,
                desiredAttendance,
                currentAttendance: skipCalculation.summary.currentAttendance
            }
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
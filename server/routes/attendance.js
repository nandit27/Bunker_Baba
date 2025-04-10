const express = require('express');
const multer = require('multer');
const { extractAttendanceData, calculateAllowedSkips } = require('../utils/ocr.js');

const router = express.Router();
const upload = multer();;

router.post('/analyze', upload.single('screenshot'), async (req, res) => {
    try {
        console.log('Received request:', req.body);
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const department = req.body.department;
        const imageBuffer = req.file.buffer;
        const desiredAttendance = parseFloat(req.body.desiredAttendance) || 75;
        const weeksRemaining = parseInt(req.body.timeFrame) || 4;

        const { parsedData } = await extractAttendanceData(imageBuffer);

        // Calculate allowed skips is now async
        const skipCalculation = await calculateAllowedSkips(
            department,
            parsedData,
            desiredAttendance,
            weeksRemaining
        );

        res.json({
            summary: skipCalculation.summary,
            courseWise: skipCalculation.courseWise,
            attendanceData: parsedData,
            debug: {
                weeksRemaining,
                desiredAttendance,
                currentAttendance: skipCalculation.summary.currentAttendance
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
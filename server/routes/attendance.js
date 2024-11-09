import express from 'express';
import multer from 'multer';
import { extractAttendanceData, calculateRequiredAttendance } from '../utils/ocr.js';

const router = express.Router();
const upload = multer();

// Constants for class frequency
const CLASS_SCHEDULE = {
    'LECT': 2, // 2 lectures per week per subject
    'LAB': 2   // 2 labs per week per subject
};

function calculateFutureClassesFromTimeFrame(timeFrame, parsedData) {
    // Parse time frame value and unit
    const [value, unit] = timeFrame.toLowerCase().split(' ');
    const numericValue = parseInt(value);
    
    // Calculate total weeks based on time frame
    let totalWeeks;
    switch(unit) {
        case 'week':
        case 'weeks':
            totalWeeks = numericValue;
            break;
        case 'month':
        case 'months':
            totalWeeks = numericValue * 4;
            break;
        default:
            throw new Error('Invalid time frame format');
    }

    // Group subjects by type
    const subjectsByType = parsedData.reduce((acc, subject) => {
        acc[subject.type] = (acc[subject.type] || 0) + 1;
        return acc;
    }, {});

    // Calculate total future classes
    let totalFutureClasses = 0;
    Object.entries(subjectsByType).forEach(([type, count]) => {
        const classesPerWeek = CLASS_SCHEDULE[type] * count;
        totalFutureClasses += classesPerWeek * totalWeeks;
    });

    return {
        classesPerSubject: totalFutureClasses / parsedData.length,
        total: totalFutureClasses,
        weeks: totalWeeks,
        classBreakdown: Object.entries(subjectsByType).map(([type, count]) => ({
            type,
            count,
            weeklyClasses: CLASS_SCHEDULE[type] * count,
            totalClasses: CLASS_SCHEDULE[type] * count * totalWeeks
        }))
    };
}

router.post('/analyze', upload.single('screenshot'), async (req, res) => {
    try {
        // Validate request
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const imageBuffer = req.file.buffer;
        const desiredAttendance = parseFloat(req.body.desiredAttendance);
        const timeFrame = req.body.timeFrame;

        if (isNaN(desiredAttendance) || desiredAttendance < 0 || desiredAttendance > 100) {
            return res.status(400).json({
                success: false,
                error: 'Invalid desired attendance percentage'
            });
        }

        // Process attendance data
        const attendanceData = await extractAttendanceData(imageBuffer);
        
        if (!attendanceData.parsedData?.length) {
            return res.status(422).json({
                success: false,
                error: 'Failed to extract attendance data from image'
            });
        }

        // Calculate future projections
        const futureClasses = calculateFutureClassesFromTimeFrame(timeFrame, attendanceData.parsedData);
        const requirements = calculateRequiredAttendance(
            attendanceData,
            futureClasses.classesPerSubject,
            desiredAttendance
        );

        // Structure the response
        res.json({
            success: true,
            data: {
                current: {
                    totalClasses: requirements.currentStats.total,
                    attendedClasses: requirements.currentStats.attended,
                    percentage: Number(requirements.currentStats.percentage.toFixed(2)),
                    subjectCount: attendanceData.parsedData.length
                },
                projected: {
                    timeframe: {
                        input: timeFrame,
                        weeks: futureClasses.weeks,
                        futureClasses: futureClasses.total
                    },
                    requirements: {
                        classesNeeded: Math.ceil(requirements.futureStats.additionalClassesNeeded),
                        allowedAbsences: Math.floor(requirements.futureStats.allowedSkips),
                        weeklyTarget: Math.ceil(requirements.futureStats.additionalClassesNeeded / futureClasses.weeks)
                    },
                    final: {
                        totalClasses: requirements.futureStats.finalTotalClasses,
                        projectedPercentage: Number(requirements.futureStats.projectedFinalPercentage.toFixed(2)),
                        targetPercentage: desiredAttendance
                    }
                },
                breakdown: {
                    bySubjectType: futureClasses.classBreakdown,
                    subjects: attendanceData.parsedData.map(subject => ({
                        name: subject.name,
                        type: subject.type,
                        current: {
                            total: subject.totalClasses,
                            attended: subject.attendedClasses,
                            percentage: Number((subject.attendedClasses / subject.totalClasses * 100).toFixed(2))
                        }
                    }))
                }
            }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;
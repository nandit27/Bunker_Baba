const Tesseract = require('tesseract.js');

async function extractAttendanceData(imageBuffer) {
  try {
    const { data } = await Tesseract.recognize(imageBuffer, 'eng');
    // console.log('Extracted Data:', data);

    const ocrResults = {
      fullText: data.text,
      confidence: data.confidence,
      words: data.words?.map(word => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox
      })),
      paragraphs: data.paragraphs?.map(p => p.text)
    };

    // console.log('OCR Results:', ocrResults);

    const attendanceData = parseAttendanceData(data.text);
    // console.log('Parsed Attendance Data:', attendanceData);

    return {
      ocrResults: ocrResults.paragraphs,
      parsedData: attendanceData
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Error extracting attendance data: ' + error.message);
  }
}

function parseAttendanceData(text) {
  // console.log('Parsing Attendance Data:', text);

  const lines = text.split('\n').filter(line => line.trim());
  const coursePattern = /(HS|IT|MA|CSE|EC)\d+/;
  const attendancePattern = /(\d+)\s*\/\s*(\d+)/;
  const subjectData = [];
  let totalClasses = 0;
  let totalAttendedClasses = 0;

  for (const line of lines) {
    if (coursePattern.test(line)) {
      const attendanceMatch = line.match(attendancePattern);

      if (attendanceMatch) {
        const attended = parseInt(attendanceMatch[1]);
        const total = parseInt(attendanceMatch[2]);

        if (!isNaN(attended) && !isNaN(total)) {
          const courseMatch = line.match(/((?:HS|IT|MA|CSE|EC)\d+(?:\.\d+)?[A-Z\s/-]+)/);
          const courseCode = courseMatch ? courseMatch[1].trim() : 'Unknown';
          const type = line.includes('LAB') ? 'LAB' : 'LECT';

          subjectData.push({
            courseCode,
            type,
            attended,
            total,
            percentage: parseFloat(((attended / total) * 100).toFixed(2))
          });

          totalClasses += total;
          totalAttendedClasses += attended;
        }
      }
    }
  }

  return {
    subjects: subjectData,
    summary: {
      totalClasses,
      totalAttendedClasses
    }
  };
}

async function calculateAllowedSkips(department, attendance, desiredPercentage, weeksRemaining) {
  const weeklySchedule = await getWeeklySchedule(department);

  const { totalAttendedClasses: totalAttended, totalClasses } = attendance.summary;

  // Process raw attendance data into a structured format
  const processedData = attendance.subjects.reduce((acc, entry) => {
    const courseCode = entry.courseCode.split('/')[0].trim();
    const classType = entry.type.toUpperCase();

    if (!acc[courseCode]) {
      acc[courseCode] = { LECT: { present: 0, total: 0 }, LAB: { present: 0, total: 0 } };
    }

    acc[courseCode][classType].present = entry.attended;
    acc[courseCode][classType].total = entry.total;
    return acc;
  }, {});

  // Calculate future classes based on the weekly schedule
  const futureClasses = Math.floor(Object.entries(weeklySchedule).reduce((sum, [course, schedule]) => {
    const matchingCourse = Object.keys(weeklySchedule).find(key => key.includes(course.split('/')[0]));
    if (matchingCourse) {
      return sum + (schedule.lectures + schedule.labs);
    }
    return sum;
  }, 0) * weeksRemaining);

  // Calculate current and target metrics
  const currentPercentage = (totalAttended / totalClasses) * 100;
  const totalClassesIncludingRemaining = totalClasses + futureClasses;
  const minimumRequiredAttendance = Math.ceil((desiredPercentage / 100) * totalClassesIncludingRemaining);
  const additionalClassesNeeded = Math.max(0, minimumRequiredAttendance - totalAttended);
  const allowedSkips = Math.max(0, futureClasses - additionalClassesNeeded);

  // Generate course-wise recommendations
  const recommendations = Object.entries(processedData).map(([course, data]) => {
    const lecturePercentage = data.LECT.total ? (data.LECT.present / data.LECT.total) * 100 : null;
    const labPercentage = data.LAB.total ? (data.LAB.present / data.LAB.total) * 100 : null;

    // Find matching course in weekly schedule
    const courseKey = Object.keys(weeklySchedule).find(key => key.includes(course));
    const weeklyClasses = weeklySchedule[courseKey] || { lectures: 0, labs: 0 };
    const futureClassesForCourse = (weeklyClasses.lectures + weeklyClasses.labs) * weeksRemaining;

    return {
      summary: {
        currentAttendance: parseFloat(currentPercentage.toFixed(2)),
        totalClassesRemaining: futureClasses,
        requiredAttendance: minimumRequiredAttendance,
        allowedSkips: allowedSkips,
        additionalClassesNeeded
      },
      // Added recommendations for each course
      recommendations: {
        lecturePercentage,
        labPercentage,
        futureClassesForCourse
      }
    };
  });

  // Return recommendations along with other data
  return {
    recommendations,
    currentPercentage,
    allowedSkips
  };
}

module.exports = {
  extractAttendanceData,
  calculateAllowedSkips,
  parseAttendanceData
};
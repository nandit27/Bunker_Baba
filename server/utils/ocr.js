const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// Read the weekly schedule data
const weeklySchedulePath = path.join(__dirname, 'weeklySchedule.json');
const weeklySchedule = JSON.parse(fs.readFileSync(weeklySchedulePath, 'utf8'));

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

function calculateAllowedSkips(department, attendance, desiredPercentage, weeksRemaining) {
  // console.log('Calculating Allowed Skips:', attendance);
  
  // Check if the department exists in the weekly schedule
  if (!weeklySchedule[department]) {
    throw new Error(`Invalid department: ${department}`);
  }

  // Extract summary for easier access
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
  const departmentSchedule = weeklySchedule[department];
  const futureClasses = Math.floor(Object.entries(departmentSchedule).reduce((sum, [_, schedule]) => {
    return sum + (schedule.lectures + schedule.labs);
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

    // Find matching course in weekly schedule for the department
    const courseKey = Object.keys(departmentSchedule).find(key => key.includes(course));
    const weeklyClasses = courseKey ? departmentSchedule[courseKey] : { lectures: 0, labs: 0 };
    const futureClassesForCourse = (weeklyClasses.lectures + weeklyClasses.labs) * weeksRemaining;

    return {
      course,
      currentAttendance: {
        lectures: lecturePercentage ? `${lecturePercentage.toFixed(1)}%` : 'N/A',
        labs: labPercentage ? `${labPercentage.toFixed(1)}%` : 'N/A'
      },
      weeklyClasses,
      canSkip: (lecturePercentage && lecturePercentage > 85) || (labPercentage && labPercentage > 85),
      futureClasses: Math.floor(futureClassesForCourse),
      recommendation: (futureClasses <= additionalClassesNeeded) ? "Cannot miss lectures" : getRecommendation(lecturePercentage, labPercentage)
    };
  });

  function getRecommendation(lecturePercent, labPercent) {
    if (lecturePercent === null && labPercent === null) return "No data available";
    if ((lecturePercent && lecturePercent < 75) || (labPercent && labPercent < 75)) return "Cannot miss lectures";
    if (lecturePercent > 90 || labPercent > 90) return "Safe to miss some classes";
    return "Attend if possible";
  }

  const result = {
    summary: {
      currentAttendance: parseFloat(currentPercentage.toFixed(2)),
      totalClassesRemaining: futureClasses,
      requiredAttendance: minimumRequiredAttendance,
      allowedSkips: allowedSkips,
      additionalClassesNeeded
    },
    courseWise: recommendations
  };

  // console.log("\nAttendance Analysis Summary:");
  // console.table(result.summary);

  // console.log("\nCourse-wise Recommendations:");
  // console.table(result.courseWise.map(r => ({
  //   Course: r.course,
  //   'Current Lectures': r.currentAttendance.lectures,
  //   'Current Labs': r.currentAttendance.labs,
  //   'Weekly Classes': `${r.weeklyClasses.lectures} lec, ${r.weeklyClasses.labs} lab`,
  //   'Recommendation': r.recommendation
  // })));

  return result;
}

// Make sure to export all required functions
module.exports = {
  extractAttendanceData,
  calculateAllowedSkips,
  parseAttendanceData
};
const Tesseract = require('tesseract.js');
const fs = require('fs').promises; // For async file operations

async function getWeeklySchedule(department) {
  try {
    const data = await fs.readFile('./weeklySchedule.json', 'utf-8');
    const schedules = JSON.parse(data);
    if (!schedules[department]) {
      throw new Error(`Department ${department} not found in weekly schedule.`);
    }
    return schedules[department];
  } catch (error) {
    console.error('Error loading weekly schedule:', error.message);
    throw error;
  }
}

async function extractAttendanceData(imageBuffer) {
  try {
    const { data } = await Tesseract.recognize(imageBuffer, 'eng');

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

    const attendanceData = parseAttendanceData(data.text);
    return {
      ocrResults: ocrResults.paragraphs,
      parsedData: attendanceData
    };
  } catch (error) {
    console.error('OCR Error:', error.message);
    throw new Error('Error extracting attendance data: ' + error.message);
  }
}

function parseAttendanceData(text) {
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

  const futureClasses = Math.floor(Object.entries(weeklySchedule).reduce((sum, [_, schedule]) => {
    return sum + (schedule.lectures + schedule.labs);
  }, 0) * weeksRemaining);

  const currentPercentage = (totalAttended / totalClasses) * 100;
  const totalClassesIncludingRemaining = totalClasses + futureClasses;
  const minimumRequiredAttendance = Math.ceil((desiredPercentage / 100) * totalClassesIncludingRemaining);
  const additionalClassesNeeded = Math.max(0, minimumRequiredAttendance - totalAttended);
  const allowedSkips = Math.max(0, futureClasses - additionalClassesNeeded);

  return {
    summary: {
      currentAttendance: parseFloat(currentPercentage.toFixed(2)),
      totalClassesRemaining: futureClasses,
      requiredAttendance: minimumRequiredAttendance,
      allowedSkips: allowedSkips,
      additionalClassesNeeded
    }
  };
}

module.exports = {
  getWeeklySchedule,
  extractAttendanceData,
  calculateAllowedSkips,
  parseAttendanceData
};

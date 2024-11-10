const Tesseract = require('tesseract.js');

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
    console.error('OCR Error:', error);
    throw new Error('Error extracting attendance data: ' + error.message);
  }
}

function parseAttendanceData(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const coursePattern = /(HS|IT|MA)\d+/;
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
          const courseMatch = line.match(/((?:HS|IT|MA)\d+(?:\.\d+)?[A-Z\s/-]+)/);
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




function calculateAllowedSkips(attendanceData, desiredPercentage = 75, totalRemainingClasses = 0) {
  // Input validation
  if (!attendanceData?.summary?.totalClasses || !attendanceData?.summary?.totalAttendedClasses) {
    throw new Error('Invalid attendance data');
  }
  if (desiredPercentage <= 0 || desiredPercentage > 100) {
    throw new Error('Desired percentage must be between 0 and 100');
  }
  if (totalRemainingClasses < 0) {
    throw new Error('Remaining classes cannot be negative');
  }

  const totalClasses = attendanceData.summary.totalClasses;
  const totalAttended = attendanceData.summary.totalAttendedClasses;
  const totalClassesIncludingRemaining = totalClasses + totalRemainingClasses;

  // Calculate the minimum number of classes required to maintain the desired percentage
  const minimumRequiredAttendance = Math.ceil((desiredPercentage / 100) * totalClassesIncludingRemaining);

  // Calculate how many more classes need to be attended to meet the minimum requirement
  const additionalClassesNeeded = Math.max(0, minimumRequiredAttendance - totalAttended);

  // Calculate the allowed number of skips
  const allowedSkipClasses = Math.max(0, totalRemainingClasses - additionalClassesNeeded);

  // Calculate the final percentage if maximum skips are taken
  const finalPercentage = ((totalAttended + (totalRemainingClasses - allowedSkipClasses)) / totalClassesIncludingRemaining) * 100;

  console.table({
    allowedSkips: allowedSkipClasses,
    remainingClasses: totalRemainingClasses,
    requiredAttendance: minimumRequiredAttendance,
    additionalClassesNeeded,
    currentAttended: totalAttended,
    totalClasses,
    totalClassesIncludingRemaining,
    currentPercentage: (totalAttended / totalClasses) * 100,
    finalPercentage,
    targetPercentage: desiredPercentage
  });

  return {
    allowedSkips: allowedSkipClasses,
    remainingClasses: totalRemainingClasses,
    requiredAttendance: minimumRequiredAttendance,
    additionalClassesNeeded,
    currentAttended: totalAttended,
    totalClasses,
    totalClassesIncludingRemaining,
    currentPercentage: (totalAttended / totalClasses) * 100,
    finalPercentage,
    targetPercentage: desiredPercentage
  };
}

module.exports = { extractAttendanceData, calculateAllowedSkips };
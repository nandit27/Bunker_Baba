import Tesseract from 'tesseract.js';

export async function extractAttendanceData(imageBuffer) {
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

    // Parse extracted text into structured attendance data
    const attendanceData = parseAttendanceData(data.text);
    
    // Aggregate totals across all subjects
    const totalStats = calculateTotalAttendance(attendanceData);

    return {
      ocrResults: ocrResults.paragraphs,
      parsedData: attendanceData,
      totalStats
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Error extracting attendance data: ' + error.message);
  }
}

// Parses attendance text to extract subject data
function parseAttendanceData(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const coursePattern = /(HS|IT|MA)\d+/;
  const attendancePattern = /(\d+)\s*\/\s*(\d+)/;
  const subjectData = [];

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
        }
      }
    }
  }

  return subjectData;
}

// Aggregates attendance totals across all subjects
function calculateTotalAttendance(subjectData) {
  const total = subjectData.reduce(
    (acc, subject) => {
      acc.totalAttended += subject.attended;
      acc.totalClasses += subject.total;
      return acc;
    },
    { totalAttended: 0, totalClasses: 0 }
  );

  total.currentPercentage = parseFloat(((total.totalAttended / total.totalClasses) * 100).toFixed(2));
  return total;
}

// Calculates future attendance requirements
export function calculateRequiredAttendance(currentStats, futureClassesPerSubject, desiredPercentage) {
  const numberOfSubjects = currentStats.parsedData.length;
  const totalFutureClasses = futureClassesPerSubject * numberOfSubjects;
  
  const currentTotalAttended = currentStats.totalStats.totalAttended;
  const currentTotalClasses = currentStats.totalStats.totalClasses;
  
  const finalTotalClasses = currentTotalClasses + totalFutureClasses;
  const requiredTotalClasses = Math.ceil((desiredPercentage / 100) * finalTotalClasses);
  const additionalClassesNeeded = Math.max(0, requiredTotalClasses - currentTotalAttended);
  const maxSkippableClasses = totalFutureClasses - additionalClassesNeeded;
  
  return {
    currentStats: {
      attended: currentTotalAttended,
      total: currentTotalClasses,
      percentage: parseFloat(((currentTotalAttended / currentTotalClasses) * 100).toFixed(2))
    },
    futureStats: {
      totalNewClasses: totalFutureClasses,
      finalTotalClasses: finalTotalClasses,
      requiredAttendance: requiredTotalClasses,
      additionalClassesNeeded: additionalClassesNeeded,
      allowedSkips: Math.max(0, maxSkippableClasses),
      projectedFinalPercentage: parseFloat(((requiredTotalClasses / finalTotalClasses) * 100).toFixed(2))
    }
  };
}

// Calculates the required attendance percentage for remaining classes
export function calculateRequiredPercentageForRemaining(currentStats, futureClassesPerSubject, desiredPercentage) {
  const { futureStats: future } = calculateRequiredAttendance(
    currentStats,
    futureClassesPerSubject,
    desiredPercentage
  );
  
  const percentageNeeded = (future.additionalClassesNeeded / future.totalNewClasses) * 100;
  
  return {
    percentageNeeded: parseFloat(percentageNeeded.toFixed(2)),
    classesNeeded: future.additionalClassesNeeded,
    totalRemainingClasses: future.totalNewClasses
  };
}
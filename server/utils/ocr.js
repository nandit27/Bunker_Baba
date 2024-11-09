// ocr.js
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

    const attendanceData = parseAttendanceData(data.text);
    
    return {
      ocrResults,
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

  for (const line of lines) {
      if (coursePattern.test(line)) {
          let totalAttended = 0;
          let totalClasses = 0;
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

                  totalAttended += attended;
                  totalClasses += total;
              }
          }
      }
  }

  // Calculate overall attendance percentage
  const currentPercentage = totalClasses > 0 ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(2)) : 0;

  return { subjectData, totalClasses, totalAttended, currentPercentage };
}

export function calculateAllowedSkips(currentAttendance, totalClasses, desiredPercentage) {
  const currentAttended = currentAttendance.attendedClasses;
  const remainingClasses = totalClasses - currentAttendance.totalClasses;
  
  // Calculate minimum classes needed to maintain desired percentage
  const totalRequiredClasses = Math.ceil((desiredPercentage / 100) * totalClasses);
  const additionalClassesNeeded = Math.max(0, totalRequiredClasses - currentAttended);
  
  const allowedSkips = Math.max(0, remainingClasses - additionalClassesNeeded);
  
  return {
    allowedSkips,
    remainingClasses,
    requiredAttendance: additionalClassesNeeded,
    totalRequiredClasses,
    currentAttended,
    totalClasses
  };
}
import React, { createContext, useContext, useState } from 'react';

// Create context
const AttendanceContext = createContext(null);

// Context provider component
export const AttendanceProvider = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [allowedSkips, setAllowedSkips] = useState(0);
  const [subjects, setSubjects] = useState([]);

  // Function to update attendance data and process subject information
  const updateAttendanceData = (data) => {
    if (!data) {
      setAttendanceData(null);
      setAllowedSkips(0);
      setSubjects([]);
      return;
    }

    setAttendanceData(data);
    
    // Extract allowed skips count
    if (data.summary && data.summary.allowedSkips) {
      setAllowedSkips(data.summary.allowedSkips);
    }
    
    // Transform course data to subjects format for skip planner
    if (data.courseWise && Array.isArray(data.courseWise)) {
      const formattedSubjects = data.courseWise.map((course, index) => {
        // Set default values for required fields
        const priority = 
          course.recommendation === "Cannot miss lectures" ? "High" :
          course.recommendation === "Safe to miss some classes" ? "Low" : "Medium";
          
        return {
          id: index + 1,
          name: course.course || `Subject ${index + 1}`,
          type: course.courseType === 'THEORY' ? 'THEORY' : 'LAB',
          attendance: course.percentage || 0,
          totalClasses: course.totalClasses || course.futureClasses || 0,
          weeklyClasses: Math.max(1, Math.ceil((course.totalClasses || course.futureClasses || 0) / 15)), // Estimate weekly classes
          priority: priority
        };
      });
      
      setSubjects(formattedSubjects);
    }
  };

  return (
    <AttendanceContext.Provider 
      value={{ 
        attendanceData, 
        allowedSkips, 
        subjects,
        updateAttendanceData
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook to use the context
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === null) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}; 
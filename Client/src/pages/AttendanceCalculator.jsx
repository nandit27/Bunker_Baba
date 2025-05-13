import React, { useState } from 'react';
import {
  Card,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
} from '../components/ui/index.jsx';
import { Loader } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadAttendanceScreenshot from '../components/UploadAttendanceScreenshot';
import SetAttendanceGoal from '../components/SetAttendanceGoal';
import DefineTimeFrame from '../components/DefineTimeFrame';
import SelectDepartment from '../components/SelectDepartment';
import { useAnalyzeAttendance } from '../services/attendance';

// Helper function to convert timeFrame strings to numbers
const parseTimeFrame = (value) => {
  if (typeof value === 'number') return value;
  
  const timeValue = String(value).trim().toLowerCase();
  
  // Extract numeric part
  const numericValue = parseInt(timeValue.match(/\d+/)?.[0] || "4", 10);
  
  // Convert based on unit
  if (timeValue.includes('month')) {
    return numericValue * 4; // 1 month = 4 weeks
  } else if (timeValue.includes('week')) {
    return numericValue;
  } else {
    return numericValue; // Default to the numeric value
  }
};

const AttendanceCalculator = () => {
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState('IT');
  const [attendanceScreenshot, setAttendanceScreenshot] = useState(null);
  const [desiredAttendance, setDesiredAttendance] = useState(90);
  const [timeFrame, setTimeFrame] = useState('1 month');
  const [attendanceData, setAttendanceData] = useState(null);
  
  // Use React Query mutation hook
  const { mutate, isPending } = useAnalyzeAttendance();

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  };

  const handleScreenshotUpload = (file) => {
    setAttendanceScreenshot(file);
    setStep(2);
  };

  const handleAttendanceGoalChange = (value) => {
    setDesiredAttendance(value);
  };

  const handleTimeFrameChange = (date) => {
    setTimeFrame(date);
  };

  const calculateAllowedSkips = () => {
    // Parse timeFrame to ensure it's a number
    const parsedTimeFrame = parseTimeFrame(timeFrame);
    
    const formData = new FormData();
    formData.append('department', department);
    formData.append('screenshot', attendanceScreenshot);
    formData.append('desiredAttendance', desiredAttendance.toString());
    formData.append('timeFrame', parsedTimeFrame.toString());

    // Use the mutation from React Query
    mutate(formData, {
      onSuccess: (data) => {
        console.log('API Response:', data);
        
        // Create a properly formatted data object based on the API response
        const formattedData = {
          summary: {
            currentAttendance: 0,
            totalClassesRemaining: 0, 
            additionalClassesNeeded: 0,
            allowedSkips: 0
          },
          courseWise: []
        };
        
        // Extract data from the API response based on the actual structure
        console.log(data);
        if (data) {
          formattedData.summary.currentAttendance = data.attendance.overallPercentage;
          formattedData.summary.totalClassesRemaining = data.recommendations.summary.futureClasses;
          formattedData.summary.additionalClassesNeeded = Math.round(data.recommendations.summary.additionalClassesNeeded);
          formattedData.summary.allowedSkips = Math.round(data.recommendations.summary.allowedSkips);
          // Transform attendance records into course-wise data
          if (data.attendance && data.attendance.records && Array.isArray(data.attendance.records)) {
            formattedData.courseWise = data.attendance.records.map((record) => {
              // Determine recommendation based on attendance percentage
              let recommendation = 'No recommendation';
              const percentage = parseFloat(record.percentage) || 0;
              
              if (percentage < 75) {
                recommendation = 'Cannot miss lectures';
              } else if (percentage >= 85) {
                recommendation = 'Safe to miss some classes';
              } else {
                recommendation = 'Attend regularly';
              }
              
              const courseType = record.classType || '';
              const courseName = record.subjectName;
              
              return {
                course: courseName,
                courseType: courseType, // Keep the original type too
                recommendation: recommendation,
                futureClasses: parseInt(record.attended, 10) || 0,
                percentage: percentage
              };
            });
          }
        }
        
        console.log('Formatted data for display:', formattedData);
        setAttendanceData(formattedData);
      },
      onError: (error) => {
        console.error('Error:', error);
        // Add error handling here
      }
    });
  };

  const handleReset = () => {
    setStep(1);
    setDepartment('IT');
    setAttendanceScreenshot(null);
    setDesiredAttendance(90);
    setTimeFrame('1 month');
    setAttendanceData(null);
  };

  // Render the attendance summary with safe property access
  const AttendanceSummary = ({ summary }) => {
    // Check if summary object exists and has the expected properties
    if (!summary || typeof summary !== 'object') {
      return (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-600">Summary data is not available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Attendance</p>
            <p className="text-2xl font-bold">
              {summary.currentAttendance}%
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Classes Remaining</p>
            <p className="text-2xl font-bold">
              {summary.totalClassesRemaining}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Additional Classes Needed</p>
            <p className="text-2xl font-bold">
              {summary.additionalClassesNeeded}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Allowed Skips</p>
            <p className="text-2xl font-bold">
              {summary.allowedSkips}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render the course-wise analysis with safe property access
  const CourseWiseAnalysis = ({ courses }) => {
    // Check if courses array exists and is not empty
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Course-wise Analysis</h3>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600">Course data is not available.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Course-wise Analysis</h3>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                course.recommendation === "Cannot miss lectures"
                  ? 'border-red-200 bg-red-50'
                  : course.recommendation === "Safe to miss some classes"
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg">{course.course || 'Unknown Course'}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Current Attendance: <span className="font-medium">{course.percentage !== undefined ? course.percentage : 'N/A'}%</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  course.recommendation === "Cannot miss lectures"
                    ? 'bg-red-100 text-red-800'
                    : course.recommendation === "Safe to miss some classes"
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.recommendation || 'No recommendation'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Classes Attended: {course.futureClasses !== undefined ? course.futureClasses : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header step={step} />
      <Card className="my-8 mx-auto max-w-4xl flex-grow">
        {step === 1 && (
          <SelectDepartment
            department={department}
            onDepartmentChange={handleDepartmentChange}
          />
        )}
        {step === 2 && (
          <UploadAttendanceScreenshot onUpload={handleScreenshotUpload} />
        )}
        {step === 3 && (
          <SetAttendanceGoal
            desiredAttendance={desiredAttendance}
            onAttendanceGoalChange={handleAttendanceGoalChange}
          />
        )}
        {step === 4 && (
          <DefineTimeFrame
            timeFrame={timeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
        )}
        {step < 4 && (
          <div className="flex justify-end mt-4">
            <Button
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black-800 rounded-lg transition duration-200"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !department}
            >
              Next
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className="flex justify-between mt-4">
            <Button
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black-800 rounded-lg transition duration-200"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
              onClick={calculateAllowedSkips}
              disabled={isPending}
            >
              {isPending ? <Loader className="animate-spin" /> : 'Calculate'}
            </Button>
          </div>
        )}
      </Card>

      {attendanceData && (
        <Modal open={!!attendanceData} onOpenChange={() => setAttendanceData(null)}>
          <ModalContent className="fixed inset-4 sm:inset-auto sm:max-w-3xl sm:mx-auto sm:my-16">
            <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
              <div className="flex-1 overflow-y-auto p-6">
                <AttendanceSummary summary={attendanceData.summary} />
                <CourseWiseAnalysis courses={attendanceData.courseWise} />
              </div>
              <ModalFooter className="border-t bg-white p-4">
                <Button variant="secondary" onClick={handleReset}>
                  Okay
                </Button>
              </ModalFooter>
            </div>
          </ModalContent>
        </Modal>
      )}
      <Footer className="absolute inset-x-0 bottom-0" />
    </div>
  );
};

export default AttendanceCalculator;
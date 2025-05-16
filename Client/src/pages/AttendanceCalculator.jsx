import React, { useState } from 'react';
import {
  Card,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
} from '../components/ui/index.jsx';
import { Loader, Check, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadAttendanceScreenshot from '../components/UploadAttendanceScreenshot';
import SetAttendanceGoal from '../components/SetAttendanceGoal';
import DefineTimeFrame from '../components/DefineTimeFrame';
import SelectDepartment from '../components/SelectDepartment';
import { useAnalyzeAttendance } from '../services/attendance';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';

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
  
  const navigate = useNavigate();
  const { updateAttendanceData } = useAttendance();
  
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
                percentage: percentage,
                totalClasses: parseInt(record.total, 10) || 0
              };
            });
          }
        }
        
        console.log('Formatted data for display:', formattedData);
        setAttendanceData(formattedData);
        
        // Update the attendance context with the new data
        updateAttendanceData(formattedData);
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
    
    // Clear the attendance context data
    updateAttendanceData(null);
  };

  // Render the attendance summary with safe property access
  const AttendanceSummary = ({ summary }) => {
    // Check if summary object exists and has the expected properties
    if (!summary || typeof summary !== 'object') {
      return (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-700">Summary data is not available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100">
            <p className="text-sm font-medium text-indigo-600 mb-1">Current Attendance</p>
            <p className="text-3xl font-bold text-gray-800">
              {summary.currentAttendance}%
            </p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100">
            <p className="text-sm font-medium text-purple-600 mb-1">Classes Remaining</p>
            <p className="text-3xl font-bold text-gray-800">
              {summary.totalClassesRemaining}
            </p>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-100">
            <p className="text-sm font-medium text-blue-600 mb-1">Additional Classes Needed</p>
            <p className="text-3xl font-bold text-gray-800">
              {summary.additionalClassesNeeded}
            </p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100">
            <p className="text-sm font-medium text-emerald-600 mb-1">Allowed Skips</p>
            <p className="text-3xl font-bold text-gray-800">
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Course-wise Analysis</h3>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-700">Course data is not available.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Course-wise Analysis</h3>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl shadow-sm ${
                course.recommendation === "Cannot miss lectures"
                  ? 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-100'
                  : course.recommendation === "Safe to miss some classes"
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100'
                    : 'bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">{course.course || 'Unknown Course'}</h4>
                  <p className="text-sm mt-1">
                    Current Attendance: <span className="font-medium text-gray-800">{course.percentage !== undefined ? course.percentage : 'N/A'}%</span>
                  </p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  course.recommendation === "Cannot miss lectures"
                    ? 'bg-red-100 text-red-700'
                    : course.recommendation === "Safe to miss some classes"
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {course.recommendation || 'No recommendation'}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Classes Attended: {course.futureClasses !== undefined ? course.futureClasses : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Header step={step - 1} />
      <div className="max-w-4xl mx-auto px-4 pb-20 pt-6">
        <Card className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
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
            <div className="flex justify-end px-8 pb-8 pt-2">
              <Button
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !department) || 
                  (step === 2 && !attendanceScreenshot) || 
                  (step === 3 && !desiredAttendance)
                }
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {step === 4 && (
            <div className="flex justify-between px-8 pb-8 pt-2">
              <Button
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border border-gray-200"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2"
                onClick={calculateAllowedSkips}
                disabled={isPending || !timeFrame}
              >
                {isPending ? <Loader className="animate-spin w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Calculate
              </Button>
            </div>
          )}
        </Card>
      </div>

      {attendanceData && (
        <Modal open={!!attendanceData} onOpenChange={() => setAttendanceData(null)}>
          <ModalContent className="fixed inset-4 sm:inset-auto sm:max-w-3xl sm:mx-auto sm:my-16 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
              <div className="flex-1 overflow-y-auto p-6">
                <AttendanceSummary summary={attendanceData.summary} />
                <CourseWiseAnalysis courses={attendanceData.courseWise} />
                
                <div className="mt-8 p-5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm border border-indigo-200">
                  <h3 className="text-2xl font-semibold mb-2 text-indigo-800">Want to plan your class skips?</h3>
                  <p className="text-gray-700 mb-4">
                    Use our smart Bunk Planner to distribute your bunkssss ({attendanceData.summary.allowedSkips}) 
                    across different subjects based on priority, attendance, and more!
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md py-2.5 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setAttendanceData(null);
                      navigate('/skip-planner');
                    }}
                  >
                    Go to Skip Planner
                  </Button>
                </div>
              </div>
              <ModalFooter className="border-t border-gray-100 bg-gray-50 p-4 flex justify-between">
                <Button 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-200"
                  onClick={() => setAttendanceData(null)}
                >
                  Close
                </Button>
              </ModalFooter>
            </div>
          </ModalContent>
        </Modal>
      )}
      <Footer className="mt-auto" />
    </div>
  );
};

export default AttendanceCalculator;
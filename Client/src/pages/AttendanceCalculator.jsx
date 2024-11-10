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

const AttendanceCalculator = () => {
  const [step, setStep] = useState(1);
  const [attendanceScreenshot, setAttendanceScreenshot] = useState(null);
  const [desiredAttendance, setDesiredAttendance] = useState(90);
  const [timeFrame, setTimeFrame] = useState('1 month');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const calculateAllowedSkips = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('screenshot', attendanceScreenshot);
    formData.append('desiredAttendance', desiredAttendance.toString());
    formData.append('timeFrame', timeFrame);

    try {
      const response = await fetch('/api/attendance/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error:', error);
      // Add error handling here
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAttendanceScreenshot(null);
    setDesiredAttendance(90);
    setTimeFrame('1 month');
    setAttendanceData(null);
  };

  const AttendanceSummary = ({ summary }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Current Attendance</p>
          <p className="text-2xl font-bold">{summary.currentAttendance.toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Classes Remaining</p>
          <p className="text-2xl font-bold">{summary.totalClassesRemaining}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Additional Classes Needed</p>
          <p className="text-2xl font-bold">{summary.additionalClassesNeeded}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Allowed Skips</p>
          <p className="text-2xl font-bold">{summary.allowedSkips}</p>
        </div>
      </div>
    </div>
  );

  const CourseWiseAnalysis = ({ courses }) => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Course-wise Analysis</h3>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${course.canSkip === false
              ? 'border-red-200 bg-red-50'
              : course.canSkip === true
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
              }`}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">{course.course}</h4>
              <span className={`px-3 py-1 rounded-full text-sm ${course.canSkip === false
                ? 'bg-red-100 text-red-800'
                : course.canSkip === true
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                {course.recommendation}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Future Classes: {course.futureClasses}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Header step={step} />
      <Card className="my-8">
        {step === 1 && (
          <UploadAttendanceScreenshot onUpload={handleScreenshotUpload} />
        )}
        {step === 2 && (
          <SetAttendanceGoal
            desiredAttendance={desiredAttendance}
            onAttendanceGoalChange={handleAttendanceGoalChange}
          />
        )}
        {step === 3 && (
          <DefineTimeFrame
            timeFrame={timeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
        )}
        {step < 3 && (
          <div className="flex justify-end">
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !attendanceScreenshot}
            >
              Next
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="flex justify-between">
            <Button onClick={handleReset}>Reset</Button>
            <Button
              variant="primary"
              onClick={calculateAllowedSkips}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : 'Calculate'}
            </Button>
          </div>
        )}
      </Card>

      {attendanceData && (
        <Modal open={!!attendanceData} onOpenChange={() => setAttendanceData(null)}>
          <ModalContent className="max-w-2xl">
            <div className="space-y-6 p-4">
              <AttendanceSummary summary={attendanceData.summary} />
              <CourseWiseAnalysis courses={attendanceData.courseWise} />
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={handleReset}>
                Start Over
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Footer />
    </div>
  );
};

export default AttendanceCalculator;
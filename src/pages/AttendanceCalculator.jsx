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
  const [calculationResults, setCalculationResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);
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
      if (!data || !data.currentStats) {
        throw new Error('Invalid response format from server');
      }
      
      setCalculationResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAttendanceScreenshot(null);
    setDesiredAttendance(90);
    setTimeFrame('1 month');
    setCalculationResults(null);
    setShowResults(false);
    setError(null);
  };

  const renderResults = () => {
    if (!calculationResults || !calculationResults.currentStats) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-600">Unable to load results. Please try again.</p>
        </div>
      );
    }

    const { currentStats, futureStats, recommendations } = calculationResults;

    return (
      <div className="space-y-6 p-4">
        <h2 className="text-2xl font-bold text-center mb-6">Attendance Analysis</h2>
        
        {/* Current Status Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Current Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Classes Attended</p>
              <p className="text-lg font-medium">{currentStats?.attended || 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Classes</p>
              <p className="text-lg font-medium">{currentStats?.total || 0}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Current Percentage</p>
              <p className="text-2xl font-semibold text-blue-600">
                {currentStats?.percentage?.toFixed(1) || '0'}%
              </p>
            </div>
          </div>
        </div>

        {/* Future Projections Section */}
        {futureStats && recommendations && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              Over the Next {futureStats.timeFrame?.value || timeFrame}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">New Classes</p>
                <p className="text-lg font-medium">{futureStats.totalNewClasses || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Required Attendance</p>
                <p className="text-lg font-medium">
                  {recommendations.minimumAttendanceNeeded || 0} classes 
                  ({recommendations.averageWeeklyAttendance || 0} per week)
                </p>
              </div>
              <div className="pt-2 border-t border-blue-100">
                <p className="text-lg font-bold text-blue-800">
                  You can skip up to {recommendations.maximumSkips || 0} classes
                </p>
                <p className="text-sm text-gray-600">
                  while maintaining {desiredAttendance}% attendance
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Final Projection */}
        {recommendations && (
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">Projected Final Attendance</p>
            <p className="text-3xl font-bold text-green-600">
              {recommendations.projectedFinalPercentage?.toFixed(1) || desiredAttendance}%
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Header step={step} />
      <Card className="my-8">
        {error && (
          <div className="p-4 mb-4 text-red-600 bg-red-50 rounded">
            {error}
          </div>
        )}
        
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
      {showResults && (
        <Modal open={showResults} onOpenChange={setShowResults}>
          <ModalContent>
            {renderResults()}
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
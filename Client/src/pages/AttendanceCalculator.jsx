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
  const [allowedSkips, setAllowedSkips] = useState(0);
  const [showResults, setShowResults] = useState(false);
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
        console.log('OCR Results:', data);
        setAllowedSkips(data.allowedSkips);
        setShowResults(true);
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
    setAllowedSkips(0);
    setShowResults(false);
  };

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
      {showResults && (
        <Modal open={showResults} onOpenChange={setShowResults}>
          <ModalContent>
            <h2 className="text-2xl font-bold mb-4">
              You can miss {allowedSkips} classes to maintain your attendance at {desiredAttendance}% over the next {timeFrame}.
            </h2>
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
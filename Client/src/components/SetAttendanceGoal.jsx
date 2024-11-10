import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Slider } from '../components/ui';

const SetAttendanceGoal = ({ desiredAttendance, onAttendanceGoalChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Attendance Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Set the attendance percentage you want to maintain.</p>
        <Slider
          value={desiredAttendance}
          onValueChange={onAttendanceGoalChange}
          min={50}
          max={100}
          step={1}
        />
        <div className="text-2xl font-bold">{desiredAttendance}%</div>
      </CardContent>
    </Card>
  );
};

export default SetAttendanceGoal; 
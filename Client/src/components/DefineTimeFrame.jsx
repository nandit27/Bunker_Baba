import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

const DefineTimeFrame = ({ timeFrame, onTimeFrameChange }) => {
  const timeFrameOptions = [
    '1 week',
    '2 weeks',
    '1 month',
    '2 months',
    '3 months',
    '6 months'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Define Time Frame</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Select the time period for your attendance goal.</p>
        <div className="grid grid-cols-2 gap-4">
          {timeFrameOptions.map((option) => (
            <button
              key={option}
              onClick={() => onTimeFrameChange(option)}
              className={`p-4 rounded-lg border ${
                timeFrame === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DefineTimeFrame; 
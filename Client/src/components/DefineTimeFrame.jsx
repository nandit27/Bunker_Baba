import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const DefineTimeFrame = ({ timeFrame, onTimeFrameChange }) => {
  const [selectedAnimation, setSelectedAnimation] = useState('');
  
  const timeFrames = [
    { value: '1 week', icon: '🎯', label: 'Quick Sprint' },
    { value: '2 weeks', icon: '⚡', label: 'Power Sprint' },
    { value: '1 month', icon: '📅', label: 'Monthly Goal' },
    { value: '2 months', icon: '🎓', label: 'Term Goal' },
    { value: '3 months', icon: '🌟', label: 'Quarter Goal' },
    { value: '6 months', icon: '🏆', label: 'Semester Goal' }
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        <Clock className="w-6 h-6 text-indigo-600" />
        Choose Your Timeline
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {timeFrames.map((frame) => (
            <button
              key={frame.value}
              onClick={() => {
                setSelectedAnimation(frame.value);
                setTimeout(() => onTimeFrameChange(frame.value), 300);
              }}
              className={`p-5 rounded-xl text-center transition-all duration-300 border ${
                timeFrame === frame.value
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105 border-transparent'
                  : 'bg-white text-gray-800 hover:border-indigo-200 hover:shadow-md border-gray-100'
              } ${selectedAnimation === frame.value ? 'animate-pulse' : ''}`}
              aria-label={`Select ${frame.label}`}
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedAnimation(frame.value);
                  setTimeout(() => onTimeFrameChange(frame.value), 300);
                }
              }}
            >
              <div className="text-3xl mb-2">{frame.icon}</div>
              <div className="font-medium">{frame.value}</div>
              <div className="text-sm mt-1 opacity-75">{frame.label}</div>
            </button>
          ))}
        </div>
        
        {/* Timeline Visualization */}
        <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-900 font-medium">Your Journey:</span>
            <span className="text-gray-800">Today</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="text-indigo-600 font-medium">{timeFrame} later</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineTimeFrame;
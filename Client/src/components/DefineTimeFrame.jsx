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
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        Choose Your Timeline
      </h2>
      
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          {timeFrames.map((frame) => (
            <button
              key={frame.value}
              onClick={() => {
                setSelectedAnimation(frame.value);
                setTimeout(() => onTimeFrameChange(frame.value), 300);
              }}
              className={`p-6 rounded-xl text-center transition-all duration-300 ${
                timeFrame === frame.value
                  ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              } ${selectedAnimation === frame.value ? 'animate-wiggle' : ''}`}
            >
              <div className="text-3xl mb-2">{frame.icon}</div>
              <div className="font-medium">{frame.value}</div>
              <div className="text-sm mt-1 opacity-75">{frame.label}</div>
            </button>
          ))}
        </div>
        
        {/* Timeline Visualization */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">Your Journey:</span>
            <span className="text-gray-800">Today</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium">{timeFrame} later</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineTimeFrame;
import React, { useState } from 'react';
import { Target, Smile, Frown, Trophy } from 'lucide-react';

const SetAttendanceGoal = ({ desiredAttendance, onAttendanceGoalChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const getEmoji = () => {
    if (desiredAttendance >= 90) return { icon: Trophy, text: "Excellence!", color: "text-indigo-600" };
    if (desiredAttendance >= 80) return { icon: Smile, text: "Good Goal!", color: "text-purple-600" };
    return { icon: Frown, text: "Aim Higher!", color: "text-blue-600" };
  };
  
  const emoji = getEmoji();
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        <Target className="w-6 h-6 text-indigo-600" />
        Set Your Attendance Goal
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className={`w-28 h-28 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center transform transition-all duration-500 shadow-lg ${
            isAnimating ? 'scale-110 rotate-180' : ''
          }`}>
            <div className="text-3xl font-bold text-white">
              {desiredAttendance}%
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <emoji.icon className={`w-5 h-5 ${emoji.color}`} />
            <span className={`font-medium ${emoji.color}`}>{emoji.text}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <label htmlFor="attendance-slider" className="sr-only">Attendance goal percentage</label>
          <input
            id="attendance-slider"
            type="range"
            min="75"
            max="100"
            value={desiredAttendance}
            onChange={(e) => {
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 500);
              onAttendanceGoalChange(parseInt(e.target.value));
            }}
            className="w-full h-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            aria-valuemin="75"
            aria-valuemax="100"
            aria-valuenow={desiredAttendance}
          />
          
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>75%</span>
            <span className="text-center">Minimum Required</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Motivational Message */}
        <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <p className="text-center text-indigo-800 font-medium">
            {desiredAttendance >= 90 ? "🌟 Aiming for excellence! You've got this!" :
             desiredAttendance >= 80 ? "💪 Good target! Stay consistent!" :
             "🎯 A little higher can make a big difference!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetAttendanceGoal;
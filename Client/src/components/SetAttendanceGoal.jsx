import React, { useState } from 'react';
import { Target, Smile, Frown, Trophy } from 'lucide-react';

const SetAttendanceGoal = ({ desiredAttendance, onAttendanceGoalChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const getEmoji = () => {
    if (desiredAttendance >= 90) return { icon: Trophy, text: "Excellence!", color: "text-gray-900" };
    if (desiredAttendance >= 80) return { icon: Smile, text: "Good Goal!", color: "text-gray-700" };
    return { icon: Frown, text: "Aim Higher!", color: "text-gray-600" };
  };
  
  const emoji = getEmoji();
  
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Target className="w-6 h-6" />
        Set Your Attendance Goal
      </h2>
      
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-black to-gray-800 flex items-center justify-center transform transition-all duration-500 ${
            isAnimating ? 'scale-110 rotate-180' : ''
          }`}>
            <div className="text-4xl font-bold text-white">
              {desiredAttendance}%
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <emoji.icon className={`w-6 h-6 ${emoji.color}`} />
            <span className={`font-medium ${emoji.color}`}>{emoji.text}</span>
          </div>
        </div>
        
        <input
          type="range"
          min="75"
          max="100"
          value={desiredAttendance}
          onChange={(e) => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 500);
            onAttendanceGoalChange(parseInt(e.target.value));
          }}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
        
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>75%</span>
          <span>100%</span>
        </div>
        
        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-center text-gray-800">
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
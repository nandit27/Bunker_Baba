import React from 'react';
import { BookOpen, Trophy, Target } from 'lucide-react';

const Header = ({ step }) => {
  const steps = [
    { text: 'Upload Screenshot', icon: BookOpen },
    { text: 'Set Goal', icon: Target },
    { text: 'Define Timeframe', icon: Trophy }
  ];
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-violet-600 py-8 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: Math.random() * 100 + 50 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 10 + 's'
            }}
          />
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Let's Track Your Academic Journey! 🎓
        </h1>
        
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center transform transition-all duration-300 ${
                index <= step ? 'bg-emerald-400 rotate-0 scale-100' : 'bg-white/20 -rotate-6 scale-95'
              } group-hover:scale-110`}>
                <step.icon className={`w-8 h-8 ${
                  index <= step ? 'text-indigo-900' : 'text-white'
                }`} />
              </div>
              <div className="hidden sm:block mt-3 text-sm font-medium text-white">
                {step.text}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute h-0.5 bg-white/20 w-24 top-8 left-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { BookOpen, Trophy, Target } from 'lucide-react';

const Header = ({ step }) => {
  const steps = [
    { text: 'Upload Screenshot', icon: BookOpen },
    { text: 'Set Goal', icon: Target },
    { text: 'Define Timeframe', icon: Trophy }
  ];
  
  return (
    <header className="bg-white-500 py-8 relative overflow-hidden">  
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-black mb-8 text-center">
          Let's Track Your Academic Journey! 🎓
        </h1>
        
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center transform transition-all duration-300 ${
                index <= step ? 'bg-black rotate-0 scale-100' : 'bg-black/20 -rotate-6 scale-95'
              } group-hover:scale-110`}>
                <step.icon className={`w-8 h-8 ${
                  index <= step ? 'text-white' : 'text-black'
                }`} />
              </div>
              <div className="hidden sm:block mt-3 text-sm font-medium text-black">
                {step.text}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute h-0.5 bg-black/20 w-24 top-8 left-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
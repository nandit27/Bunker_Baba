import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Users, Target, Calendar, BarChart3 } from 'lucide-react';
import CountUp from 'react-countup';

const StatsCard = ({ icon: Icon, number, label, subtext, gradient, isVisible }) => {
  const finalNumber = parseFloat(number);
  
  return (
    <div className={`bg-white shadow-lg p-8 rounded-xl border border-gray-100 transform hover:scale-105 transition-all duration-300 overflow-hidden relative hover:shadow-xl`}>
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradient}`}></div>
      <div className="flex flex-col items-start gap-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient.replace('from-', 'from-').replace('to-', 'to-').replace('600', '100').replace('500', '50')} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${gradient.includes('indigo') ? 'text-indigo-600' : gradient.includes('purple') ? 'text-purple-600' : gradient.includes('emerald') ? 'text-emerald-600' : 'text-blue-600'}`} />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {isVisible && (
                <CountUp
                  start={0}
                  end={finalNumber}
                  duration={2.5}
                  decimals={finalNumber % 1 !== 0 ? 1 : 0}
                />
              )}
            </span>
            <span className={`text-2xl ${gradient.includes('indigo') ? 'text-indigo-600' : gradient.includes('purple') ? 'text-purple-600' : gradient.includes('emerald') ? 'text-emerald-600' : 'text-blue-600'}`}>+</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mt-2">{label}</h3>
          <p className="text-gray-600 mt-1 text-sm">{subtext}</p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2, // Triggers when 20% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const gradients = [
    'from-indigo-600 to-blue-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-blue-600 to-cyan-600'
  ];

  return (
    <div className="relative overflow-hidden py-24" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Bunker Baba Analytics
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Making attendance management smarter since 2024
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            icon={Calculator}
            number="98.5"
            label="Accuracy Rate"
            subtext="Prediction Accuracy"
            gradient={gradients[0]}
            isVisible={isVisible}
          />
          
          <StatsCard 
            icon={Users}
            number="1500"
            label="Active Users"
            subtext="Monthly Active Students"
            gradient={gradients[1]}
            isVisible={isVisible}
          />
          
          <StatsCard 
            icon={Target}
            number="25000"
            label="Calculations"
            subtext="Successful Predictions"
            gradient={gradients[2]}
            isVisible={isVisible}
          />
          
          <StatsCard 
            icon={Calendar}
            number="180"
            label="College Days"
            subtext="Optimized Planning"
            gradient={gradients[3]}
            isVisible={isVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
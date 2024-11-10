import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Users, Target, Calendar } from 'lucide-react';
import CountUp from 'react-countup';

const StatsCard = ({ icon: Icon, number, label, subtext, className = "", isVisible }) => {
  const finalNumber = parseFloat(number);
  
  return (
    <div className="bg-white shadow-lg p-8 rounded-xl transform hover:scale-105 transition-transform hover:shadow-xl">
      <div className="flex flex-col items-start gap-4">
        <Icon className="w-8 h-8 text-blue-600" />
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
            <span className="text-2xl text-blue-600">+</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mt-2">{label}</h3>
          <p className="text-black-600 mt-1 text-sm">{subtext}</p>
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

  return (
    <div className="w-full bg-gray-50 py-24" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            BunkerBaba <span className="text-black-600">Analytics</span>
          </h1>
          <p className="text-gray-600 text-xl">
            Making attendance management smarter since 2024
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard 
            icon={Calculator}
            number="98.5"
            label="Accuracy Rate"
            subtext="Prediction Accuracy"
            isVisible={isVisible}
          />
          
          <StatsCard 
            icon={Users}
            number="1500"
            label="Active Users"
            subtext="Monthly Active Students"
            isVisible={isVisible}
          />
          
          <StatsCard 
            icon={Target}
            number="25000"
            label="Calculations"
            subtext="Successful Predictions"
            isVisible={isVisible}
          />
          
          <StatsCard 
            icon={Calendar}
            number="180"
            label="College Days"
            subtext="Optimized Planning"
            isVisible={isVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
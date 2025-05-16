import React from 'react';
import card from './assets/card1.jpeg';
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from 'lucide-react';

const SecondSection = () => {
  return (
    <div className="relative w-full py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-4">
        {/* Left side - Enhanced content showcase */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 to-purple-100/60 rounded-2xl transform rotate-2 group-hover:rotate-1 transition-transform"></div>
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform -rotate-1 group-hover:rotate-0 transition-transform border border-gray-100">
            <div className="relative p-5">
              {/* Decorative dots */}
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              
              {/* Image container */}
              <div className="pt-10"> 
                <img 
                  src={card}
                  alt="Attendance tracking interface"
                  className="w-full h-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Enhanced content */}
        <div className="flex flex-col justify-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100 text-indigo-600 text-sm font-medium">
              <Target className="w-4 h-4" />
              <span>Track Smarter</span>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Track Your Bunks, Baba Style!
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Baba ke saath stay updated! Easily record your attendance and keep track of safe bunks, all in one place. Our system helps you maximize your free time while maintaining the required attendance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2">
                Update Now
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl shadow-sm transition-all duration-200">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
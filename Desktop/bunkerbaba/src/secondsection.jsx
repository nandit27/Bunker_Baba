import React from 'react';
import { Button } from "@/components/ui/button";

const SecondSection = () => {
  return (
    
    <div className="relative w-full py-32"> {/* Increased vertical padding */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-4"> {/* Increased gap between grid items */}
        {/* Left side - Enhanced placeholder area */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-2xl transform rotate-2 group-hover:rotate-1 transition-transform"></div>
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform -rotate-1 group-hover:rotate-0 transition-transform">
            <div className="w-full h-[500px] bg-[repeating-linear-gradient(45deg,#f0f0f0,#f0f0f0 10px,#f5f5f5 10px,#f5f5f5 20px)]">
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Enhanced content */}
        <div className="flex flex-col justify-center px-4 md:px-8">
          <div className="space-y-8"> {/* Increased vertical spacing between elements */}
            <h2 className="text-4xl font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Double Click to Update Anything
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Double click the image placeholders to add images. Do the same for any text, 
              then tweak styles and publish.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Button className="bg-black text-white hover:bg-gray-800 transition-colors hover:shadow-lg">
                Get Started
              </Button>
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50 transition-colors">
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
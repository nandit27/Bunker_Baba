import React from 'react';
import insight from './assets/bulb.png';
import ocr from './assets/OCR.png';
import plan from './assets/plan.png';
import { Button } from "@/components/ui/button";

const getImage = (title) => {
  switch (title) {
    case "Attendance Insights":
      return insight;
    case "OCR-Powered Tracking":
      return ocr;
    case "Lecture Bunk Plan":
      return plan;
    default:
      return "";
  }
};

const FeatureCard = ({ title, description, buttonText}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full h-48 rounded-lg mb-6">
        <img 
          src={getImage(title)}  
          alt={title}
          className="w-full h-full object-contain rounded-lg"  
        />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button variant="outline" className="w-full justify-center">
        {buttonText}
      </Button>
    </div>
  );
};

const FeatureCards = () => {
  const features = [
    {
      title: "Attendance Insights",
      description: "Get detailed insights on your attendance status, including missed lectures and available bunks. Stay on top of your attendance easily!",
      buttonText: "Learn More"
    },
    {
      title: "OCR-Powered Tracking",
      description: "Upload screenshots of attendance records, and let Bunker Baba automatically process and organize the data for you.",
      buttonText: "See How It Works"
    },
    {
      title: "Lecture Bunk Plan",
      description: "Plan your bunks ahead! Know how many lectures you can afford to miss while meeting the required attendance threshold.",
      buttonText: "Try It Out"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;

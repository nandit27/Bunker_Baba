import React from 'react';
import insight from './assets/bulb.png';
import ocr from './assets/OCR.png';
import plan from './assets/plan.png';
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, FileText, Calendar } from 'lucide-react';

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

const getIcon = (title) => {
  switch (title) {
    case "Attendance Insights":
      return Lightbulb;
    case "OCR-Powered Tracking":
      return FileText;
    case "Lecture Bunk Plan":
      return Calendar;
    default:
      return ChevronRight;
  }
};

const getGradient = (index) => {
  const gradients = [
    'from-indigo-50 to-blue-50 border-indigo-100',
    'from-purple-50 to-pink-50 border-purple-100',
    'from-emerald-50 to-teal-50 border-emerald-100'
  ];
  return gradients[index % gradients.length];
};

const getButtonGradient = (index) => {
  const gradients = [
    'from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700',
    'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
  ];
  return gradients[index % gradients.length];
};

const FeatureCard = ({ title, description, buttonText, index }) => {
  const Icon = getIcon(title);
  const gradient = getGradient(index);
  const buttonGradient = getButtonGradient(index);
  
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative group`}>
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${buttonGradient}`}></div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="w-full h-40 mb-6 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
        <img 
          src={getImage(title)}  
          alt={title}
          className="w-full h-full object-contain rounded-lg"  
        />
      </div>
      
      <p className="text-gray-600 mb-6 min-h-[4rem]">{description}</p>
      
      <Button 
        className={`w-full justify-center bg-gradient-to-r ${buttonGradient} text-white rounded-xl shadow-md py-3 transition-all duration-200 flex items-center gap-2`}
      >
        {buttonText}
        <ChevronRight className="w-4 h-4" />
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
    <div className="relative overflow-hidden py-24">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Smart Features for Smart Students
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            The toolkit you need to master your attendance and make informed decisions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;

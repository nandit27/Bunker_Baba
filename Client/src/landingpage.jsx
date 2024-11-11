import React from 'react';
import SecondSection from './secondsection';
import baba from './assets/baba.png';
import { Button } from "@/components/ui/button";
import FeatureCards from './featurecards';
import FAQSection from './faq';
import Footer from './footer';
import AnalyticsSection from './analytics';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative flex items-center justify-between p-4 z-50">
        <div className="flex items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-black rounded-full"></div>
          <span className="ml-2 text-lg md:text-xl font-semibold">Bunker Baba</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-900">Home</button>
          <button className="text-gray-600 hover:text-gray-900">Dashboard</button>
          <button className="text-gray-600 hover:text-gray-900">About</button>
          <button className="text-gray-600 hover:text-gray-900">User</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-2 md:hidden z-50">
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50">
              Home
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50">
              Dashboard
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50">
              About
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50">
              User
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 text-center">
        <div className="relative flex justify-center mb-4 md:mb-8">        
          <img 
            src={baba}
            alt="Zen character" 
            className="w-64 h-64 md:w-96 md:h-96 object-contain relative animate-float"
          />
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-[#1D1D1F]">
          Ace The Art Of Bunking Wisely.
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
          Lectures ka hisaab,
          <br />
          Baba se poocho jawaab.
        </p>

        <div className="flex justify-center gap-3 md:gap-4">
          <Button 
            className="px-4 py-2 md:px-6 md:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base"
            onClick={() => navigate('/calculator')}
          >
            Try Now !
          </Button>
          <Button 
            variant="outline"
            className="px-4 py-2 md:px-6 md:py-3 bg-transparent border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Learn More
          </Button>
        </div>
      </main>

      {/* Second Section */}
      <SecondSection />
      
      {/* Feature Cards */}
      <FeatureCards />

      {/* Analytics */}
      <AnalyticsSection/>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
   
    </div>
  );
};

export default LandingPage;
import React from 'react';
import SecondSection from './secondsection';
import baba from './assets/baba.png';
import { Button } from "@/components/ui/button";
import FeatureCards from './featurecards';
import FAQSection from './faq';
import Footer from './components/Footer';
import AnalyticsSection from './analytics';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Calculator, PlaneTakeoff, Info } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform hover:rotate-6">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Bunker Baba</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => navigate('/')}
            >
              <span>Home</span>
            </button>
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => navigate('/calculator')}
            >
              <Calculator className="w-4 h-4" />
              <span>Attendance Calculator</span>
            </button>
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => navigate('/skip-planner')}
            >
              <PlaneTakeoff className="w-4 h-4" />
              <span>Skip Planner</span>
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors">
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50">
            <div className="py-2 px-4 max-w-7xl mx-auto">
              <button
                className="w-full text-left flex items-center gap-2 py-3 text-gray-700 hover:text-indigo-600 transition-colors border-b border-gray-100"
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
              >
                <span>Home</span>
              </button>
              <button
                className="w-full text-left flex items-center gap-2 py-3 text-gray-700 hover:text-indigo-600 transition-colors border-b border-gray-100"
                onClick={() => {
                  navigate('/calculator');
                  setIsMenuOpen(false);
                }}
              >
                <Calculator className="w-4 h-4" />
                <span>Attendance Calculator</span>
              </button>
              <button
                className="w-full text-left flex items-center gap-2 py-3 text-gray-700 hover:text-indigo-600 transition-colors border-b border-gray-100"
                onClick={() => {
                  navigate('/skip-planner');
                  setIsMenuOpen(false);
                }}
              >
                <PlaneTakeoff className="w-4 h-4" />
                <span>Bunk Planner</span>
              </button>
              <button className="w-full text-left flex items-center gap-2 py-3 text-gray-700 hover:text-indigo-600 transition-colors">
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 text-center pt-24 pb-20">
        <div className="relative flex justify-center mb-8 md:mb-12">
          <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <img
            src={baba}
            alt="Zen character"
            className="w-64 h-64 md:w-96 md:h-96 object-contain relative animate-float z-10"
          />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Ace The Art Of Bunking Wisely
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 md:mb-10">
          Lectures ka hisaab,
          <br />
          Baba se poocho jawaab.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all duration-200 text-base"
            onClick={() => navigate('/calculator')}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Attendance
          </Button>
          <Button
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl shadow-sm transition-all duration-200 text-base"
            onClick={() => navigate('/skip-planner')}
          >
            <PlaneTakeoff className="w-5 h-5 mr-2" />
            Plan Your Bunks
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
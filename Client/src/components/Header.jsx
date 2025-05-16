import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Trophy, Menu, X, Home, Calculator, PlaneTakeoff, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Header = ({ step }) => {
  const location = useLocation();
  const isSkipPlannerPage = location.pathname === '/skip-planner';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { text: 'Upload Screenshot', icon: BookOpen },
    { text: 'Set Goal', icon: Target },
    { text: 'Define Timeframe', icon: Trophy }
  ];

  const getCurrentPageName = () => {
    if (location.pathname === '/') return 'Home';
    if (location.pathname === '/calculator') return 'Attendance Calculator';
    if (location.pathname === '/skip-planner') return 'Bunk Planner';
    return '';
  };
  
  return (
    <>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform hover:rotate-6">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Bunker Baba
                </span>
              </Link>
            </div>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link to="/calculator" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors">
                <Calculator className="w-4 h-4" />
                <span>Calculator</span>
              </Link>
              <Link to="/skip-planner" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors">
                <PlaneTakeoff className="w-4 h-4" />
                <span>Bunk Planner</span>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Home className="w-5 h-5 text-indigo-600" />
                <span>Home</span>
              </Link>
              <Link to="/calculator" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Calculator className="w-5 h-5 text-indigo-600" />
                <span>Attendance Calculator</span>
              </Link>
              <Link to="/skip-planner" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <PlaneTakeoff className="w-5 h-5 text-indigo-600" />
                <span>Bunk Planner</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Page Header Content */}
      <header className="pt-24 pb-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 mix-blend-multiply blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 mix-blend-multiply blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-200 rounded-full opacity-20 mix-blend-multiply blur-2xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">{getCurrentPageName()}</span>
          </div>
          
          {/* Page Title - Only shown when not on Skip Planner page */}
          {!isSkipPlannerPage && (
            <div className="space-y-2 mb-8">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Academic Journey Tracker
              </h1>
              <p className="text-gray-600">
                Track your progress and achieve your academic goals
              </p>
            </div>
          )}
          
          {/* Steps Indicator - Only on Calculator Page */}
          {!isSkipPlannerPage && (
            <div className="mt-10 relative">
              {/* Progress Bar */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 rounded-full z-0">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(step !== undefined ? step : 0) * 50}%` }}
                ></div>
              </div>
              
              {/* Steps */}
              <div className="relative z-10 flex justify-between">
                {steps.map((s, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transform transition-all duration-500 ${
                      index <= (step || -1) 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-100' 
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}>
                      <s.icon className="w-8 h-8" />
                    </div>
                    <div className="mt-3 text-center">
                      <span className={`font-medium transition-colors ${
                        index <= (step || -1) ? 'text-indigo-600' : 'text-gray-500'
                      }`}>
                        {s.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
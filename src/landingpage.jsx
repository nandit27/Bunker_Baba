import React from 'react';
import baba from './assets/baba.png';


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center">
          {/* Logo */}
          <div className="w-8 h-8 bg-black rounded-full"></div>
          <span className="ml-2 text-xl font-semibold">Framer</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-900">Product</button>
          <button className="text-gray-600 hover:text-gray-900">Login</button>
          <button className="text-gray-600 hover:text-gray-900">Sign Up</button>
          <button className="text-gray-600 hover:text-gray-900">Pricing</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-16 text-center">
        {/* Add your image here */}
        <div className="flex justify-center mb-8">
          <img 
            src={baba} 
            alt="Zen character" 
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Hero Text */}
        <h1 className="text-6xl font-bold mb-4 leading-tight">
          Ship sites with style.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Go from design to site with Framer, 
          <br />
          the web builder for creative pros.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
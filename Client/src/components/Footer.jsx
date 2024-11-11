import React from 'react';
import { HelpCircle, BookOpen, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black py-6 mt-auto border border-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="text-white">
            <p className="text-lg font-medium">Attendance Tracker</p>
            <p className="text-sm text-white-600">Making attendance management fun! 🎉</p>
          </div>
          
          <div className="flex gap-6">
            <button className="flex items-center gap-2 text-white hover:text-gray-800 transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </button>
            <button className="flex items-center gap-2 text-white hover:text-gray-800 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>FAQ</span>
            </button>
            <button className="flex items-center gap-2 text-white hover:text-gray-800 transition-colors">
              <Mail className="w-5 h-5" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
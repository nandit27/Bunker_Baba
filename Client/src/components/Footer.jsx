import React from 'react';
import { HelpCircle, BookOpen, Mail, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-white" />
                </div>
                <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Bunker Baba
                </p>
              </div>
              <p className="text-sm text-gray-500">Making attendance management fun! ✨</p>
            </div>
            
            <div className="flex gap-6 flex-wrap justify-center">
              <Link to="#" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Help</span>
              </Link>
              <Link to="#" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">FAQ</span>
              </Link>
              <Link to="#" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Contact</span>
              </Link>
              <Link to="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-500">
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by Bunker Baba Team
            </p>
            <p className="mt-2">© {new Date().getFullYear()} Bunker Baba. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
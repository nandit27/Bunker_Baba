import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, HelpCircle, Heart, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    Application: ['Dashboard', 'Attendance Tracker', 'Bunk Planner', 'Analytics'],
    Company: ['About Us', 'Team', 'Careers', 'Contact'],
    Legal: ['Terms of Use', 'Privacy Policy', 'Data Security']
  };

  return (
    <footer className="bg-white pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bunker Baba
              </span>
            </div>
            <p className="text-gray-600 mb-6">
              Making attendance management smarter and more enjoyable for students everywhere.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="md:col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Stay Updated</h3>
            <div className="flex flex-col gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-sm transition-all duration-200">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Bunker Baba. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
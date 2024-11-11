import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = {
    Application: ['Dashboard', 'Attendance Tracker', 'Analytics', 'Updates'],
    Company: ['About Us', 'Team', 'Contact'],
    Legal: ['Terms of Use', 'Privacy Policy', 'Data Security']
  };

  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 col-span-2 sm:col-span-3 md:col-span-1">
            <h3 className="font-semibold">Contact Us:</h3>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="max-w-[200px]"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            © Bunker Baba, {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
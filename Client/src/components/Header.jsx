import React from 'react';
import { Card } from '@/components/ui';

const Header = ({ step }) => {
  return (
    <Card className="my-8">
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Let's Crunch Your Attendance Numbers! 📊</h3>
        <div className="flex items-center">
          <div
            className={`w-8 h-2 bg-gray-300 mr-2 ${
              step === 1 ? 'bg-primary' : ''
            }`}
          />
          <div
            className={`w-8 h-2 bg-gray-300 mr-2 ${
              step === 2 ? 'bg-primary' : ''
            }`}
          />
          <div
            className={`w-8 h-2 bg-gray-300 mr-2 ${
              step === 3 ? 'bg-primary' : ''
            }`}
          />
        </div>
      </div>
    </Card>
  );
};

export default Header;
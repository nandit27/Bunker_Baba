import React from 'react';
import { Button } from "@/components/ui/button";

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full h-48 bg-[repeating-linear-gradient(45deg,#f0f0f0,#f0f0f0 10px,#f5f5f5 10px,#f5f5f5 20px)] rounded-lg mb-6"></div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button variant="outline" className="w-full justify-center">
        Read More
      </Button>
    </div>
  );
};

const FeatureCards = () => {
  const features = [
    {
      title: "Scaling Your Site",
      description: "Learn about testing built for scale and reliability"
    },
    {
      title: "Optimize for SEO",
      description: "Learn how Framer can optimize your site for search engines"
    },
    {
      title: "CMS Examples",
      description: "See it pushed to its max, 100 community clients and more"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
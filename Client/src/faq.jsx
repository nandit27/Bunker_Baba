// components/FAQSection.jsx
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { HelpCircle, Plus, Minus } from 'lucide-react';

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Bunker Baba?",
      answer: "Bunker Baba is an intelligent attendance tracking system designed specifically for college students. It helps you monitor your attendance, predict attendance patterns, and manage your academic attendance requirements effectively."
    },
    {
      question: "Is it easy to use?",
      answer: "Absolutely! Simply upload your attendance records or use our OCR feature to scan them. Our intuitive interface makes it easy to track, analyze, and plan your attendance with just a few clicks."
    },
    {
      question: "Do I need technical knowledge?",
      answer: "Not at all! Bunker Baba is designed to be user-friendly for all students. Whether you're tech-savvy or not, you can easily navigate and use all features without any technical expertise."
    },
    {
      question: "How accurate is the attendance prediction?",
      answer: "Our attendance prediction algorithm boasts a 98.5% accuracy rate. We utilize advanced data analysis techniques to provide you with reliable recommendations for managing your attendance."
    }
  ];

  return (
    <div className="relative overflow-hidden py-24">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl text-center">
            Get answers to common questions about Bunker Baba
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-gray-100 last:border-b-0 py-2"
              >
                <AccordionTrigger className="flex items-center justify-between py-4 text-left text-lg font-medium text-gray-800 hover:text-indigo-600 transition-colors">
                  {faq.question}
                  {/* Custom icons handled through CSS */}
                </AccordionTrigger>
                <AccordionContent className="py-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">Still have questions?</p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
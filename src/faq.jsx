// components/FAQSection.jsx
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";

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
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
      <div className="max-w-2xl mx-auto">
        <Accordion type="single" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger data-value={`item-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent data-value={`item-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQSection;
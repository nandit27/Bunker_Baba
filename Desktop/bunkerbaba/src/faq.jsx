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
      question: "What is Framer?",
      answer: "Framer is a powerful web design and development platform that allows creative professionals to build and ship custom websites with ease."
    },
    {
      question: "Is it easy to use?",
      answer: "Yes! Framer is designed to be intuitive while providing professional-grade features. Our visual interface makes it simple to create stunning websites."
    },
    {
      question: "Do I need to code?",
      answer: "No coding is required to create websites with Framer, though developers can extend functionality using custom code when needed."
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
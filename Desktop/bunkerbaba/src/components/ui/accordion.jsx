// components/ui/accordion.jsx
import React, { createContext, useContext, useState } from "react";

const AccordionContext = createContext({});

export const Accordion = ({ children, type = "single", className = "", ...props }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (value) => {
    if (type === "single") {
      setOpenItems(new Set(openItems.has(value) ? [] : [value]));
    } else {
      const newOpenItems = new Set(openItems);
      if (newOpenItems.has(value)) {
        newOpenItems.delete(value);
      } else {
        newOpenItems.add(value);
      }
      setOpenItems(newOpenItems);
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={`space-y-1.5 ${className}`} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ children, value, className = "", ...props }) => {
  return (
    <div className={`border-b ${className}`} {...props}>
      {children}
    </div>
  );
};

export const AccordionTrigger = ({ children, className = "", ...props }) => {
  const { openItems, toggleItem } = useContext(AccordionContext);
  const value = props["data-value"];

  return (
    <button
      className={`flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 ${className}`}
      onClick={() => toggleItem(value)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 transition-transform duration-200"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
};

export const AccordionContent = ({ children, className = "", ...props }) => {
  const { openItems } = useContext(AccordionContext);
  const value = props["data-value"];
  const isOpen = openItems.has(value);

  return isOpen ? (
    <div
      className={`overflow-hidden text-sm pb-4 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  ) : null;
};
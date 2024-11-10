import React from 'react';

export const Card = ({ children, className }) => {
  return <div className={`p-6 bg-white rounded-lg shadow ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const Button = ({ children, onClick, variant = "default", disabled, className, href }) => {
  const variants = {
    default: "bg-gray-200 hover:bg-gray-300",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600"
  };

  const classes = `px-4 py-2 rounded ${variants[variant]} ${className}`;

  return href ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export const Modal = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        {children}
      </div>
    </div>
  );
};

export const ModalContent = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

export const ModalFooter = ({ children }) => {
  return <div className="flex justify-end space-x-2 mt-4">{children}</div>;
};

export const CardHeader = ({ children, className }) => {
  return <div className={`p-6 pb-2 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
  return <h3 className={`text-2xl font-bold ${className}`}>{children}</h3>;
};

export const FileInput = ({ label, placeholder, onSelectedFile }) => {
  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onSelectedFile(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
        accept="image/*"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-gray-50"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-2 text-sm text-gray-500">{label}</p>
          <p className="text-xs text-gray-500">{placeholder}</p>
        </div>
      </label>
    </div>
  );
};

export const Slider = ({ value, onValueChange, min, max, step, className }) => {
  return (
    <div className={`w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-500">{value}</span>
      </div>
    </div>
  );
};
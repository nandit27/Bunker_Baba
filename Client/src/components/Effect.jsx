import React, { useState, useEffect, useRef } from 'react';

const TypewriterEffect = ({
  text,
  speed = 5,
  showCursor = false,
  onComplete = () => {},
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < textRef.current.length) {
      const currentChar = textRef.current[currentIndex];

      let typingSpeed;
      if (['.', '!', '?'].includes(currentChar)) {
        typingSpeed = speed * 2;
      } else if ([',', ';', ':'].includes(currentChar)) {
        typingSpeed = speed * 1.5;
      } else if (currentChar === ' ') {
        typingSpeed = speed;
      } else {
        typingSpeed = speed * (0.8 + Math.random() * 0.2);
      }

      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + textRef.current[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, speed, isComplete, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypewriterEffect;

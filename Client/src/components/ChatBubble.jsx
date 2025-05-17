import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from './ui/index.jsx';
import { Input } from './ui/input.jsx';
import { useChat } from '../services/chat';
import { useAttendance } from '../context/AttendanceContext';
import { Send, Loader, User, X, Maximize, Minimize } from 'lucide-react';
import baba from '../assets/baba.png';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullWindow, setIsFullWindow] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const { sendMessage, isPending, data } = useChat();
  const { attendanceData } = useAttendance();
  const studentId = '123'; // Default student ID
  const [prevAttendanceData, setPrevAttendanceData] = useState(null);

  // Define toggle functions first using useCallback
  const toggleChat = useCallback(() => {
    // When closing, also exit full window mode
    if (isOpen && isFullWindow) {
      setIsFullWindow(false);
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen, isFullWindow]);



  const toggleFullWindow = useCallback((e) => {
    e.stopPropagation();
    setIsFullWindow(!isFullWindow);
    setIsMinimized(false);
  }, [isFullWindow]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Clean user message before adding to chat history
    const cleanedMessage = cleanMessageContent(message);

    // Add user message to chat history
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: cleanedMessage }
    ]);

    // Prepare data for API
    const chatData = {
      message: cleanedMessage,
      student_id: studentId,
      context: {}
    };

    // Send message to API
    sendMessage(chatData);

    // Clear input
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current && isOpen) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100); // Small delay to ensure content is rendered
    }
  }, [chatHistory, isOpen, isFullWindow]);

  // Function to clean message content from markdown formatting
  const cleanMessageContent = (content) => {
    if (!content) return '';

    // Process the content to remove markdown formatting
    let cleanedContent = content;

    // Remove markdown asterisks for bold/italic formatting
    cleanedContent = cleanedContent.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

    // Remove markdown backticks for code blocks
    cleanedContent = cleanedContent.replace(/```(.*?)```/gs, '$1').replace(/`(.*?)`/g, '$1');

    // Remove markdown for headers
    cleanedContent = cleanedContent.replace(/#{1,6}\s+(.*?)(?:\n|$)/g, '$1\n');

    // Remove markdown for lists
    cleanedContent = cleanedContent.replace(/^\s*[-*+]\s+(.*?)(?:\n|$)/gm, '$1\n');
    cleanedContent = cleanedContent.replace(/^\s*\d+\.\s+(.*?)(?:\n|$)/gm, '$1\n');

    return cleanedContent;
  };

  // Update chat history when response is received
  useEffect(() => {
    if (data?.success) {
      // Clean the response text from markdown formatting
      const cleanedResponse = cleanMessageContent(data.response);

      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: cleanedResponse }
      ]);
    }
  }, [data]);

  // Add keyboard event listener for Escape key to close chat in full screen mode
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen && isFullWindow) {
        toggleChat();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, isFullWindow, toggleChat]);

  // Check if attendance data has been updated
  useEffect(() => {
    // If we had no data before but now we do, or if the data has changed
    if ((!prevAttendanceData && attendanceData) ||
        (prevAttendanceData && attendanceData &&
         JSON.stringify(prevAttendanceData) !== JSON.stringify(attendanceData))) {
      // Reset chat history when new attendance data is added
      setChatHistory([]);
    }

    // Update the previous attendance data reference
    setPrevAttendanceData(attendanceData);
  }, [attendanceData]);

  // Sample questions for the user to try
  const sampleQuestions = [
    "What is my current attendance percentage?",
    "How many classes can I miss while maintaining 75% attendance?",
    "What will my attendance be if I miss 3 more classes?",
    "How many classes do I need to attend to reach 85% attendance?"
  ];

  const handleSampleQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className={`${isFullWindow ? 'fixed inset-0 z-50 bg-gray-50 overflow-hidden' : 'fixed bottom-4 right-4 z-50'}`}>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleChat}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
          >
            <img src={baba} alt="Bunker Baba" className="w-10 h-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`${isFullWindow ? 'fixed inset-0 m-0 z-50 overflow-hidden' : 'absolute bottom-0 right-0'}`}
          >
            <Card className={`bg-white shadow-lg border border-gray-100 rounded-xl overflow-hidden ${isFullWindow ? 'w-full h-full max-w-screen-xl mx-auto flex flex-col' : 'w-80 md:w-96'}`}>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <img src={baba} alt="Bunker Baba" className="w-6 h-6" />
                  </div>
                  <h2 className="ml-2 text-white font-medium text-sm">Bunker Baba</h2>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleFullWindow}
                    className={`${isFullWindow ? 'p-2' : 'p-1.5'} rounded-full hover:bg-white/20 text-white`}
                    aria-label={isFullWindow ? "Exit full screen" : "Full screen"}
                  >
                    {isFullWindow ? <Minimize className={`${isFullWindow ? 'w-5 h-5' : 'w-4 h-4'}`} /> : <Maximize className={`${isFullWindow ? 'w-5 h-5' : 'w-4 h-4'}`} />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChat();
                    }}
                    className={`${isFullWindow ? 'p-2' : 'p-1.5'} rounded-full hover:bg-white/20 text-white`}
                    aria-label="Close chat"
                  >
                    <X className={`${isFullWindow ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  </button>
                </div>
              </div>

              {/* Chat Body */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={isFullWindow ? 'flex flex-col flex-grow h-[calc(100%-48px)] overflow-hidden' : ''}
                  >
                    {/* Chat Messages */}
                    <div
                      ref={chatContainerRef}
                      className={`p-3 ${isFullWindow ? 'flex-grow overflow-y-auto scroll-smooth h-full' : 'h-[300px] overflow-y-auto scroll-smooth'} space-y-3`}
                      style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
                    >
                      {/* Welcome Message */}
                      {chatHistory.length === 0 && (
                        <div className={`flex items-start gap-3 p-4 rounded-lg bg-indigo-50 border border-indigo-100 ${isFullWindow ? 'max-w-3xl mx-auto my-4' : ''}`}>
                          <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
                            <img src={baba} alt="Bunker Baba" className={`${isFullWindow ? 'w-6 h-6' : 'w-5 h-5'}`} />
                          </div>
                          <div>
                            <p className={`text-gray-800 ${isFullWindow ? 'text-base' : 'text-sm'}`}>
                             Sawal ho toh mat socho raat –
Seedha Baba se karo baat!!😎 {!attendanceData && "Please calculate your attendance first to get accurate answers."}
                            </p>
                            <div className={`${isFullWindow ? 'mt-4' : 'mt-2'} flex flex-wrap gap-2`}>
                              {sampleQuestions.map((question) => (
                                <button
                                  key={question}
                                  onClick={() => handleSampleQuestion(question)}
                                  className={`${isFullWindow ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1'} bg-white border ${attendanceData ? 'border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'border-gray-200 text-gray-500 cursor-not-allowed'} rounded-full transition-colors`}
                                  disabled={!attendanceData}
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chat Messages */}
                      {chatHistory.map((chat, index) => (
                        <div
                          key={`${chat.role}-${index}`}
                          className={`flex items-start gap-3 ${
                            chat.role === 'user'
                              ? 'justify-end'
                              : ''
                          } ${isFullWindow ? 'max-w-3xl mx-auto' : ''}`}
                        >
                          {chat.role === 'assistant' && (
                            <div className={`bg-indigo-100 ${isFullWindow ? 'p-2' : 'p-1.5'} rounded-full flex-shrink-0`}>
                              <img src={baba} alt="Bunker Baba" className={`${isFullWindow ? 'w-6 h-6' : 'w-5 h-5'}`} />
                            </div>
                          )}

                          <div
                            className={`${isFullWindow ? 'p-3' : 'p-2'} rounded-lg ${isFullWindow ? 'max-w-[70%]' : 'max-w-[80%]'} ${
                              chat.role === 'user'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className={`whitespace-pre-wrap ${isFullWindow ? 'text-base' : 'text-sm'}`}>{chat.content}</p>
                          </div>

                          {chat.role === 'user' && (
                            <div className={`bg-indigo-600 ${isFullWindow ? 'p-2' : 'p-1.5'} rounded-full flex-shrink-0`}>
                              <User className={`${isFullWindow ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Loading indicator */}
                      {isPending && (
                        <div className={`flex items-start gap-3 ${isFullWindow ? 'max-w-3xl mx-auto' : ''}`}>
                          <div className={`bg-indigo-100 ${isFullWindow ? 'p-2' : 'p-1.5'} rounded-full flex-shrink-0`}>
                            <img src={baba} alt="Bunker Baba" className={`${isFullWindow ? 'w-6 h-6' : 'w-5 h-5'}`} />
                          </div>
                          <div className={`${isFullWindow ? 'p-3' : 'p-2'} rounded-lg bg-gray-100 text-gray-800`}>
                            <div className="flex items-center gap-2">
                              <Loader className={`${isFullWindow ? 'w-4 h-4' : 'w-3 h-3'} animate-spin`} />
                              <span className={`${isFullWindow ? 'text-base' : 'text-sm'}`}>Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className={`${isFullWindow ? 'p-4' : 'p-3'} border-t border-gray-200 bg-white sticky bottom-0 z-10 shadow-sm mt-auto`}>
                      <div className={`flex gap-2 ${isFullWindow ? 'max-w-3xl mx-auto' : ''}`}>
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={attendanceData ? "Ask about your attendance..." : "Calculate attendance first"}
                          className={`flex-grow ${isFullWindow ? 'text-base py-2' : 'text-sm py-1.5'}`}
                          disabled={!attendanceData || isPending}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={isPending || !message.trim() || !attendanceData}
                          className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white ${isFullWindow ? 'p-2' : 'p-1.5'} rounded-md hover:opacity-90 transition-opacity disabled:opacity-50`}
                          title={!attendanceData ? "Calculate attendance first" : ""}
                        >
                          {isPending ? (
                            <Loader className={`${isFullWindow ? 'w-5 h-5' : 'w-4 h-4'} animate-spin`} />
                          ) : (
                            <Send className={`${isFullWindow ? 'w-5 h-5' : 'w-4 h-4'}`} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBubble;

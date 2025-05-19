import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/ui/index.jsx';
import { Input } from '../components/ui/input.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useChat } from '../services/chat';
import { useAttendance } from '../context/AttendanceContext';
import { useNavigate } from 'react-router-dom';
import { Send, Loader, Bot, User, Info, Calculator, PlaneTakeoff } from 'lucide-react';
import TypewriterEffect from '../components/Effect.jsx';

const ChatAssistant = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const { sendMessage, isPending, data } = useChat();
  const { attendanceData } = useAttendance();
  // Student ID for API requests
  const [studentId, setStudentId] = useState('123');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle new responses from the chat API
  useEffect(() => {
    if (data?.success) {
      const cleanedResponse = cleanMessageContent(data.response);
      setIsTyping(true);
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: '', fullContent: cleanedResponse, isTyping: true }
      ]);
    }
  }, [data]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: message }
    ]);

    const chatData = {
      message,
      student_id: studentId,
      context: {}
    };

    sendMessage(chatData);
    setMessage('');
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clean message content from markdown formatting
  const cleanMessageContent = (content) => {
    if (!content) return '';

    let cleanedContent = content;

    // Remove markdown formatting
    cleanedContent = cleanedContent.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
    cleanedContent = cleanedContent.replace(/```(.*?)```/gs, '$1').replace(/`(.*?)`/g, '$1');
    cleanedContent = cleanedContent.replace(/#{1,6}\s+(.*?)(?:\n|$)/g, '$1\n');
    cleanedContent = cleanedContent.replace(/^\s*[-*+]\s+(.*?)(?:\n|$)/gm, '$1\n');
    cleanedContent = cleanedContent.replace(/^\s*\d+\.\s+(.*?)(?:\n|$)/gm, '$1\n');
    cleanedContent = cleanedContent.split('\n').map(line => line.trim()).join('\n');

    return cleanedContent;
  };

  // Sample questions for the user to try
  const sampleQuestions = [
    "What is my current attendance percentage?",
    "How many classes can I miss while maintaining 75% attendance?",
    "What will my attendance be if I miss 3 more classes?",
    "How many classes do I need to attend to reach 85% attendance?",
    "How many total classes have been conducted so far?"
  ];

  // Set the input field to a sample question when clicked
  const handleSampleQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Bunker Baba
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ask questions about your attendance and get instant answers
          </p>

          {!attendanceData && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-1">No Attendance Data</h3>
                  <p className="text-amber-700 mb-2">
                    You haven't calculated your attendance yet. The assistant needs your attendance data to provide accurate answers.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => navigate('/calculator')}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 rounded-md"
                    >
                      <Calculator className="w-3 h-3 mr-1" />
                      Calculate Attendance
                    </Button>
                    <Button
                      onClick={() => navigate('/skip-planner')}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 rounded-md"
                    >
                      <PlaneTakeoff className="w-3 h-3 mr-1" />
                      Use Bunk Planner
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card className="bg-white shadow-lg border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h2 className="ml-3 text-white font-medium">Bunker Baba </h2>
              </div>
            </div>
            <div
              ref={chatContainerRef}
              className="p-4 h-[400px] overflow-y-auto space-y-4"
            >
              {chatHistory.length === 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                      Sawal ho toh mat socho raat –
Seedha Baba se karo baat! {!attendanceData && "Please calculate your attendance first to get accurate answers."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sampleQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSampleQuestion(question)}
                          className={`text-xs bg-white border ${attendanceData ? 'border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'border-gray-200 text-gray-500 cursor-not-allowed'} px-3 py-1 rounded-full transition-colors`}
                          disabled={!attendanceData}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    chat.role === 'user'
                      ? 'justify-end'
                      : ''
                  }`}
                >
                  {chat.role === 'assistant' && (
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      chat.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {chat.role === 'assistant' && chat.isTyping ? (
                      <TypewriterEffect
                        text={chat.fullContent}
                        speed={15}
                        className="whitespace-pre-wrap"
                        onComplete={() => {
                          setChatHistory(prev =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, isTyping: false, content: item.fullContent }
                                : item
                            )
                          );
                          setIsTyping(false);
                        }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{chat.content}</p>
                    )}
                  </div>

                  {chat.role === 'user' && (
                    <div className="bg-indigo-600 p-2 rounded-full">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={attendanceData ? "Ask about your attendance..." : "Calculate attendance first to enable chat"}
                  className="flex-grow"
                  disabled={!attendanceData || isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isPending || !message.trim() || !attendanceData}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  title={!attendanceData ? "Calculate attendance first" : ""}
                >
                  {isPending ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              {!attendanceData && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  Please calculate your attendance first to enable the chat assistant
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatAssistant;

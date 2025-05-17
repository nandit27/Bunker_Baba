import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landingpage';
import AttendanceCalculator from './pages/AttendanceCalculator.jsx';
import SkipPlanner from './pages/SkipPlanner.jsx';
import ChatAssistant from './pages/ChatAssistant.jsx';
import { AttendanceProvider } from './context/AttendanceContext';
import ChatBubble from './components/ChatBubble.jsx';

const App = () => {
  return (
    <AttendanceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<AttendanceCalculator />} />
          <Route path="/skip-planner" element={<SkipPlanner />} />
          <Route path="/chat" element={<ChatAssistant />} />
        </Routes>
      
        <ChatBubbleWrapper />
      </Router>
    </AttendanceProvider>
  );
};

const ChatBubbleWrapper = () => {
 
  const path = window.location.pathname;

  if (path === '/chat') {
    return null;
  }

  return <ChatBubble />;
};

export default App;
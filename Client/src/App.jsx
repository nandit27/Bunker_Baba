import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landingpage';
import AttendanceCalculator from './pages/AttendanceCalculator.jsx';
import SkipPlanner from './pages/SkipPlanner.jsx';
import { AttendanceProvider } from './context/AttendanceContext';

const App = () => {
  return (
    <AttendanceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<AttendanceCalculator />} />
          <Route path="/skip-planner" element={<SkipPlanner />} />
        </Routes>
      </Router>
    </AttendanceProvider>
  );
};

export default App;
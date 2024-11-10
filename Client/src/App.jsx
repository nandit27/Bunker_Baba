import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landingpage';
import AttendanceCalculator from './pages/AttendanceCalculator.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calculator" element={<AttendanceCalculator />} />
      </Routes>
    </Router>
  );
};

export default App;
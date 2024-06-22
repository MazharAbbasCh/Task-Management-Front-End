import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskPage from './pages/TaskPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [userId, setUserId] = useState(''); // Store the user ID after login

  const logout = () => {
    setUserId('');
    localStorage.removeItem('userId');
    // Instead of using navigate directly here, redirect using <Navigate> component
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Pass setUserId function to LoginPage */}
          <Route path="/login" element={<LoginPage setUserId={setUserId} />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Pass userId and logout function to TaskPage */}
          <Route path="/tasks" element={<TaskPage userId={userId} logout={logout} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css'; // Import animate.css for animations

const HomePage = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation after a short delay for better visibility
    const timeout = setTimeout(() => {
      setShowAnimation(true);
    }, 300); // Adjust the delay here

    // Clear timeout on component unmount to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md">

      {/* Header */}
      <header className="bg-gradient-to-r from-teal-500 to-blue-600">
        <div className="container mx-auto px-3 flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="favicon.png" alt="Favicon" className="w-12 h-12 rounded-full shadow-lg" />
            <h1 className="ml-4 text-3xl font-bold font-crimson">Task Management System</h1>
          </div>
          <nav className="flex space-x-4">
            <Link
              to="/signup"
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
        <div className="container mx-auto max-w-4xl bg-white bg-opacity-75 rounded-lg shadow-lg p-8 sm:p-12 text-center">
          <div>
            {/* Animated heading */}
            <h1 className={`text-4xl font-bold mb-6 text-gray-800 animate__animated ${showAnimation ? 'animate__zoomIn' : ''}`}>
              Welcome to the Task Manager
            </h1>
            {/* Animated paragraph */}
            <p className={`text-gray-700 mb-8 animate__animated ${showAnimation ? 'animate__fadeInUp' : ''}`}>
              Manage your tasks efficiently with Task Manager.
            </p>
            {/* Animated Go to Login button */}
            <Link
              to="/login"
              className={`inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300 animate__animated ${showAnimation ? 'animate__fadeInUp' : ''}`}
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-500 to-blue-600 py-4">
        <div className="container mx-auto text-center text-white">
          <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

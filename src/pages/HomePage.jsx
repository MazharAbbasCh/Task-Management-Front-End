import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r  shadow-md">
      {/* Header */}
      <header className="bg-gradient-to-r">
        <div className="container mx-auto px-3 flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="favicon.png" alt="Favicon" className="w-12 h-15 rounded-full shadow-lg" />
            <h1 className="ml-2 text-3xl font-bold text-white">Task Management System</h1>
          </div>
          <nav className="flex space-x-4">
            <Link
              to="/signup"
              className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>
      <hr />
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-r ">
        <div className="container mx-auto max-w-4xl bg-white bg-opacity-75 rounded-lg shadow-lg p-8 sm:p-16 text-center">
          <div>
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to the Task Manager
            </h1>
            <p className="text-gray-700 mb-8">
              Manage your tasks efficiently with Task Manager.
            </p>
            <Link
              to="/login"
              className="w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 animate-fade-in"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r  py-4">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 Task Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4">
          <h1 className="mx-4 text-3xl font-bold text-gray-800">Task Manager</h1>
          <nav className="flex space-x-4 mx-4">
           
            <Link
              to="/signup"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center bg-cover bg-center" >
        <div className="container mx-auto max-w-4xl bg-white bg-opacity-75 rounded-lg shadow-lg p-16">
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-6">Welcome to the Task Manager</h1>
            <p className="text-gray-700 mb-8">
              Manage your tasks efficiently with Task Manager.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2024 Task Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

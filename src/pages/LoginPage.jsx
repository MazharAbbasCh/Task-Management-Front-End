import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const LoginPage = ({ setUserId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setUserId(data.userId);
        setMessage('Login successful');
        navigate('/tasks');
      } else {
        setMessage(data.message);
      }
    } catch (e) {
      console.error('An error occurred:', e);
      setMessage('An error occurred');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Signup successful');
        setIsLogin(true);
      } else {
        setMessage(data.message);
      }
    } catch (e) {
      console.error('An error occurred:', e);
      setMessage('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-creamy flex justify-center items-center bg-gradient-to-r  shadow-md">
      <div className="max-w-md w-full py-10 px-8 bg-white shadow-2xl rounded-lg relative transform transition-all duration-500 hover:scale-105">
        <Link to="/" className="absolute top-4 left-4 text-cyan-500 hover:text-cyan-700 transition-colors duration-300">
          <FontAwesomeIcon icon={faHome} size="2x" />
        </Link>
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800 animate-fade-in">{isLogin ? 'Login' : 'Signup'}</h1>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <div className="mb-6 animate-slide-in">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500"
              />
            </div>
          )}
          <div className="mb-6 animate-slide-in">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500"
            />
          </div>
          <div className="mb-6 animate-slide-in">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 animate-fade-in"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 w-full text-cyan-500 hover:text-cyan-700 underline transition-colors duration-300 animate-fade-in"
          >
            {isLogin ? 'Go to Signup' : 'Go to Login'}
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 text-center animate-fade-in">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:5000/user/signup', { email, password, name });
            if (response.data.success) {
                toast.success('Signed up successfully!', { position: toast.POSITION.TOP_CENTER });
                navigate('/login'); // Navigate to login page after successful signup
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error signing up', error);
            setError('Failed to sign up. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 bg-gradient-to-r from-teal-400 to-blue-500">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Sign up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="mb-4 p-2 w-full border rounded focus:outline-none focus:border-cyan-500 transition duration-300"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="mb-4 p-2 w-full border rounded focus:outline-none focus:border-cyan-500 transition duration-300"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="mb-4 p-2 w-full border rounded focus:outline-none focus:border-cyan-500 transition duration-300"
                />
                <button
                    onClick={handleSignup}
                    className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded flex items-center justify-center transform transition duration-300 hover:scale-105 w-full focus:outline-none"
                >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default SignupPage;

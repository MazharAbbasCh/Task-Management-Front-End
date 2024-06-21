import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="mb-4 p-2 w-full border rounded"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="mb-4 p-2 w-full border rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="mb-4 p-2 w-full border rounded"
                />
                <button
                    onClick={handleSignup}
                    className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
                >
                    Signup
                </button>
            </div>
        </div>
    );
};

export default SignupPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        // Clear errors automatically when user types
        if (error) setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Input Normalization
        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const password = formData.password;

        // 2. Client-side Validation
        // Name check
        if (!trimmedName) {
            setError('Please enter your full name');
            setLoading(false);
            return;
        }

        // Strict Email Regex: Contains @, domain extension, no spaces
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Password length check
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        // 3. Backend Call (Only reached if validation passes)
        try {
            const response = await authService.signup(trimmedName, trimmedEmail, password);
            login(response.data.user, response.data.token);
            navigate('/discover');
        } catch (err) {
            // 4. Server Error Handling
            // Prefer backend message if available, fallback to generic
            const message = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">G</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Gatherly</h1>
                    <p className="text-gray-600 dark:text-gray-400">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <Button type="submit" variant="primary" loading={loading} className="w-full">
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;

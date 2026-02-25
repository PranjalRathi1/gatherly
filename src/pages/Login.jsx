import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    // FORM STATE
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [failedAttempts, setFailedAttempts] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData.email, formData.password);

            if (response.data && response.data.token) {
                // SUCCESS
                setFailedAttempts(0);
                login(response.data.user, response.data.token);
                navigate('/discover');
            } else {
                throw new Error('Invalid response');
            }
        } catch (err) {
            console.error('Login failed:', err);

            // FAILURE: Update styling state only
            setFailedAttempts(prev => prev + 1);

            // Clear password only
            setFormData(prev => ({ ...prev, password: '' }));

            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(''); // Clear error on type
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md z-10 relative">

                <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-500 ${failedAttempts > 0 ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                        <span className="text-white font-bold text-2xl">G</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-400">Sign in to continue to Gatherly</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                    />

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant={failedAttempts > 0 ? "danger" : "primary"}
                        loading={loading}
                        className={`w-full transition-colors duration-300 ${failedAttempts > 0 ? 'bg-red-600 hover:bg-red-700' : ''}`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

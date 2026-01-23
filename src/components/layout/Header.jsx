import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

const Header = ({ showLocation = false, location = 'South Delhi' }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { unreadCount } = useNotificationStore();

    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
            <div className="max-w-lg mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Location or Title */}
                    {showLocation ? (
                        <button className="flex items-center gap-2 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-sm font-semibold">{location}</div>
                                <div className="text-xs text-gray-400">Vasant Kunj</div>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    ) : (
                        <h1 className="text-xl font-bold text-white">Gatherly</h1>
                    )}

                    {/* Right Icons */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        <Link to="/profile" className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import { mockEvents } from '../utils/mockData';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { joinedEvents } = useEventStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const myEvents = mockEvents.filter(e => joinedEvents.includes(e.id) || e.isHost);

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 mb-6 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-full flex items-center justify-center">
                            <span className="text-3xl font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
                            <p className="text-blue-100">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{myEvents.length}</p>
                            <p className="text-sm text-blue-100">Events Joined</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{myEvents.filter(e => e.isHost).length}</p>
                            <p className="text-sm text-blue-100">Hosting</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-sm text-blue-100">Connections</p>
                        </div>
                    </div>
                </div>

                {/* My Events */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Events</h2>
                    {myEvents.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            You haven't joined any events yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {myEvents.map((event) => (
                                <div
                                    key={event._id}
                                    onClick={() => navigate(`/event/${event._id}`)}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        {event.image && (
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {event.date} • {event.category}
                                        </p>
                                    </div>
                                    {event.isHost && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded">
                                            Host
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</h2>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                            Edit Profile
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                            Preferences
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                            Privacy & Security
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Profile;

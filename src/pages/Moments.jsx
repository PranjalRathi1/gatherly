import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import MomentCard from '../components/media/MomentCard';
import { mockMoments } from '../utils/mockData';

const Moments = () => {
    const [moments, setMoments] = useState(mockMoments);
    const [activeTab, setActiveTab] = useState('all');

    return (
        <PageWrapper>
            <div className="max-w-lg mx-auto bg-gray-900 min-h-screen">
                {/* Header */}
                <div className="px-4 pt-4 pb-2">
                    <h1 className="text-2xl font-bold text-white">Moments</h1>
                </div>

                {/* Search Bar */}
                <div className="px-4 mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-gray-800 text-white rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'all'
                                ? 'text-white border-b-2 border-blue-600'
                                : 'text-gray-400'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveTab('my-moments')}
                        className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'my-moments'
                                ? 'text-white border-b-2 border-blue-600'
                                : 'text-gray-400'
                            }`}
                    >
                        My moments
                    </button>
                </div>

                {/* Event Header */}
                <div className="bg-gray-800 mx-4 mt-4 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
                        <span className="text-lg">🎭</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">NY Meetup-fest by Misfits: 2026 i...</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Thu 1st Jan</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>89 Joined</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Moments Grid */}
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                        {moments.map((moment) => (
                            <div key={moment.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-800">
                                <img
                                    src={moment.image}
                                    alt={moment.caption}
                                    className="w-full h-full object-cover"
                                />
                                {/* Play button for videos */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Author */}
                                <div className="absolute top-2 left-2 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                            {moment.author.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-white text-xs font-semibold drop-shadow-lg">
                                        {moment.author}
                                    </span>
                                </div>
                                {/* Likes */}
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-semibold">{moment.likes}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Moments;

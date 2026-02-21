import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useClubStore } from '../store/clubStore';

const Home = () => {
    const navigate = useNavigate();
    const { followingClubs } = useClubStore();

    return (
        <PageWrapper>
            <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 bg-gray-900">
                {/* Club Logo/Mascot */}
                <div className="mb-8">
                    <div className="w-32 h-32 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-2xl">
                        <span className="text-6xl">🎭</span>
                    </div>
                </div>

                {/* Club Info */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Misfits Lounge</h1>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-sm">TBD</span>
                    </div>
                    <div className="mt-4 bg-gray-800 rounded-lg px-4 py-2 inline-flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-400 text-sm">No upcoming meet-ups.</span>
                        <button className="p-1">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Empty State Message */}
                <div className="text-center mb-8 max-w-sm">
                    <p className="text-gray-300 text-lg mb-2">
                        Tap on the "Explore Clubs" button below to discover and join clubs.
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/clubs')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-colors shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explore Clubs
                </button>

                {/* Mascot */}
                <div className="mt-12">
                    <div className="text-8xl">🎭</div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Home;

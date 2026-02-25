import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ClubCard from '../components/club/ClubCard';
import { useClubStore } from '../store/clubStore';
import { mockClubs } from '../utils/mockData';

const Following = () => {
    const { clubs, setClubs, followingClubs, followClub, unfollowClub, isFollowing } = useClubStore();
    const [activeTab, setActiveTab] = useState('following');
    const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(true);

    useEffect(() => {
        setClubs(mockClubs);
    }, []);

    const handleFollow = (clubId) => {
        if (isFollowing(clubId)) {
            unfollowClub(clubId);
        } else {
            followClub(clubId);
        }
    };

    const followedClubs = clubs.filter(club => followingClubs.includes(club.id));
    const exploreClubs = clubs.filter(club => !followingClubs.includes(club.id));

    return (
        <PageWrapper>
            <div className="max-w-lg mx-auto bg-gray-900 min-h-screen">
                {/* WhatsApp Join Prompt */}
                {showWhatsAppPrompt && (
                    <div className="bg-green-700 mx-4 mt-4 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-semibold text-sm">Join "Vasant Kunj" WA group</p>
                            <p className="text-green-100 text-xs">For updates on clubs & meet-ups near you!</p>
                        </div>
                        <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
                            Join
                        </button>
                        <button
                            onClick={() => setShowWhatsAppPrompt(false)}
                            className="text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Search Bar */}
                <div className="px-4 mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-gray-800 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                <div className="flex border-b border-gray-800 mt-6">
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'following'
                                ? 'text-white border-b-2 border-blue-600'
                                : 'text-gray-400'
                            }`}
                    >
                        Following
                    </button>
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'explore'
                                ? 'text-white border-b-2 border-blue-600'
                                : 'text-gray-400'
                            }`}
                    >
                        Explore
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {activeTab === 'following' ? (
                        <>
                            {/* Filters */}
                            <div className="flex gap-2 mb-4">
                                <button className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Friends
                                </button>
                                <button className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Activity
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Following Section */}
                            <div className="mb-6">
                                <h2 className="text-white font-semibold mb-3">Following</h2>
                                <div className="bg-gray-800 rounded-xl p-4">
                                    <button className="w-full text-left flex items-center justify-between text-gray-300">
                                        <span>Following Clubs (no upcoming meet-ups)</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Explore Clubs */}
                            <div>
                                <h2 className="text-white font-semibold mb-3">Explore clubs</h2>
                                <div className="space-y-4">
                                    {exploreClubs.map((club) => (
                                        <ClubCard
                                            key={club.id}
                                            {...club}
                                            isFollowing={isFollowing(club.id)}
                                            onFollow={() => handleFollow(club.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            {clubs.map((club) => (
                                <ClubCard
                                    key={club.id}
                                    {...club}
                                    isFollowing={isFollowing(club.id)}
                                    onFollow={() => handleFollow(club.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Following;

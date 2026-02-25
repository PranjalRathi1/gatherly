import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ClubCard from '../components/club/ClubCard';
import { useClubStore } from '../store/clubStore';
import { mockClubs } from '../utils/mockData';

const Clubs = () => {
    const { clubs, setClubs, followClub, unfollowClub, isFollowing } = useClubStore();
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageWrapper>
            <div className="max-w-lg mx-auto bg-gray-900 min-h-screen">
                {/* Search Bar */}
                <div className="px-4 pt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search clubs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Clubs List */}
                <div className="p-4 space-y-4">
                    <h2 className="text-white font-semibold text-lg">All Clubs</h2>
                    {filteredClubs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No clubs found</p>
                        </div>
                    ) : (
                        filteredClubs.map((club) => (
                            <ClubCard
                                key={club.id}
                                {...club}
                                isFollowing={isFollowing(club.id)}
                                onFollow={() => handleFollow(club.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Clubs;

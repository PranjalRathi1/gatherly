import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClubCard = ({
    id,
    name,
    image,
    category,
    rating,
    memberCount,
    isFollowing = false,
    onFollow,
    upcomingEvent
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800 rounded-2xl overflow-hidden">
            {/* Club Header */}
            <div className="flex items-center gap-3 p-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                            🎵
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            {category}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {rating && (
                        <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-lg">
                            <span className="text-white text-sm font-semibold">{rating}</span>
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    )}
                    {memberCount && (
                        <span className="text-gray-400 text-sm">({memberCount})</span>
                    )}
                </div>
            </div>

            {/* Event Image */}
            {upcomingEvent?.image && (
                <div
                    onClick={() => navigate(`/club/${id}`)}
                    className="relative h-48 overflow-hidden cursor-pointer"
                >
                    <img
                        src={upcomingEvent.image}
                        alt={upcomingEvent.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {upcomingEvent.title && (
                        <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white font-semibold text-sm">{upcomingEvent.title}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Follow Button */}
            <div className="p-4">
                <button
                    onClick={onFollow}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${isFollowing
                            ? 'bg-gray-700 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            </div>
        </div>
    );
};

export default ClubCard;

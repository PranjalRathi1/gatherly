import React, { useState } from 'react';

const MomentCard = ({ image, video, caption, author, likes, isLiked, onLike, timestamp }) => {
    const [liked, setLiked] = useState(isLiked);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
        if (onLike) onLike(!liked);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4">
            {/* Author */}
            <div className="flex items-center p-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                        {author?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</p>
                </div>
            </div>

            {/* Media */}
            <div className="relative bg-gray-900">
                {image && (
                    <img src={image} alt={caption} className="w-full h-auto max-h-96 object-cover" />
                )}
                {video && (
                    <video src={video} controls className="w-full h-auto max-h-96" />
                )}
            </div>

            {/* Actions */}
            <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                    <button onClick={handleLike} className="flex items-center gap-2 group">
                        <svg
                            className={`w-6 h-6 transition-colors ${liked ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'
                                }`}
                            fill={liked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {likeCount}
                        </span>
                    </button>
                </div>

                {/* Caption */}
                {caption && (
                    <p className="text-gray-900 dark:text-white">
                        <span className="font-semibold mr-2">{author}</span>
                        {caption}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MomentCard;

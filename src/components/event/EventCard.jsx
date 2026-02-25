import React from 'react';
import Button from '../common/Button';

const EventCard = ({
    image,
    title,
    date,
    time,
    location,
    category,
    isHost = false,
    onCardClick,
    onButtonClick,
    buttonText = 'View Event',
    buttonVariant = 'primary',
}) => {
    const handleCardClick = (e) => {
        if (onCardClick) {
            onCardClick(e);
        }
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        if (onButtonClick) {
            onButtonClick(e);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
        >
            {/* Cover Image */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Host Badge */}
                {isHost && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            Host
                        </span>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {title}
                </h3>

                {/* Date & Time */}
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">
                        {date} {time && `• ${time}`}
                    </span>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm line-clamp-1">{location}</span>
                </div>

                {/* Category Badge and Button */}
                <div className="flex items-center justify-between gap-3">
                    {category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {category}
                        </span>
                    )}

                    <Button
                        variant={buttonVariant}
                        size="sm"
                        onClick={handleButtonClick}
                        className="ml-auto"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;

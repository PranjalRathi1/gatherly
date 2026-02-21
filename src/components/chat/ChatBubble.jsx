import React from 'react';

const ChatBubble = ({ message, isSent, timestamp, sender, type, imageUrl }) => {
    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[75%] ${isSent ? 'order-2' : 'order-1'}`}>
                {!isSent && sender && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
                        {sender}
                    </p>
                )}
                <div
                    className={`rounded-2xl px-4 py-2 ${isSent
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                        } ${type === 'image' ? 'p-1' : ''}`}
                >
                    {type === 'image' ? (
                        <img
                            src={imageUrl}
                            alt="Shared image"
                            className="rounded-lg max-h-60 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(imageUrl, '_blank')}
                        />
                    ) : (
                        <p className="text-sm break-words">{message}</p>
                    )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-3">
                    {timestamp}
                </p>
            </div>
        </div>
    );
};

export default ChatBubble;

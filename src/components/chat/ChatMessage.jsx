import React from 'react';
import { format } from 'date-fns';

const ChatMessage = ({
    message,
    isAdmin,
    currentUserId,
    onPinGlobal,
    onUnpinGlobal,
    onPinPersonal,
    isPersonallyPinned
}) => {
    const isOwnMessage = message.sender._id === currentUserId;
    const createdAt = new Date(message.createdAt);

    return (
        <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {message.sender.name?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
                {/* Sender Name & Time */}
                <div className={`flex items-center gap-2 mb-1 text-xs text-gray-600 dark:text-gray-400 ${isOwnMessage ? 'justify-end' : ''}`}>
                    <span className="font-semibold">{message.sender.name}</span>
                    <span>•</span>
                    <span>{format(createdAt, 'HH:mm')}</span>
                </div>

                {/* Message Bubble */}
                <div className={`relative group ${isOwnMessage ? 'flex justify-end' : ''}`}>
                    <div className={`inline-block px-4 py-2 rounded-2xl ${isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                        {message.type === 'text' ? (
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        ) : (
                            <img
                                src={message.imageUrl}
                                alt="Shared image"
                                className="max-w-sm rounded-lg"
                            />
                        )}

                        {/* Pin  Indicators */}
                        {message.globalPin && (
                            <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                <span>Pinned globally</span>
                            </div>
                        )}
                        {isPersonallyPinned && !message.globalPin && (
                            <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                </svg>
                                <span>Personal pin</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons (show on hover) */}
                    <div className={`absolute top-0 ${isOwnMessage ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                        {/* Global Pin (Admin only) */}
                        {isAdmin && !message.globalPin && (
                            <button
                                onClick={() => onPinGlobal(message._id)}
                                className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Pin for everyone"
                            >
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}

                        {/* Global Unpin (Admin only) */}
                        {isAdmin && message.globalPin && (
                            <button
                                onClick={() => onUnpinGlobal(message._id)}
                                className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Unpin for everyone"
                            >
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}

                        {/* Personal Pin Toggle */}
                        <button
                            onClick={() => onPinPersonal(message._id)}
                            className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={isPersonallyPinned ? "Unpin for me" : "Pin for me"}
                        >
                            <svg
                                className={`w-4 h-4 ${isPersonallyPinned ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1. 18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;

import React from 'react';

const PinnedMessages = ({ pinnedMessages, onUnpinGlobal, isAdmin, onScrollToMessage }) => {
    if (!pinnedMessages || pinnedMessages.length === 0) {
        return null;
    }

    return (
        <div className="sticky top-0 z-10 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 shadow-sm">
            <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-yellow-800 dark:text-yellow-400">
                        Pinned Messages ({pinnedMessages.length})
                    </span>
                </div>

                <div className="space-y-2">
                    {pinnedMessages.map((message) => (
                        <div
                            key={message._id}
                            className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => onScrollToMessage?.(message._id)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {message.sender?.name || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        pinned by {message.globalPinnedBy?.name || 'admin'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {message.content}
                                </p>
                            </div>

                            {/* Unpin button (admin only) */}
                            {isAdmin && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUnpinGlobal(message._id);
                                    }}
                                    className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    title="Unpin message"
                                >
                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PinnedMessages;

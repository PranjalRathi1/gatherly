import React, { useEffect, useState } from 'react';

const TypingIndicator = ({ typingUsers }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    if (!typingUsers || typingUsers.length === 0) {
        return null;
    }

    const getTypingText = () => {
        if (typingUsers.length === 1) {
            return `${typingUsers[0].userName} is typing`;
        } else if (typingUsers.length === 2) {
            return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing`;
        } else {
            return `${typingUsers.length} people are typing`;
        }
    };

    return (
        <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 italic">
            <div className="flex items-center gap-2">
                {/* Animated dots */}
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>

                {/* Typing text */}
                <span>{getTypingText()}{dots}</span>
            </div>
        </div>
    );
};

export default TypingIndicator;

import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';

const ChatInput = ({ onSend, disabled = false, onTypingStart, onTypingStop }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const typingTimeoutRef = useRef(null);

    const handleChange = (e) => {
        setMessage(e.target.value);
        onTypingStart?.();

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            onTypingStop?.();
        }, 800);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled && !isUploading) {
            onSend({ type: 'text', content: message });
            setMessage('');

            // Stop typing indicator
            if (isTyping) {
                setIsTyping(false);
                onTypingStop?.();
            }

            // Clear timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (isTyping) {
                onTypingStop?.();
            }
        };
    }, [isTyping, onTypingStop]);


    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Frontend Validation: Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Max 5MB allowed.');
            return;
        }

        setIsUploading(true);
        try {
            // 1. Get Pre-signed URL
            const { data } = await api.post('/uploads/chat-image', {
                filename: file.name,
                fileType: file.type,
                fileSize: file.size
            });

            // 2. Upload to S3
            await fetch(data.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            // 3. Send Message via Socket
            onSend({ type: 'image', imageUrl: data.imageUrl });

        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload Image"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder={disabled ? "You must join this event to chat..." : "Type a message..."}
                    disabled={disabled || isUploading}
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!message.trim() || disabled || isUploading}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
                >
                    {isUploading ? (
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ChatInput;

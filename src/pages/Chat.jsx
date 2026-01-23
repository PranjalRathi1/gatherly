import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import { useChatStore } from '../store/chatStore';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { mockEvents } from '../utils/mockData';

const Chat = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { isJoined } = useEventStore();
    const { addMessage, getMessages, initChat } = useChatStore();
    const messagesEndRef = useRef(null);

    const event = mockEvents.find(e => e.id === parseInt(eventId));
    const messages = getMessages(eventId);

    useEffect(() => {
        initChat(eventId);

        // Add some mock messages
        if (messages.length === 0) {
            const mockMessages = [
                {
                    id: 1,
                    message: 'Hey everyone! Looking forward to this event!',
                    sender: 'Sarah Johnson',
                    timestamp: '10:30 AM',
                    isSent: false
                },
                {
                    id: 2,
                    message: 'Same here! Should be fun 🎉',
                    sender: 'Mike Chen',
                    timestamp: '10:32 AM',
                    isSent: false
                }
            ];
            mockMessages.forEach(msg => addMessage(eventId, msg));
        }
    }, [eventId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isJoined(parseInt(eventId))) {
        return (
            <PageWrapper>
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Join the event to access chat
                    </h2>
                    <button
                        onClick={() => navigate(`/event/${eventId}`)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Go to event page
                    </button>
                </div>
            </PageWrapper>
        );
    }

    const handleSendMessage = (message) => {
        const newMessage = {
            id: Date.now(),
            message,
            sender: user?.name || 'You',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isSent: true
        };
        addMessage(eventId, newMessage);
    };

    return (
        <PageWrapper showBottomNav={false}>
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Chat Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-3 text-gray-600 dark:text-gray-400"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            {event?.title || 'Event Chat'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event?.participants || 0} participants
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} {...msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <ChatInput onSend={handleSendMessage} />
            </div>
        </PageWrapper>
    );
};

export default Chat;

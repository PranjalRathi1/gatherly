import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import { useAuthStore } from '../store/authStore';
import socketService from '../services/socketService';
import api from '../services/api';

const Chat = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [isOthersTyping, setIsOthersTyping] = useState(false);

    // Fetch history (Step 3)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get(`/messages/${eventId}`);
                if (data.success) {
                    setMessages(data.data.map(msg => ({
                        id: msg._id,
                        message: msg.text,
                        sender: msg.sender?.name || 'Unknown',
                        timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        isSent: msg.sender?._id === user?._id || msg.sender === user?._id
                    })));
                }
            } catch (error) {
                console.error('Fetch history error:', error);
            }
        };
        fetchHistory();
    }, [eventId, user]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            socketService.connect(token);
        }

        socketService.emit('join_event_room', eventId);

        const handleReceiveMessage = (msg) => {
            setMessages(prev => [...prev, {
                id: msg._id,
                message: msg.text,
                sender: msg.sender?.name || 'Unknown',
                timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                isSent: msg.sender === user?._id || msg.sender?._id === user?._id
            }]);
        };

        const handleTyping = () => setIsOthersTyping(true);
        const handleStopTyping = () => setIsOthersTyping(false);

        socketService.on('receive_message', handleReceiveMessage);
        socketService.on('typing', handleTyping);
        socketService.on('stop_typing', handleStopTyping);

        return () => {
            socketService.off('receive_message', handleReceiveMessage);
            socketService.off('typing', handleTyping);
            socketService.off('stop_typing', handleStopTyping);
        };
    }, [eventId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOthersTyping]);

    const handleSendMessage = (payload) => {
        socketService.emit('send_message', {
            eventId,
            text: payload.content,
        });
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
                            Event Chat
                        </h2>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
                    {messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-gray-400">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <ChatBubble key={msg.id} {...msg} />
                        ))
                    )}
                    {/* Typing Indicator */}
                    {isOthersTyping && (
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm ml-2 mt-2">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                            Someone is typing...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <ChatInput
                    onSend={handleSendMessage}
                    onTypingStart={() => socketService.emit('typing', eventId)}
                    onTypingStop={() => socketService.emit('stop_typing', eventId)}
                />
            </div>
        </PageWrapper>
    );
};

export default Chat;

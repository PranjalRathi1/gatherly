import React, { useState, useEffect, useRef, useCallback } from 'react';
import socketService from '../../services/socketService';
import { messageService } from '../../services/messageService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import PinnedMessages from './PinnedMessages';
import TypingIndicator from './TypingIndicator';

const ChatContainer = ({ eventId, isAdmin, currentUserId, isParticipant }) => {
    const [messages, setMessages] = useState([]);
    const [globalPins, setGlobalPins] = useState([]);
    const [personalPinIds, setPersonalPinIds] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const previousScrollHeightRef = useRef(0);

    /* =========================
       LOAD INITIAL MESSAGES
    ========================= */
    const loadMessages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await messageService.getEventMessages(eventId);

            if (response.data?.success) {
                const { messages: msgs, globalPins: pins, personalPinIds: pinIds, hasMore: more } = response.data.data;
                setMessages(msgs || []);
                setGlobalPins(pins || []);
                setPersonalPinIds(pinIds || []);
                setHasMore(more || false);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    /* =========================
       LOAD MORE MESSAGES (PAGINATION)
    ========================= */
    const loadMoreMessages = useCallback(async () => {
        if (loadingMore || !hasMore || messages.length === 0) return;

        try {
            setLoadingMore(true);
            const oldestMessage = messages[0];
            const before = oldestMessage.createdAt;

            const response = await messageService.getEventMessages(eventId, before);

            if (response.data?.success) {
                const { messages: newMsgs, hasMore: more } = response.data.data;

                // Store current scroll position
                const container = messagesContainerRef.current;
                if (container) {
                    previousScrollHeightRef.current = container.scrollHeight;
                }

                // Prepend old messages
                setMessages(prev => [...newMsgs, ...prev]);
                setHasMore(more);
            }
        } catch (error) {
            console.error('Failed to load more messages:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [eventId, messages, hasMore, loadingMore]);

    /* =========================
       SCROLL HANDLING
    ========================= */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Load more when scrolling to top
        if (container.scrollTop === 0 && hasMore && !loadingMore) {
            loadMoreMessages();
        }
    }, [hasMore, loadingMore, loadMoreMessages]);

    // Restore scroll position after loading more messages
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container && loadingMore && previousScrollHeightRef.current > 0) {
            const newScrollHeight = container.scrollHeight;
            const scrollDifference = newScrollHeight - previousScrollHeightRef.current;
            container.scrollTop = scrollDifference;
            previousScrollHeightRef.current = 0;
        }
    }, [messages, loadingMore]);

    /* =========================
       SOCKET.IO LIFECYCLE
    ========================= */
    useEffect(() => {
        if (!eventId) return;

        // Join room if participant
        if (isParticipant) {
            socketService.emit('join_event_room', eventId);
        }

        // Load initial messages
        loadMessages();

        // Set up real-time listeners
        const handleNewMessage = (message) => {
            setMessages(prev => [...prev, message]);
            // Auto-scroll to bottom for new messages
            setTimeout(scrollToBottom, 100);
        };

        const handleTyping = (userId) => {
            setTypingUsers(prev => {
                const exists = prev.find(u => u.userId === userId);
                if (exists) return prev;
                return [...prev, { userId, userName: 'Someone' }];
            });

            // Auto-remove after 3 seconds
            setTimeout(() => {
                setTypingUsers(prev => prev.filter(u => u.userId !== userId));
            }, 3000);
        };

        const handleStopTyping = (userId) => {
            setTypingUsers(prev => prev.filter(u => u.userId !== userId));
        };

        socketService.on('receive_message', handleNewMessage);
        socketService.on('typing', handleTyping);
        socketService.on('stop_typing', handleStopTyping);

        // Cleanup
        return () => {
            socketService.off('receive_message', handleNewMessage);
            socketService.off('typing', handleTyping);
            socketService.off('stop_typing', handleStopTyping);
        };
    }, [eventId, isParticipant, loadMessages]);

    /* =========================
       MESSAGE ACTIONS
    ========================= */
    const handleSendMessage = useCallback(({ type, content, imageUrl }) => {
        if (!isParticipant) return;
        socketService.emit('send_message', { eventId, text: content });
    }, [eventId, isParticipant]);

    const handlePinGlobal = useCallback(async (messageId) => {
        try {
            const response = await messageService.pinGlobally(messageId);
            if (response.data?.success) {
                const pinnedMessage = response.data.data;

                // Update global pins
                setGlobalPins(prev => [pinnedMessage, ...prev]);

                // Update message in list
                setMessages(prev => prev.map(msg =>
                    msg._id === messageId
                        ? { ...msg, globalPin: true, globalPinnedBy: pinnedMessage.globalPinnedBy, globalPinnedAt: pinnedMessage.globalPinnedAt }
                        : msg
                ));
            }
        } catch (error) {
            console.error('Failed to pin message:', error);
            alert(error.response?.data?.message || 'Failed to pin message');
        }
    }, []);

    const handleUnpinGlobal = useCallback(async (messageId) => {
        try {
            await messageService.unpinGlobally(messageId);

            // Remove from global pins
            setGlobalPins(prev => prev.filter(msg => msg._id !== messageId));

            // Update message in list
            setMessages(prev => prev.map(msg =>
                msg._id === messageId
                    ? { ...msg, globalPin: false, globalPinnedBy: undefined, globalPinnedAt: undefined }
                    : msg
            ));
        } catch (error) {
            console.error('Failed to unpin message:', error);
            alert(error.response?.data?.message || 'Failed to unpin message');
        }
    }, []);

    const handlePinPersonal = useCallback(async (messageId) => {
        try {
            const response = await messageService.togglePersonalPin(messageId);
            if (response.data?.success) {
                const { pinned } = response.data;

                // Update personal pins
                setPersonalPinIds(prev =>
                    pinned
                        ? [...prev, messageId]
                        : prev.filter(id => id !== messageId)
                );
            }
        } catch (error) {
            console.error('Failed to toggle personal pin:', error);
        }
    }, []);

    /* =========================
       TYPING INDICATORS
    ========================= */
    const handleTypingStart = useCallback(() => {
        if (isParticipant) {
            socketService.emit('typing', eventId);
        }
    }, [eventId, isParticipant]);

    const handleTypingStop = useCallback(() => {
        if (isParticipant) {
            socketService.emit('stop_typing', eventId);
        }
    }, [eventId, isParticipant]);

    /* =========================
       RENDER
    ========================= */
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Pinned Messages (Sticky at top) */}
            <PinnedMessages
                pinnedMessages={globalPins}
                onUnpinGlobal={handleUnpinGlobal}
                isAdmin={isAdmin}
            />

            {/* Messages Container */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-2"
            >
                {/* Load More Indicator */}
                {hasMore && (
                    <div className="text-center py-2">
                        <button
                            onClick={loadMoreMessages}
                            disabled={loadingMore}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                        >
                            {loadingMore ? 'Loading...' : 'Load older messages'}
                        </button>
                    </div>
                )}

                {/* Messages List */}
                {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatMessage
                            key={message._id}
                            message={message}
                            isAdmin={isAdmin}
                            currentUserId={currentUserId}
                            onPinGlobal={handlePinGlobal}
                            onUnpinGlobal={handleUnpinGlobal}
                            onPinPersonal={handlePinPersonal}
                            isPersonallyPinned={personalPinIds.includes(message._id)}
                        />
                    ))
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            <TypingIndicator typingUsers={typingUsers} />

            {/* Chat Input */}
            <ChatInput
                onSend={handleSendMessage}
                disabled={!isParticipant}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
            />
        </div>
    );
};

export default ChatContainer;

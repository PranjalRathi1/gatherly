import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import { useEventStore } from '../store/eventStore';
import { eventService } from '../services/eventService';
import ChatContainer from '../components/chat/ChatContainer';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { joinEvent, leaveEvent, isJoined } = useEventStore();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // ✅ Sync Store with Backend (The "Correct Fix")
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await eventService.getEventById(id);
                setEvent(response.data?.data);
            } catch (err) {
                console.error('Failed to fetch event', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    // ✅ THE REAL JOIN CHECK (Backend Source of Truth)
    const userId = localStorage.getItem('userId');
    const joined = event?.participants?.some(
        (p) => (typeof p === 'string' ? p : p._id) === userId
    ) || false;

    const handleJoinToggle = async () => {
        try {
            if (joined) {
                await eventService.leaveEvent(id);
                leaveEvent(id);
            } else {
                await eventService.joinEvent(id);
                joinEvent(id);
            }
        } catch (err) {
            // HARD STOP: do NOT retry join if already joined
            if (
                err?.response?.data?.message === 'User already joined this event'
            ) {
                return;
            }

            console.error('Join/Leave failed:', err);
        }
    };

    if (loading) {
        return (
            <PageWrapper>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </PageWrapper>
        );
    }

    if (error || !event) {
        return (
            <PageWrapper>
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event not found</h2>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Cover Image */}
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    )}
                    {event.isHost && (
                        <div className="absolute top-4 right-4">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                                You're the Host
                            </span>
                        </div>
                    )}
                </div>

                {/* Event Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {event.title}
                            </h1>
                            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full">
                                {event.category || event.type}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {event.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{event.date} at {event.time}</span>
                        </div>

                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                        </div>

                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{event.participants?.length || 0} participants</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {joined ? (
                            <Button
                                onClick={() => navigate(`/chat/${id}`)}
                                className="flex-1"
                                variant="secondary"
                            >
                                Go to Chat
                            </Button>
                        ) : (
                            <Button
                                onClick={handleJoinToggle}
                                className="flex-1"
                                variant="primary"
                            >
                                Join Event
                            </Button>
                        )}
                    </div>
                </div>

                {/* Chat Section Removed - Navigates to dedicated page now */}
            </div>
        </PageWrapper>
    );
};

export default EventDetail;

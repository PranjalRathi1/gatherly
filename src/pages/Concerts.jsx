import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import EventCard from '../components/event/EventCard';
import EventSkeleton from '../components/event/EventSkeleton';
import EmptyState from '../components/common/EmptyState';
import { useEventStore } from '../store/eventStore';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { CONCERT } from '../constants/eventTypes';

const Concerts = () => {
    const navigate = useNavigate();
    const { joinEvent, leaveEvent, isJoined } = useEventStore();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getEventsByType(CONCERT);
            setEvents(response.data || []);
        } catch (error) {
            console.error('Failed to fetch concerts', error);
        } finally {
            setLoading(false);
        }
    };

    const userId = localStorage.getItem('userId');

    const isUserJoined = (event) =>
        event?.participants?.some(
            (p) => p === userId || p?._id === userId
        );

    const handleJoinEvent = async (eventId, joined) => {
        try {
            if (joined) {
                await eventService.leaveEvent(eventId);
                leaveEvent(eventId);
            } else {
                await eventService.joinEvent(eventId);
                joinEvent(eventId);
                navigate(`/event/${eventId}`);
            }
        } catch (err) {
            // hard stop on “already joined”
            if (err?.response?.data?.message === 'User already joined this event') return;

            console.error(
                'Join failed:',
                err.response?.data?.message || err.message
            );
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Concerts</h1>
                    <p className="text-gray-600 dark:text-gray-400">Experience live music and performances</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <EventSkeleton key={i} />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <EmptyState
                        title="No concerts found"
                        message="Check back later for upcoming shows."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => {
                            const joined = isUserJoined(event);
                            return (
                                <EventCard
                                    key={event._id}
                                    {...event}
                                    onCardClick={() => navigate(`/event/${event._id}`)}
                                    onButtonClick={() => handleJoinEvent(event._id, joined)}
                                    buttonText={joined ? 'Leave' : 'Join'}
                                    buttonVariant={joined ? 'secondary' : 'primary'}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Concerts;

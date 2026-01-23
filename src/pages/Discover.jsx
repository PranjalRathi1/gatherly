import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import EventCard from '../components/event/EventCard';
import EventSkeleton from '../components/event/EventSkeleton';
import EmptyState from '../components/common/EmptyState';
import CreateEventModal from '../components/event/CreateEventModal';
import { useEventStore } from '../store/eventStore';
import { useNavigate } from 'react-router-dom';
import { mockEvents } from '../utils/mockData';

const Discover = () => {
    const navigate = useNavigate();
    const { events, setEvents, joinEvent, leaveEvent, isJoined, addEvent } = useEventStore();
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setTimeout(() => {
            setEvents(mockEvents);
            setLoading(false);
        }, 1000);
    }, []);

    const handleJoinEvent = (eventId) => {
        if (isJoined(eventId)) {
            leaveEvent(eventId);
        } else {
            joinEvent(eventId);
        }
    };

    const handleCreateEvent = (eventData) => {
        const newEvent = {
            id: Date.now(),
            ...eventData,
            isHost: true,
            participants: 1
        };
        addEvent(newEvent);
        setShowCreateModal(false);
    };

    const filteredEvents = filter === 'all'
        ? events
        : events.filter(e => e.category.toLowerCase() === filter.toLowerCase());

    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Discover Events</h1>
                    <p className="text-gray-600 dark:text-gray-400">Find and join amazing events in your community</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                    {['all', 'Basketball', 'Football', 'Yoga', 'Technology'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <EventSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <EmptyState
                        icon={
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                        title="No events found"
                        message="Try adjusting your filters or create a new event"
                        actionText="Create Event"
                        onAction={() => setShowCreateModal(true)}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                {...event}
                                onCardClick={() => navigate(`/event/${event.id}`)}
                                onButtonClick={() => handleJoinEvent(event.id)}
                                buttonText={isJoined(event.id) ? 'Leave' : 'Join'}
                                buttonVariant={isJoined(event.id) ? 'secondary' : 'primary'}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateEventModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateEvent}
            />
        </PageWrapper>
    );
};

export default Discover;

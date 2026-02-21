import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '../components/layout/PageWrapper';
import EventCard from '../components/event/EventCard';
import EventSkeleton from '../components/event/EventSkeleton';
import EmptyState from '../components/common/EmptyState';
import CreateEventModal from '../components/event/CreateEventModal';

import { useEventStore } from '../store/eventStore';
import { eventService } from '../services/eventService';

const Discover = () => {
  const navigate = useNavigate();
  const { addEvent } = useEventStore();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* =======================
     FETCH EVENTS (SAFE)
  ======================== */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      const apiEvents = response.data?.data || [];

      // Merge with local events from store (preserved across navigation)
      // Local events typically have numeric IDs (Date.now()), while MongoDB IDs are 24 chars
      const storeState = useEventStore.getState();
      const localEvents = storeState.events.filter(e => e._id && e._id.length < 24);

      // Combine local and API events, filtering duplicates just in case
      const combinedEvents = [...localEvents, ...apiEvents];

      setEvents(combinedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);

      // Even on error, try to show local events
      const storeState = useEventStore.getState();
      const localEvents = storeState.events.filter(e => e._id && e._id.length < 24);
      setEvents(localEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);



  /* =======================
     FILTER (ARRAY ONLY)
  ======================== */
  const filteredEvents =
    filter === 'all'
      ? events
      : events.filter(
        (e) =>
          e?.type &&
          e.type.toLowerCase() === filter.toLowerCase()
      );

  /* =======================
     JOIN / LEAVE
  ======================== */
  /* =======================
     JOIN / LEAVE
  ======================== */
  /* =======================
     JOIN / LEAVE
  ======================== */
  const handleJoinEvent = async (eventId) => {
    try {
      await eventService.joinEvent(eventId);
      await fetchEvents(); // 🔥 THIS IS CRITICAL
    } catch (err) {
      console.error(
        'Join failed:',
        err?.response?.data || err
      );
    }
  };

  /* =======================
     CREATE EVENT (BACKEND)
  ======================== */
  const handleCreateEvent = async (eventData) => {
    try {
      const response = await eventService.createEvent(eventData);
      const createdEvent = response.data?.data;

      setShowCreateModal(false);

      // Update list before navigating away (optional, but good for back button)
      await fetchEvents();

      // ✅ Navigate to REAL MongoDB event
      navigate(`/event/${createdEvent._id}`);
    } catch (err) {
      console.error('Failed to create event', err);
    }
  };

  // 🔴 DEBUG LINE (TEMPORARY)
  console.log(
    'DEBUG filteredEvents =>',
    filteredEvents,
    'isArray?',
    Array.isArray(filteredEvents)
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Discover Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and join amazing events in your community
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors w-full md:w-auto"
          >
            Create Event
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['all', 'concert', 'travel', 'trek', 'meetup'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredEvents.length === 0 && (
          <EmptyState
            title="No events found"
            message="Try adjusting your filters or create a new event"
            actionText="Create Event"
            onAction={() => setShowCreateModal(true)}
          />
        )}

        {/* EVENTS */}
        {!loading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const eventId = event._id || event.id;

              // Get userId from token (safe method)
              const token = localStorage.getItem('token');
              let userId = null;
              try {
                if (token) userId = JSON.parse(atob(token.split('.')[1])).id;
              } catch (e) { console.error('Token parse failed', e); }

              const isUserJoined = event.participants?.some(p =>
                p === userId || p?._id === userId
              );

              return (
                <EventCard
                  key={eventId}
                  {...event}
                  onCardClick={() => navigate(`/event/${eventId}`)}
                  onButtonClick={() => {
                    if (isUserJoined) {
                      navigate(`/chat/${eventId}`);
                    } else {
                      handleJoinEvent(eventId);
                    }
                  }}
                  buttonText={isUserJoined ? 'Go to Chat' : 'Join'}
                  buttonVariant={isUserJoined ? 'secondary' : 'primary'}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEvent}
      />
    </PageWrapper>
  );
};

export default Discover;

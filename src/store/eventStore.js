import { create } from 'zustand';

export const useEventStore = create((set, get) => ({
    events: [],
    joinedEvents: JSON.parse(localStorage.getItem('joinedEvents') || '[]'),
    loading: false,

    setEvents: (events) => set({ events }),

    setJoinedEvents: (eventIds) => {
        localStorage.setItem('joinedEvents', JSON.stringify(eventIds));
        set({ joinedEvents: eventIds });
    },

    joinEvent: (eventId) => {
        const updated = [...new Set([...get().joinedEvents, eventId])];
        localStorage.setItem('joinedEvents', JSON.stringify(updated));
        set({ joinedEvents: updated });
    },

    leaveEvent: (eventId) => {
        const updated = get().joinedEvents.filter(id => id !== eventId);
        localStorage.setItem('joinedEvents', JSON.stringify(updated));
        set({ joinedEvents: updated });
    },

    isJoined: (eventId) => {
        return get().joinedEvents.includes(eventId);
    },

    setLoading: (loading) => set({ loading })
}));

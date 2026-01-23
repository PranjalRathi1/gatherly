import { create } from 'zustand';

export const useEventStore = create((set, get) => ({
    events: [],
    joinedEvents: [],
    loading: false,

    setEvents: (events) => set({ events }),

    addEvent: (event) => set((state) => ({
        events: [event, ...state.events]
    })),

    joinEvent: (eventId) => set((state) => ({
        joinedEvents: [...state.joinedEvents, eventId]
    })),

    leaveEvent: (eventId) => set((state) => ({
        joinedEvents: state.joinedEvents.filter(id => id !== eventId)
    })),

    isJoined: (eventId) => {
        return get().joinedEvents.includes(eventId);
    },

    setLoading: (loading) => set({ loading })
}));

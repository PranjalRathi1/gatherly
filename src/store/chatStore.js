import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
    chats: {},

    addMessage: (eventId, message) => set((state) => ({
        chats: {
            ...state.chats,
            [eventId]: [...(state.chats[eventId] || []), message]
        }
    })),

    getMessages: (eventId) => {
        return get().chats[eventId] || [];
    },

    initChat: (eventId) => set((state) => ({
        chats: {
            ...state.chats,
            [eventId]: state.chats[eventId] || []
        }
    }))
}));

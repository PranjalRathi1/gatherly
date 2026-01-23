import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
    })),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
    })),

    setNotifications: (notifications) => {
        const unread = notifications.filter(n => !n.read).length;
        set({ notifications, unreadCount: unread });
    }
}));

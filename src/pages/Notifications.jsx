import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useNotificationStore } from '../store/notificationStore';
import { mockNotifications } from '../utils/mockData';
import Button from '../components/common/Button';

const Notifications = () => {
    const { notifications, markAsRead, markAllAsRead, setNotifications } = useNotificationStore();

    React.useEffect(() => {
        setNotifications(mockNotifications);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'event_join':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                );
            case 'event_reminder':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'chat_message':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    {notifications.some(n => !n.read) && (
                        <Button size="sm" variant="secondary" onClick={markAllAsRead}>
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="space-y-2">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                className={`bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer transition-all ${!notification.read
                                        ? 'border-l-4 border-blue-600 shadow-md'
                                        : 'border-l-4 border-transparent'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${!notification.read
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {notification.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-500 text-xs">
                                            {notification.timestamp}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Notifications;

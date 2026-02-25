import api from './api';

export const eventService = {
    // Get all events
    getAllEvents: () => {
        return api.get('/events');
    },

    // Get events by type
    getEventsByType: (type) => {
        return api.get(`/events/type/${type}`);
    },

    // Get single event by ID
    getEventById: (id) => {
        return api.get(`/events/${id}`);
    },

    // Join an event
    joinEvent: (id) => {
        return api.post(`/events/${id}/join`);
    },

    // Leave an event
    leaveEvent: (id) => {
        return api.post(`/events/${id}/leave`);
    },

    // Create a new event
    createEvent: (eventData) => {
        return api.post('/events', eventData);
    }
};

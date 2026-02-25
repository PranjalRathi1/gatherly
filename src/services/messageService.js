import api from './api';

export const messageService = {
    /**
     * Get message history for an event with pagination
     * @param {string} eventId - Event ID
     * @param {string|null} before - Timestamp for pagination (ISO string)
     * @param {number} limit - Number of messages to fetch
     * @returns {Promise} - Promise resolving to message data
     */
    getEventMessages: (eventId, before = null, limit = 50) => {
        const params = { limit };
        if (before) params.before = before;
        return api.get(`/messages/${eventId}`, { params });
    },

    /**
     * Pin a message globally (admin only)
     * @param {string} messageId - Message ID to pin
     * @returns {Promise}
     */
    pinGlobally: (messageId) => {
        return api.post(`/messages/${messageId}/pin-global`);
    },

    /**
     * Unpin a global message (admin only)
     * @param {string} messageId - Message ID to unpin
     * @returns {Promise}
     */
    unpinGlobally: (messageId) => {
        return api.delete(`/messages/${messageId}/unpin-global`);
    },

    /**
     * Toggle personal pin for a message
     * @param {string} messageId - Message ID to pin/unpin
     * @returns {Promise} - Returns { pinned: boolean }
     */
    togglePersonalPin: (messageId) => {
        return api.post(`/messages/${messageId}/pin-personal`);
    }
};

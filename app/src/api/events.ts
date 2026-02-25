import api from './axios';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  creator: {
    _id: string;
    username: string;
    email: string;
  };
  attendees: Array<{
    _id: string;
    username: string;
  }>;
  maxAttendees: number;
  category?: 'concert' | 'travel' | 'trekking';
  imageUrl?: string;
  visibility: 'public' | 'private';
  joinCode?: string;

  // ✅ Improved type (since backend populates joinRequests)
  joinRequests?: Array<{
    _id: string;
    username: string;
    email: string;
  }>;

  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees?: number;
  category?: 'concert' | 'travel' | 'trekking';
  visibility: 'public' | 'private';
  joinCode?: string;
  imageUrl?: string;
}

export const eventsApi = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // ✅ NEW — Get Event By Join Code
  getEventByCode: async (code: string): Promise<Event> => {
    const response = await api.get(`/events/code/${code}`);
    return response.data;
  },

  createEvent: async (data: CreateEventData): Promise<Event> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  joinEvent: async (
    id: string,
    joinCode?: string
  ): Promise<{ message: string; event: Event }> => {
    const response = await api.post(`/events/${id}/join`, { joinCode });
    return response.data;
  },

  leaveEvent: async (
    id: string
  ): Promise<{ message: string; event: Event }> => {
    const response = await api.post(`/events/${id}/leave`);
    return response.data;
  },

  approveRequest: async (eventId: string, userId: string) => {
    const response = await api.post(
      `/events/${eventId}/approve/${userId}`
    );
    return response.data;
  },

  rejectRequest: async (eventId: string, userId: string) => {
    const response = await api.post(
      `/events/${eventId}/reject/${userId}`
    );
    return response.data;
  },

  deleteEvent: async (
    id: string
  ): Promise<{ message: string }> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export default eventsApi;
import api from './axios';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  creator: {
    id: string;
    username: string;
    email: string;
  };
  attendees: Array<{
    id: string;
    username: string;
  }>;
  maxAttendees: number;
  category?: 'concert' | 'travel' | 'trekking';
  imageUrl?: string;
  visibility: 'public' | 'private';
  joinCode?: string;
  joinRequests?: Array<{
    id: string;
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

/* 🔥 Normalization Helper */
const normalizeEvent = (event: any): Event => ({
  ...event,
  id: event._id,
  creator: {
    ...event.creator,
    id: event.creator?._id,
  },
  attendees:
    event.attendees?.map((a: any) => ({
      ...a,
      id: a._id,
    })) || [],
  joinRequests:
    event.joinRequests?.map((jr: any) => ({
      ...jr,
      id: jr._id,
    })) || [],
});

export const eventsApi = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data.map(normalizeEvent);
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return normalizeEvent(response.data);
  },

  getEventByCode: async (code: string): Promise<Event> => {
    const response = await api.get(`/events/code/${code}`);
    return normalizeEvent(response.data);
  },

  createEvent: async (data: CreateEventData): Promise<Event> => {
    const response = await api.post('/events', data);
    return normalizeEvent(response.data);
  },

  joinEvent: async (
    id: string,
    joinCode?: string
  ): Promise<{ message: string; event: Event }> => {
    const response = await api.post(`/events/${id}/join`, { joinCode });

    return {
      message: response.data.message,
      event: normalizeEvent(response.data.event),
    };
  },

  leaveEvent: async (
    id: string
  ): Promise<{ message: string; event: Event }> => {
    const response = await api.post(`/events/${id}/leave`);

    return {
      message: response.data.message,
      event: normalizeEvent(response.data.event),
    };
  },

  approveRequest: async (
    eventId: string,
    userId: string
  ): Promise<{ message: string; event: Event }> => {
    const response = await api.post(
      `/events/${eventId}/approve/${userId}`
    );

    return {
      message: response.data.message,
      event: normalizeEvent(response.data.event),
    };
  },

  rejectRequest: async (
    eventId: string,
    userId: string
  ): Promise<{ message: string; event: Event }> => {
    const response = await api.post(
      `/events/${eventId}/reject/${userId}`
    );

    return {
      message: response.data.message,
      event: normalizeEvent(response.data.event),
    };
  },

  deleteEvent: async (
    id: string
  ): Promise<{ message: string }> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export default eventsApi;
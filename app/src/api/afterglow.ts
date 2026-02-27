import api from './axios';

export interface AfterglowData {
    id: string; // ✅ normalized
    title: string;
    content: string;
    author: {
        id: string; // ✅ normalized
        username: string;
        email: string;
        displayName?: string;
    };
    tags: string[];
    photos: string[];
    eventRef?: {
        id: string; // ✅ normalized
        title: string;
        category: string;
        date: string;
        location: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateAfterglowData {
    title: string;
    content: string;
    photos?: string[];
    tags?: string[];
    eventRef?: string;
}

/* 🔥 Normalization Helper */
const normalizeAfterglow = (data: any): AfterglowData => ({
    ...data,
    id: data._id,
    author: {
        ...data.author,
        id: data.author?._id,
    },
    eventRef: data.eventRef
        ? {
            ...data.eventRef,
            id: data.eventRef._id,
        }
        : undefined,
});

export const afterglowApi = {
    getAllAfterglows: async (): Promise<AfterglowData[]> => {
        const response = await api.get('/afterglows');
        return response.data.map(normalizeAfterglow);
    },

    getAfterglowById: async (id: string): Promise<AfterglowData> => {
        const response = await api.get(`/afterglows/${id}`);
        return normalizeAfterglow(response.data);
    },

    createAfterglow: async (
        data: CreateAfterglowData
    ): Promise<AfterglowData> => {
        const response = await api.post('/afterglows', data);
        return normalizeAfterglow(response.data.afterglow);
    },

    updateAfterglow: async (
        id: string,
        data: CreateAfterglowData
    ): Promise<AfterglowData> => {
        const response = await api.put(`/afterglows/${id}`, data);
        return normalizeAfterglow(response.data.afterglow);
    },

    deleteAfterglow: async (
        id: string
    ): Promise<{ message: string }> => {
        const response = await api.delete(`/afterglows/${id}`);
        return response.data;
    }
};

export default afterglowApi;
import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response;
    },

    signup: async (name, email, password) => {
        const response = await api.post('/auth/signup', { name, email, password });
        return response;
    },

    logout: async () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    }
};

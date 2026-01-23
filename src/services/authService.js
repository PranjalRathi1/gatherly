import api from './api';

export const authService = {
    login: async (email, password) => {
        // Mock implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        user: { id: 1, name: 'John Doe', email },
                        token: 'mock-jwt-token-' + Date.now()
                    }
                });
            }, 1000);
        });
    },

    signup: async (name, email, password) => {
        // Mock implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        user: { id: 1, name, email },
                        token: 'mock-jwt-token-' + Date.now()
                    }
                });
            }, 1000);
        });
    },

    logout: async () => {
        return Promise.resolve();
    }
};

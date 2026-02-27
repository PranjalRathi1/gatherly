import axios from './axios';

export interface Profile {
    user: {
        id: string;
        username: string;
        email: string;
        displayName: string;
        avatar: string;
        penguinEnabled: boolean;
    };
    joinedEvents: any[];
    blogs: any[];
}

export const profileApi = {
    // Get profile (own or by userId)
    getProfile: async (userId?: string): Promise<Profile> => {
        const url = userId ? `/profile/${userId}` : '/profile';
        const response = await axios.get(url);
        const data = response.data;

        return {
            ...data,
            user: {
                ...data.user,
                id: data.user._id,
            }
        };
    },
    // Update own profile
    updateProfile: async (data: {
        displayName?: string;
        avatar?: string;
        penguinEnabled?: boolean;
    }) => {
        const response = await axios.put('/profile', data);
        const updated = response.data;

        return {
            ...updated,
            user: {
                ...updated.user,
                id: updated.user._id,
            }
        };
    },
};

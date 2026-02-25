import { create } from 'zustand';

export const useClubStore = create((set, get) => ({
    clubs: [],
    followingClubs: [],
    loading: false,

    setClubs: (clubs) => set({ clubs }),

    addClub: (club) => set((state) => ({
        clubs: [club, ...state.clubs]
    })),

    followClub: (clubId) => set((state) => ({
        followingClubs: [...state.followingClubs, clubId]
    })),

    unfollowClub: (clubId) => set((state) => ({
        followingClubs: state.followingClubs.filter(id => id !== clubId)
    })),

    isFollowing: (clubId) => {
        return get().followingClubs.includes(clubId);
    },

    setLoading: (loading) => set({ loading })
}));

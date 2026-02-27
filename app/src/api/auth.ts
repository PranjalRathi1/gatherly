import api from './axios';

interface SignupData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  penguinEnabled?: boolean;
  role: 'user' | 'creator' | 'admin';
  creatorRequestStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export const authApi = {
  /* =========================
     SIGNUP
  ========================== */
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    const user = response.data.user;

    return {
      ...response.data,
      user: {
        ...user,
        id: user._id || user.id,
        role: user.role ?? 'user',
        creatorRequestStatus: user.creatorRequestStatus ?? 'none',
      }
    };
  },

  /* =========================
     LOGIN
  ========================== */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    const user = response.data.user;

    return {
      ...response.data,
      user: {
        ...user,
        id: user._id || user.id,
        role: user.role ?? 'user',
        creatorRequestStatus: user.creatorRequestStatus ?? 'none',
      }
    };
  },

  /* =========================
     GET CURRENT USER
  ========================== */
  getMe: async (): Promise<AuthUser> => {
    const response = await api.get('/auth/me');
    const user = response.data;

    return {
      ...user,
      id: user._id || user.id,
      role: user.role ?? 'user',
      creatorRequestStatus: user.creatorRequestStatus ?? 'none',
    };
  },

  /* =========================
     CREATOR REQUEST
  ========================== */
  requestCreatorAccess: async () => {
    const response = await api.post('/auth/request-creator');
    return response.data;
  },

  /* =========================
     ADMIN PANEL
  ========================== */
  getPendingCreators: async () => {
    const response = await api.get('/auth/pending-creators');
    return response.data;
  },
  rejectCreator: async (userId: string) => {
    const response = await api.post(`/auth/reject-creator/${userId}`);
    return response.data;
  },

  approveCreator: async (userId: string) => {
    const response = await api.post(`/auth/approve-creator/${userId}`);
    return response.data;
  }
};



export default authApi;
import api from './api';

const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};

export default authService;

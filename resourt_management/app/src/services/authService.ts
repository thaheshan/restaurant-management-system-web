import api from './api';

const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: string;
  }) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  sendOtp: async (mobileNumber: string) => {
    const res = await api.post('/auth/send-otp', { mobileNumber });
    return res.data;
  },
  verifyOtp: async (mobileNumber: string, otp: string) => {
    const res = await api.post('/auth/verify-otp', { mobileNumber, otp });
    return res.data;
  },
  adminLogin: async (email: string, password: string) => {
    const res = await api.post('/auth/admin-login', { email, password });
    return res.data;
  },
};

export default authService;
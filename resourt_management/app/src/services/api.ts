import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const session = localStorage.getItem('adminSession');
  if (session) {
    const parsed = JSON.parse(session);
    const token = parsed.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminSession');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
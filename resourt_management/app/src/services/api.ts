import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const session = localStorage.getItem('adminSession');
  if (session) {
    const parsed = JSON.parse(session);
    const token = parsed.token;
    const userId = parsed.user?.id || parsed.userId || '';
    const role = parsed.user?.role || parsed.role || 'admin';
    const restaurantId = parsed.user?.restaurantId || parsed.restaurantId || '';
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (userId) config.headers['x-user-id'] = userId;
    if (role) config.headers['x-user-role'] = role;
    if (restaurantId) config.headers['x-restaurant-id'] = restaurantId;
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
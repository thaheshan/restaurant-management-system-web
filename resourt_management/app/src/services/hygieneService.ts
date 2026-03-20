import api from './api';

const hygieneService = {
  getDashboard: async (restaurantId: string) => {
    const res = await api.get(`/hygiene/restaurant/${restaurantId}/dashboard`);
    return res.data;
  },
  getCertifications: async (restaurantId: string) => {
    const res = await api.get(`/hygiene/restaurant/${restaurantId}/certifications`);
    return res.data;
  },
  addCertification: async (restaurantId: string, data: any) => {
    const res = await api.post(`/hygiene/restaurant/${restaurantId}/certification`, data);
    return res.data;
  },
  getSanitizationLogs: async (restaurantId: string) => {
    const res = await api.get(`/hygiene/restaurant/${restaurantId}/sanitization-logs`);
    return res.data;
  },
  addSanitizationLog: async (restaurantId: string, data: any) => {
    const res = await api.post(`/hygiene/restaurant/${restaurantId}/sanitization-log`, data);
    return res.data;
  },
};

export default hygieneService;
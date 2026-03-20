import api from './api';

const inventoryService = {
  getAll: async (restaurantId: string) => {
    const res = await api.get(`/inventory/restaurant/${restaurantId}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post('/inventory/', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/inventory/${id}`, data);
    return res.data;
  },
  getExpiryAlerts: async (restaurantId: string) => {
    const res = await api.get(`/inventory/restaurant/${restaurantId}/expiry-alerts`);
    return res.data;
  },
  getStats: async (restaurantId: string) => {
    const res = await api.get(`/inventory/restaurant/${restaurantId}/stats`);
    return res.data;
  },
};

export default inventoryService;
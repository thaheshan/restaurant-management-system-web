import api from './api';

const expiryService = {
  getAll: async (restaurantId: string) => {
    const res = await api.get(`/inventory/restaurant/${restaurantId}/expiry-alerts`);
    return res.data;
  },
};

export default expiryService;
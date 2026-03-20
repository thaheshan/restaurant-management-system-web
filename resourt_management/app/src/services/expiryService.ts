import api from './api';

const expiryService = {
  getAll: async () => {
    const response = await api.get('/expiry-alerts');
    return response.data;
  },
  resolve: async (id: number) => {
    await api.patch(+""+/expiry-alerts/+""+/resolve+""+`);
  },
};

export default expiryService;

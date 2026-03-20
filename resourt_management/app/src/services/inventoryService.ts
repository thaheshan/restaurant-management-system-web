import api from './api';

const inventoryService = {
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(+""+/inventory/+""+""+`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(+""+/inventory/+""+""+`);
  },
};

export default inventoryService;

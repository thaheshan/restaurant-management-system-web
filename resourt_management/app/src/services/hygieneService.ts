import api from './api';

const hygieneService = {
  getAll: async () => {
    const response = await api.get('/hygiene');
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(+""+/hygiene/+""+""+`, data);
    return response.data;
  },
};

export default hygieneService;

import api from './api';

const subjectService = {
  create: async (data) => {
    const response = await api.post('/subjects', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  }
};

export default subjectService;

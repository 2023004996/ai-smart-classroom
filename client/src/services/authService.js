import api from './api';

const authService = {
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async ({ name, email, password, role }) => {
    const response = await api.post('/auth/signup', { name, email, password, role });
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default authService;

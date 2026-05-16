import api from './api';

const aiService = {
  askTutor: async (message) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  }
};

export default aiService;

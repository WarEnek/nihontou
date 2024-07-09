import axios from 'axios';

const API_BASE_URL = '/api';
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  processText: async (data) => {
    const response = await api.post('/api/ProcessedText', data);
    return response.data;
  },

  getAllPrompts: async () => {
    const response = await api.get('/api/Prompts');
    return response.data;
  },

  createPrompt: async (data) => {
    const response = await api.post('/api/Prompts', data);
    return response.data;
  },

  updatePrompt: async (id, data) => {
    const response = await api.put(`/api/Prompts/${id}`, data);
    return response.data;
  },

  deletePrompt: async (id) => {
    await api.delete(`/api/Prompts/${id}`);
  },
};
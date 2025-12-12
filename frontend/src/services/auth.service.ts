import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username, password, fullName, studentId) => {
    const response = await api.post('/auth/register', { username, password, fullName, studentId });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // As per PROGRESS.md
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // For example, redirect to login or refresh token
      // For now, we just log it
      console.error('Unauthorized, logging out.');
      // This could trigger a logout action in the AuthContext
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

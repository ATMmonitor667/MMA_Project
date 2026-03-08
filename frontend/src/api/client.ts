import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('mma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mma_token');
      localStorage.removeItem('mma_user');
    }
    return Promise.reject(error);
  }
);

export default client;

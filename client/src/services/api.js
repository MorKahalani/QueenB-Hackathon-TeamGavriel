import axios from 'axios';
const apiUrl = import.meta.env.VITE_SERVER_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/api/auth/login')) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); 
      window.location.href = '/login';  
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
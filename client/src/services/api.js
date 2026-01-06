import axios from 'axios';
const apiUrl = import.meta.env.VITE_SERVER_API_URL;

// Create an instance of Axios with default configurations
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // שליפת הטוקן מהאחסון המקומי של הדפדפן
    const token = localStorage.getItem('token');
    
    if (token) {
      // הוספת הטוקן לכותרת x-auth-token כפי שהגדרנו ב-Middleware בשרת
      config.headers['x-auth-token'] = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

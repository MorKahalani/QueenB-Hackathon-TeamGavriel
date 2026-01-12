import axios from 'axios';
const apiUrl = import.meta.env.VITE_SERVER_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// זה ה-Interceptor שכבר יש לך (שמוסיף את הטוקן)
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

// --- זה החלק החדש שאת מוסיפה עכשיו (הטיפול בשגיאות) ---
axiosInstance.interceptors.response.use(
  (response) => response, // אם הכל טוב, אל תעשה כלום
  (error) => {
    // אם חזרה שגיאת 401 (אין הרשאה/טוקן פג תוקף)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // מנקים את הטוקן התקול
      window.location.href = '/login';   // שולחים ללוגין
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
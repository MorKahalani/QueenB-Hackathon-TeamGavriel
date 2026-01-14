import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';
import toast from 'react-hot-toast';
import api from '../../services/api';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);

      toast.success('התחברת בהצלחה למערכת');
  
      navigate('/admin'); 
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'אופס! משהו השתבש בהתחברות';
      toast.error(errorMsg);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    } 
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h2>כניסת צוות חינוכי</h2>
        <input 
          type="email" 
          placeholder="אימייל" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="סיסמה" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">התחברות</button>
        <button type="button" className={styles.backBtn} onClick={() => navigate('/')}>
          חזרה לדף הבית
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
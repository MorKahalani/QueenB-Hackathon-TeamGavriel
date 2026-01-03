import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    /*קריאה לבק אנד */
    console.log("Logging in with:", email, password);
    navigate('/admin'); 
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
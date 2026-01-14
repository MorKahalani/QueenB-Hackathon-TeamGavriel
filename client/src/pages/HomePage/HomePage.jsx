import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUsers, FiLock } from "react-icons/fi"; 
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin'); 
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className={styles.home}>
      <header className={styles.heroSection}>
        <h1 className={styles.headline}> מערכת ניהול דיווחים לצוות החינוכי</h1>
        <p className={styles.subline}>המרחב הבטוח שלך לניהול, מעקב וטיפול בדיווחי תלמידים באופן דיסקרטי.</p>
      </header>
    
      <div className={styles.infoSection}>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepIcon}><FiShield /></div>
            <h3>ניהול מוגן</h3>
            <p>צפייה בדיווחים מסוננים לפי בית הספר והמורה המטפלת בלבד</p>
          </div>
        
          <div className={styles.step}>
            <div className={styles.stepIcon}><FiUsers /></div>
            <h3>חיבור לקהילה</h3>
            <p>כל מורה מקבלת את פניות התלמידים ששויכו אליה בזמן אמת</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}><FiLock /></div>
            <h3>אבטחה מלאה</h3>
            <p>גישה למערכת באמצעות מערכת מוצפנת המבטיחה הגנה על פרטיות התלמידים והצוות</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
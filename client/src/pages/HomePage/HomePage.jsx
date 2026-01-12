import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUsers, FiLock, FiLayout } from "react-icons/fi"; 
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();

  // חובה להגדיר את המשתנה לפני שמשתמשים בו
  const isLoggedIn = !!localStorage.getItem('token');
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin'); // אם היא מחוברת, "תקפיץ" אותה ישר לניהול
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className={styles.home}>
      <header className={styles.heroSection}>
        <h1 className={styles.headline}>SafeSpace - מערכת ניהול דיווחים לצוות החינוכי</h1>
        <p className={styles.subline}>המרחב הבטוח שלך לניהול, מעקב וטיפול בדיווחי תלמידים באופן דיסקרטי.</p>
      </header>
    
      <div className={styles.infoSection}>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepIcon}><FiShield /></div>
            <h3>ניהול מוגן</h3>
            <p>צפייה בדיווחים מסוננים לפי בית הספר והמורה המטפלת בלבד.</p>
          </div>
        
          <div className={styles.step}>
            <div className={styles.stepIcon}><FiUsers /></div>
            <h3>חיבור לקהילה</h3>
            <p>כל מורה מקבלת את פניות התלמידים ששויכו אליה בזמן אמת.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}><FiLock /></div>
            <h3>אבטחה מלאה</h3>
            <p>גישה למערכת באמצעות הצפנת JWT המבטיחה הגנה על פרטיות התלמידים והצוות.</p>
          </div>
        </div>
      </div>

      <div className={styles.selectionContainer}>
        <div className={styles.centerAction}>
          {isLoggedIn ? (
            <div className={styles.roleCard} onClick={() => navigate('/admin')}>
              <div className={styles.teacherIcon}><FiLayout /></div>
              <h2>שלום, חזרת למערכת</h2>
              <p>כל הדיווחים מחכים לך בלוח הניהול המאובטח שלך.</p>
              
            </div>
          ) : (
            <div className={styles.roleCard} onClick={() => navigate('/login')}>
              <div className={styles.teacherIcon}>👩‍🏫</div>
              <h2>כניסת צוות הוראה</h2>
              <p>התחברי כדי לצפות בדיווחים החדשים ולנהל את הטיפול באירועים.</p>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
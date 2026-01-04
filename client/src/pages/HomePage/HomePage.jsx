import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
/* import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx'; */


const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.home}>
      <h1 className={styles.headline}>ברוכים הבאים למערכת הדיווחים האנונימית</h1>
    
    <div className={styles.infoSection}>
      <div className={styles.stepsGrid}>
        <div className={styles.step}>
          <div className={styles.stepIcon}>✍️</div>
          <h3>מדווחים</h3>
          <p>לוחצים על &apos;לדיווח אנונימי&apos;, ממלאים את פרטי המקרה בטופס ושולחים למורה.</p>
        </div>
      
        <div className={styles.step}>
          <div className={styles.stepIcon}>🔒</div>
          <h3>נשארים אנונימיים</h3>
          <p>הדיווח מגיע למורה ללא פרטים מזהים. המערכת שומרת על הפרטיות שלכם באופן מלא.</p>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}>🔑</div>
          <h3>עוקבים אחר הטיפול</h3>
          <p>בסיום תקבלו קוד מעקב אישי. שמרו אותו כדי לצפות בתשובת המורה ולהמשיך בשיחה.</p>
        </div>
      </div>
    </div>
    <div className={styles.selectionContainer}>
      <div className={styles.cardsWrapper}>
          <div className={styles.roleCard} onClick={() => navigate('/report')}>
          <div className={styles.icon}>🔒💬</div>
          <h2>תלמידה יקרה, תלמיד יקר</h2>
          <p>צריכים לשתף במשהו שקרה? כאן ניתן לספר למורה באנונימיות מלאה</p>
          <button className={styles.studentBtn}>לדיווח אנונימי</button>
        </div>

        <div className={styles.roleCard} onClick={() => navigate('/login')}>
          <div className={styles.icon}>👩‍🏫</div>
          <h2>התחבר כמורה</h2>
          <p>כניסה למערכת לצפייה בדיווחים</p>
          <button className={styles.teacherBtn}>כניסת צוות</button>
          </div>
      </div>
    </div>
    </div>
  );
};

export default Home;

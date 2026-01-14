import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/Layout.module.css'; 
import logoImage from '../../assets/logo3.png';
import LogoutButton from '../LogoutButton/LogoutButton';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
 
  const isLoggedIn = !!localStorage.getItem('token');
  const isLoginPage = location.pathname === '/login';
  const isReportArea = location.pathname.startsWith('/report') || 
                       location.pathname === '/confirmation';

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
      <img src={logoImage} className={styles.logo} alt="SafeSpace" />
        </div>
        
        <div className={styles.actionsArea}>
          {(isLoggedIn && !isReportArea)  ? (
            <LogoutButton />
          ) : (
            (!isLoginPage && !isReportArea) && (
              <button 
                className={styles.loginHeaderBtn} 
                onClick={() => navigate('/login')}
              >
                כניסת צוות
              </button>
            )
          )}
        </div>
      </header>
      
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = {
    children: PropTypes.node
};

export default Layout;
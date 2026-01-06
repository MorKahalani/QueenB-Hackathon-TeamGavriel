// import styles from '../../styles/Layout.module.css'; 
import { Link } from 'react-router-dom';
// import logoImage from '../../assets/logo1.png'; 
// import PropTypes from 'prop-types'; 
// import LogoutButton from '../LogoutButton/LogoutButton';

// function Layout({ children }) {
//   return (
//     <div className={styles.wrapper}>
//       <header className={styles.header}>
//         <Link to="/" className={styles.logoLink}>
//           <img src={logoImage} alt="SafeSpace" className={styles.logo} />
//         </Link>
//       </header>

//       <main className={styles.content}>
//         <div className={styles.pageInner}>
//         {children}
//     </div>
//       </main>
//     </div>
//   );
// }

// Layout.propTypes = {
//     children: PropTypes.node
// };

// export default Layout;
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import styles from '../../styles/Layout.module.css'; 
import logoImage from '../../assets/logo1.png';
import LogoutButton from '../LogoutButton/LogoutButton';

function Layout({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          {/* עטיפת הלוגו בקישור לדף הבית */}
          <Link to="/" className={styles.logoLink}>
            <img src={logoImage} className={styles.logo} alt="SafeSpace" />
          </Link>
        </div>
        
        {isAdminPage && (
          <div className={styles.actionsArea}>
            <LogoutButton />
          </div>
        )}
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
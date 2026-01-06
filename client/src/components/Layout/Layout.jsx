import styles from '../../styles/Layout.module.css'; 
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo1.png'; 
import PropTypes from 'prop-types'; 

function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/" className={styles.logoLink}>
          <img src={logoImage} alt="SafeSpace" className={styles.logo} />
        </Link>
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
import styles from './Home.module.css';
import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';


const Home = () => {
  return (
    <div className={styles.home}>
      <h1 className={styles.headline}>ברוכים הבאים למעכת הדיווחים האנונימית</h1>
      
    </div>
  );
};

export default Home;

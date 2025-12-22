import { BrowserRouter, Routes, Route, Link } from 'react-router'
import Home from './pages/HomePage/HomePage';
import styles from './styles/App.module.css';
import AdminPage from './pages/AdminPage/AdminPage'; 


function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <nav className={styles.appNav}>
            <Link to="/" className={styles.appLink}>Home</Link>
          </nav>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage/>} />
          </Routes>
        </main>
        <footer className={styles.footer}>
          <p>&copy; BeSafe 2025</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

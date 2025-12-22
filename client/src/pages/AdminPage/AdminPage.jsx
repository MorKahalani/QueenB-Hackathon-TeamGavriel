import styles from './AdminPage.module.css'; 
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';

const AdminPage = () => { 
    return (
        <div className= {styles.adminContainer}>
            <h1> מערכת ניהול דיווחים - שם בית הספר</h1>
        <div className= {styles.statsRow}>
        <StatCard label="דיווחים חדשים:" count={5} type="new" />
        <StatCard label="מקרים דחופים:" count={2} type="urgent" />
        <StatCard label='סה"כ בטיפול:' count={3} type="process" />
        </div>
        <div className={styles.actionsBar}>
            <input 
                type="text"
                placeholder= "חפש לפי קוד או מילה:"
                className={styles.searchInput}
                />
            <div className={styles.filterButtons}>
                <button className={styles.blackBtn}>הצג רק חדשים</button>
                <button className={styles.blackBtn}>הצג רק דחופים</button>
            </div>
        </div>
        <ReportsTable />
        </div>
    );
}
export default AdminPage;
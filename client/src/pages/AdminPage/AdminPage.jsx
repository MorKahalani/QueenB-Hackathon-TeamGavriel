import styles from './AdminPage.module.css'; 
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';
import {useState} from 'react'; 

const mockReports = [
  { id: 'ABC-123', status: 'קריטי', subject: 'חרם בוואטסאפ',location: 'כיתה ח2' , description: 'התלמידים פתחו קבוצה נגד יואב',date: '20.11.2025 11:35' },
  { id: 'DEF-456', status: 'בטיפול', subject: 'אלימות מילולית', location: 'חצר בית הספר' , description:'צעקות וקללות בזמן ההפסקה', date: '21.11.2025 09:00' },
  { id: 'GHI-789', status: 'הסתיים', subject: 'שימוש בשפה לא נאותה', location: 'אולם ספורט' , description:'נאמרה קללה לעבר שירלי', date: '18.11.2025 14:20' },
];

const AdminPage = () => { 
    const [reports, setReports] = useState(mockReports); 

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = mockReports.filter(report => 
            report.id.toLowerCase().includes(searchTerm) || 
            report.subject.toLowerCase().includes(searchTerm) ||
            report.location.toLowerCase().includes(searchTerm)
        );
        setReports(filtered); 
    };

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
                onChange={handleSearch}
                />
            <div className={styles.filterButtons}>
                <button className={styles.blackBtn}>הצג רק חדשים</button>
                <button className={styles.blackBtn}>הצג רק דחופים</button>
            </div>
        </div>
        <ReportsTable reports ={reports}/>
        </div>
    );
}
export default AdminPage;
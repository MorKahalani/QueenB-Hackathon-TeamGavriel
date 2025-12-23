import LogoutButton from '../../components/LogoutButton/LogoutButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import styles from './AdminPage.module.css'; 
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';
import {useState} from 'react'; 
import { FiSearch } from "react-icons/fi"; 

const mockReports = [
  { id: 'ABC-123', status: 'קריטי', subject: 'חרם בוואטסאפ', location: 'כיתה ח2' , description: 'התלמידים פתחו קבוצה נגד יואב', date: '20.11.2025 11:35' },
  { id: 'DEF-456', status: 'בטיפול', subject: 'אלימות מילולית', location: 'חצר בית הספר' , description:'צעקות וקללות בזמן ההפסקה', date: '21.11.2025 09:00' },
  { id: 'GHI-789', status: 'הסתיים', subject: 'שימוש בשפה לא נאותה', location: 'אולם ספורט' , description:'נאמרה קללה לעבר שירלי', date: '18.11.2025 14:20' },
];

const AdminPage = () => { 
    const [activeFilter, setActiveFilter] = useState('all');
    const [reports, setReports] = useState(mockReports); 

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = mockReports.filter(report => 
            report.id.toLowerCase().includes(searchTerm) || 
            report.subject.toLowerCase().includes(searchTerm) ||
            report.location.toLowerCase().includes(searchTerm)
        );
        setReports(filtered); 
        setActiveFilter('all'); 
    };

    const filterReports = (status) => {
        setActiveFilter(status);
        if (status === 'all') {
            setReports(mockReports);
        } else {
            const filtered = mockReports.filter(r => r.status === status);
            setReports(filtered);
        }
    };

    return (
        <div className={styles.adminContainer}>
            <div className={styles.headerRow}>
                <LogoutButton />
                <h1>מערכת ניהול דיווחים - שם בית הספר</h1>
                <div style={{width: '100px'}}></div>
            </div>
      
            <div className={styles.statsRow}>
                <StatCard label="דיווחים חדשים:" count={5} type="new" />
                <StatCard label="מקרים דחופים:" count={2} type="urgent" />
                <StatCard label='סה"כ בטיפול:' count={3} type="process" />
            </div>

            <div className={styles.actionsBar}>
                <FiSearch className={styles.searchIcon} />
                <input 
                    type="text"
                    placeholder="חפש לפי קוד או מילה:"
                    className={styles.searchInput}
                    onChange={handleSearch}
                />
                
                <div className={styles.filterButtons}>
                    <button 
                        className={`${styles.blackBtn} ${activeFilter === 'all' ? styles.active : ''}`}
                        onClick={() => filterReports('all')}
                    >
                        הצג הכל
                    </button>
                    <button 
                        className={`${styles.blackBtn} ${activeFilter === 'בטיפול' ? styles.active : ''}`}
                        onClick={() => filterReports('בטיפול')}
                    >
                        הצג רק בטיפול
                    </button>
                    <button 
                        className={`${styles.blackBtn} ${activeFilter === 'קריטי' ? styles.active : ''}`}
                        onClick={() => filterReports('קריטי')}
                    >
                        הצג רק דחופים
                    </button>
                    <ExportButton data={reports} />
                </div>
            </div>

            <ReportsTable reports={reports}/>
        </div>
    );
}

export default AdminPage;
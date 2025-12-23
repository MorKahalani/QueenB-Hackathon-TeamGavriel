import LogoutButton from '../../components/LogoutButton/LogoutButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import styles from './AdminPage.module.css'; 
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';
import {useState} from 'react'; 
import { FiSearch } from "react-icons/fi"; 
import { Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';

const mockReports = [
  { id: 'BUL-001', status: 'חדש', subject: 'הפצת סטיקרים פוגעניים', location: 'וואטסאפ כיתתי', description: 'יצירת מדבקות עם תמונות מביכות של תלמיד בצירוף כיתוב מעליב', date: '24.11.2025 10:30' },
  { id: 'BUL-002', status: 'קריטי', subject: 'חרם חברתי מאורגן', location: 'שכבת כיתות ט\'', description: 'קבוצת תלמידים שמונעת מאחרים לשבת ליד תלמידה או לדבר איתה', date: '24.11.2025 08:15' },
  { id: 'BUL-003', status: 'בטיפול', subject: 'איומים ברשתות', location: 'טיקטוק / אינסטגרם', description: 'תגובה מאיימת ומסיתה תחת סרטון שהעלה תלמיד', date: '23.11.2025 21:00' },
  { id: 'BUL-004', status: 'חדש', subject: 'כינויי גנאי עדתיים', location: 'מסדרון קומה 1', description: 'צעקות וכינויים מעליבים כלפי קבוצת תלמידים במהלך ההפסקה', date: '25.11.2025 11:50' },
  { id: 'BUL-005', status: 'קריטי', subject: 'סחיטה באיומים', location: 'אולם ספורט', description: 'דרישת כסף מתלמיד צעיר בתמורה לכך שלא יציקו לו', date: '25.11.2025 13:20' },
  { id: 'BUL-006', status: 'בטיפול', subject: 'הפצת שמועות כוזבות', location: 'כלל בית הספר', description: 'הפצת מידע אישי שקרי במטרה לפגוע בשמו הטוב של תלמיד', date: '22.11.2025 09:00' },
  { id: 'BUL-007', status: 'בטיפול', subject: 'הדרה ממשחק קבוצתי', location: 'מגרש כדורגל', description: 'מניעה מכוונת מתלמיד להצטרף למשחק תוך לעג ליכולותיו', date: '15.11.2025 10:45' },
  { id: 'BUL-008', status: 'חדש', subject: 'צילום ללא הסכמה', location: 'שירותי בנים', description: 'ניסיון לצלם תלמיד מעבר לדלת במטרה להפיץ את הסרטון', date: '25.11.2025 14:10' },
  { id: 'BUL-009', status: 'בטיפול', subject: 'חיקויים מלעיגים', location: 'כיתה ז\'3', description: 'קבוצת תלמידים שמגחכת ומחקה תלמידה בכל פעם שהיא מדברת', date: '24.11.2025 12:00' },
  { id: 'BUL-010', status: 'חדש', subject: 'הסתרה/גניבת ציוד', location: 'כיתת לימוד', description: 'תיק של תלמיד הוחבא בתוך פח האשפה כמעשה פוגעני', date: '10.11.2025 15:30' }
];

const AdminPage = () => { 
    const [activeFilter, setActiveFilter] = useState('all');
    const [reports, setReports] = useState(mockReports); 
    const [showArchive, setShowArchive] = useState(false);

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

    const newCount = reports.filter(r=> r.status === 'חדש').length; 
    const urgentCount = reports.filter(r=> r.status === 'קריטי').length; 
    const inProcessCount = reports.filter(r=>r.status === 'בטיפול').length;

const handleArchive = (idToArchive) => {
    const updatedReports = reports.map(report => {
        if (report.id === idToArchive) {
            return { ...report, status: 'ארכיון' };
        }
        return report;
    });
    setReports(updatedReports);
}; 

const reportsToShow = reports.filter(r => {
    if (showArchive) {
        return r.status === 'ארכיון';
    } else {
        return r.status !== 'ארכיון';
    }
});


    return (
        <div className={styles.adminContainer}>
            <div className={styles.headerRow}>
                <LogoutButton />
                <h1>מערכת ניהול דיווחים - שם בית הספר</h1>
                <div style={{width: '100px'}}></div>
            </div>
      
            <div className={styles.statsRow}>
                <StatCard label="דיווחים חדשים:" count={newCount} type="new" />
                <StatCard label="מקרים דחופים:" count={urgentCount} type="urgent" />
                <StatCard label='סה"כ בטיפול:' count={inProcessCount} type="process" />
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
                    <Button 
                    variant={activeFilter === 'all' && !showArchive ? "contained" : "outlined"}
                    onClick={() => filterReports('all')}
                    disabled={showArchive} 
                sx={{ 
                    color: activeFilter === 'all' && !showArchive ? 'white' : 'black', 
                    borderColor: 'black',
                    backgroundColor: activeFilter === 'all' && !showArchive ? 'black' : 'transparent',
                    '&:hover': { backgroundColor: 'black', color: 'white', borderColor: 'black' },
                    marginLeft: '8px'
                }}
            >
                הצג הכל
            </Button>
            <Button 
                variant={activeFilter === 'בטיפול' && !showArchive ? "contained" : "outlined"}
                onClick={() => filterReports('בטיפול')}
                disabled={showArchive}
                sx={{ 
                    color: activeFilter === 'בטיפול' && !showArchive ? 'white' : 'black', 
                    borderColor: 'black',
                    backgroundColor: activeFilter === 'בטיפול' && !showArchive ? 'black' : 'transparent',
                    '&:hover': { backgroundColor: 'black', color: 'white', borderColor: 'black' },
                    marginLeft: '8px'
                }}
            >
                הצג רק בטיפול
            </Button>
            <Button 
                variant={activeFilter === 'קריטי' && !showArchive ? "contained" : "outlined"}
                onClick={() => filterReports('קריטי')}
                disabled={showArchive}
                sx={{ 
                    color: activeFilter === 'קריטי' && !showArchive ? 'white' : 'black', 
                    borderColor: 'black',
                    backgroundColor: activeFilter === 'קריטי' && !showArchive ? 'black' : 'transparent',
                    '&:hover': { backgroundColor: 'black', color: 'white', borderColor: 'black' },
                    marginLeft: '8px'
                }}
            >
                הצג רק דחופים
            </Button>
            <Button 
                variant={showArchive ? "contained" : "outlined"} 
                color="secondary" 
                startIcon={<InventoryIcon />} 
                onClick={() => setShowArchive(!showArchive)}
                sx={{ marginLeft: '20px', fontWeight: 'bold' }} 
            >
                {showArchive ? "חזור לדיווחים פעילים" : "צפה בארכיון"}
            </Button>
            <ExportButton data={reportsToShow} />
        </div>
                    </div>

            <ReportsTable reports={reportsToShow} onArchive={handleArchive}/>
        </div>
    );
}

export default AdminPage;
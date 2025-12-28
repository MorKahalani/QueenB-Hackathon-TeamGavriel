import LogoutButton from '../../components/LogoutButton/LogoutButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import styles from './AdminPage.module.css'; 
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';
import { useState } from 'react'; 
import { FiSearch } from "react-icons/fi"; 
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReportModal from '../../components/ReportModal/ReportModal';

const mockReports = [
    { id: 'BUL-001', status: 'חדש', subject: 'הפצת סטיקרים פוגעניים', location: 'וואטסאפ כיתתי', description: 'תלמיד יצר סדרת מדבקות (סטיקרים) המציגות תלמיד אחר בסיטואציות מביכות בשיעור ספורט, והפיץ אותן בקבוצה הכיתתית הרשמית בצירוף כיתובים מעליבים.', date: '24.11.2025 10:30' },
    { id: 'BUL-002', status: 'קריטי', subject: 'חרם חברתי מאורגן', location: 'שכבת כיתות ט\'', description: 'קבוצה של חמש בנות החליטה באופן מאורגן שלא לדבר עם תלמידה מסוימת, להוציא אותה מקבוצות הווטסאפ ולמנוע ממנה לשבת איתן בהפסקה כבר שבוע שלם.', date: '24.11.2025 08:15' },
    { id: 'BUL-003', status: 'בטיפול', subject: 'איומים ברשתות', location: 'טיקטוק / אינסטגרם', description: 'תחת סרטון שהעלה תלמיד לטיקטוק, נכתבו תגובות אנונימיות הכוללות איומים באלימות פיזית מחוץ לשטח בית הספר בסוף יום הלימודים.', date: '23.11.2025 21:00' },
    { id: 'BUL-004', status: 'חדש', subject: 'כינויי גנאי עדתיים', location: 'מסדרון קומה 1', description: 'במהלך ההפסקה הגדולה, קבוצת תלמידים קראה בצעקות כינויי גנאי על רקע עדתי כלפי תלמיד שעבר במסדרון, מה שהוביל להתקהלות ועימות מילולי חריף.', date: '25.11.2025 11:50' },
    { id: 'BUL-005', status: 'קריטי', subject: 'סחיטה באיומים', location: 'אולם ספורט', description: 'תלמיד מהשכבה הבוגרת דורש מתלמיד צעיר להביא לו 50 ש"ח בכל שבוע, ואם לא יעשה זאת, הוא מאיים שיפגע בו ויהרוס לו את הציוד האישי.', date: '25.11.2025 13:20' },
    { id: 'BUL-006', status: 'בטיפול', subject: 'הפצת שמועות כוזבות', location: 'כלל בית הספר', description: 'הפצת הודעת שרשרת בוואטסאפ המכילה מידע אישי שקרי ורגיש על חיי המשפחה של אחד המורים, במטרה להשפיל אותו מול התלמידים.', date: '22.11.2025 09:00' },
    { id: 'BUL-007', status: 'בטיפול', subject: 'הדרה ממשחק קבוצתי', location: 'מגרש כדורגל', description: 'בכל פעם שתלמיד מסוים מנסה להצטרף למשחק הכדורגל, קבוצה קבועה של תלמידים "מפוצצת" את המשחק או אומרת לו שהוא לא יכול לשחק כי הוא "חלש מדי".', date: '15.11.2025 10:45' },
    { id: 'BUL-008', status: 'חדש', subject: 'צילום ללא הסכמה', location: 'שירותי בנים', description: 'ניסיון של שני תלמידים לצלם תלמיד אחר בזמן שהותו בתא השירותים באמצעות הטלפון הנייד מלמעלה, במטרה להפיץ את התמונה לאחר מכן.', date: '25.11.2025 14:10' },
    { id: 'BUL-009', status: 'בטיפול', subject: 'חיקויים מלעיגים', location: 'כיתה ז\'3', description: 'קבוצת תלמידות מחקה בצורה מוגזמת ומלעיגה את אופן הדיבור של תלמידה שיש לה גמגום קל, בכל פעם שהיא מנסה לענות על שאלה במהלך השיעור.', date: '24.11.2025 12:00' },
    { id: 'BUL-010', status: 'חדש', subject: 'הסתרה/גניבת ציוד', location: 'כיתת לימוד', description: 'בסוף יום הלימודים, תלמיד גילה שהקלמר והספרים שלו הוחבאו בתוך פח האשפה הכיתתי לאחר שנשפכו עליהם שאריות מזון במכוון.', date: '10.11.2025 15:30' }
];

const AdminPage = () => { 
    const [allReports, setAllReports] = useState(mockReports); 
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showArchive, setShowArchive] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [reportIdToArchive, setReportIdToArchive] = useState(null);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filterReports = (status) => {
        setActiveFilter(status);
        setShowArchive(false); 
    };

    const handleOpenConfirm = (id) => {
        setReportIdToArchive(id);
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setReportIdToArchive(null);
    };

    const handleConfirmArchive = () => {
        const updatedReports = allReports.map(report => 
            report.id === reportIdToArchive ? { ...report, status: 'ארכיון' } : report
        );
        setAllReports(updatedReports);
        handleCloseConfirm();
    };

    const handleUpdateStatus = (id, newStatus) => {
        const updatedReports = allReports.map(report => 
            report.id === id ? { ...report, status: newStatus } : report
        );
        setAllReports(updatedReports);
        if (selectedReport?.id === id) {
            setSelectedReport(prev => ({ ...prev, status: newStatus }));
        }
    };

    const handleOpenModal = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const reportsToShow = allReports.filter(report => {
        const matchesSearch = report.id.toLowerCase().includes(searchTerm) || 
                             report.subject.toLowerCase().includes(searchTerm);
        const matchesStatus = activeFilter === 'all' ? true : report.status === activeFilter;
        const isArchiveView = showArchive ? report.status === 'ארכיון' : report.status !== 'ארכיון';
        return matchesSearch && matchesStatus && isArchiveView;
    });

    const activeReports = allReports.filter(r => r.status !== 'ארכיון');
    const newCount = activeReports.filter(r => r.status === 'חדש').length; 
    const urgentCount = activeReports.filter(r => r.status === 'קריטי').length; 
    const inProcessCount = activeReports.filter(r => r.status === 'בטיפול').length;

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
            <ReportsTable reports={reportsToShow} onArchive={handleOpenConfirm} onView={handleOpenModal} />
            <ReportModal open={isModalOpen} report={selectedReport} onClose={handleCloseModal} onUpdateStatus={handleUpdateStatus} />
            <Dialog open={confirmOpen} onClose={handleCloseConfirm} dir="rtl">
                <DialogTitle>אישור העברה לארכיון</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        שימי לב: ברגע שהדיווח יועבר לארכיון, לא ניתן יהיה להחזיר אותו לטבלה הפעילה.
                        האם הטיפול בדיווח <strong>{reportIdToArchive}</strong> הסתיים ואת בטוחה שברצונך להמשיך?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{padding: '15px'}}>
                    <Button onClick={handleCloseConfirm} color="primary" variant="outlined">ביטול</Button>
                    <Button onClick={handleConfirmArchive} color="error" variant="contained">כן, העבר לארכיון</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AdminPage;
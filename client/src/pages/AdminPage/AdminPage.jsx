import LogoutButton from '../../components/LogoutButton/LogoutButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import styles from './AdminPage.module.css'; 
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';
import { useState } from 'react'; 
import { FiSearch } from "react-icons/fi"; 
import InventoryIcon from '@mui/icons-material/Inventory';
import ReportModal from '../../components/ReportModal/ReportModal';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, CircularProgress } from '@mui/material';
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'; 
import api from '../../services/api'; 

const fetchReports = async () => {
    const response = await api.get('/api/reports'); 
    return response.data; 
};

const AdminPage = () => { 
    const queryClient = useQueryClient();
    const { data: cloudReports, isLoading, isError } = useQuery({
        queryKey: ['reports'], 
        queryFn: fetchReports,
        refetchInterval: 10000, 
        refetchOnWindowFocus: true
    });

    const updateReportMutation = useMutation({
        mutationFn: async ({ id, updates }) => {
            return await api.patch(`/api/reports/${id}`, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['reports']);
        },
        onError: () => {
            alert("לא ניתן היה לעדכן את הדיווח כרגע. אנא נסי שוב.");
        }
    });

    const rawReports = cloudReports || []; 
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

    const handleUpdateStatus = (id, newStatus) => {
        updateReportMutation.mutate({ id, updates: { status: newStatus } });
        if (selectedReport?._id === id) {
            setSelectedReport(prev => ({ ...prev, status: newStatus }));
        }
    };

    const handleConfirmArchive = () => {
        updateReportMutation.mutate({ id: reportIdToArchive, updates: { status: 'ארכיון' } });
        handleCloseConfirm();
    };
    const handleOpenModal = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);

        if (!report.isViewed) {
            updateReportMutation.mutate({ 
                id: report._id, 
                updates: { isViewed: true } 
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const reportsToShow = rawReports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            (report.trackingCode?.toLowerCase().includes(searchLower) || false) || 
            (report.subject?.toLowerCase().includes(searchLower) || false);

        const matchesStatus = activeFilter === 'all' ? true : report.status === activeFilter;
        const isArchiveView = showArchive ? report.status === 'ארכיון' : report.status !== 'ארכיון';
        
        return matchesSearch && matchesStatus && isArchiveView;
    });

    const activeReports = rawReports.filter(r => r.status !== 'ארכיון');
    const newCount = activeReports.filter(r => r.status === 'חדש').length; 
    const urgentCount = activeReports.filter(r => r.status === 'קריטי').length; 
    const inProcessCount = activeReports.filter(r => r.status === 'בטיפול').length;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <CircularProgress color="inherit" />
                <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>טוען נתונים, נא להמתין...</p>
            </Box>
        );
    }

    if (isError) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>חלה שגיאה בטעינת הדיווחים</h2>
                <p>אנא ודאי שחיבור האינטרנט תקין ונסי לרענן את הדף.</p>
                <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2, backgroundColor: 'black' }}>
                    רענון דף
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            <div className={styles.headerRow}>
                <LogoutButton />
                <h1>מערכת ניהול דיווחים</h1>
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

            <ReportsTable 
                reports={reportsToShow} 
                onArchive={handleOpenConfirm} 
                onView={handleOpenModal} 
            />

            <ReportModal 
                open={isModalOpen} 
                report={selectedReport} 
                onClose={handleCloseModal} 
                onUpdateStatus={handleUpdateStatus} 
            />

            <Dialog open={confirmOpen} onClose={handleCloseConfirm} dir="rtl">
                <DialogTitle>אישור העברה לארכיון</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        האם הטיפול בדיווח הסתיים ואת בטוחה שברצונך להעביר אותו לארכיון?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{padding: '15px'}}>
                    <Button onClick={handleCloseConfirm} color="primary" variant="outlined">ביטול</Button>
                    <Button onClick={handleConfirmArchive} color="error" variant="contained">כן, העבר</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AdminPage;
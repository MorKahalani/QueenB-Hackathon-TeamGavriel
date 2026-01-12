import ExportButton from '../../components/ExportButton/ExportButton';
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';
import { useState } from 'react'; 
import { FiSearch } from "react-icons/fi"; 
import TaskAltIcon from '@mui/icons-material/TaskAlt'; 
import ReportModal from '../../components/ReportModal/ReportModal';
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, Box, CircularProgress, Typography, Paper, 
  FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Chip 
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import api from '../../services/api'; 

const subjectTranslations = {
  'self-harm': 'פגיעה עצמית',
  'bullying': 'בריונות או חרם',
  'violence': 'אלימות או איומים',
  'media': 'הפצת תמונות',
  'other': 'אחר'
};

const fetchReports = async () => {
    const response = await api.get('/api/reports'); 
    return response.data; 
};

const AdminPage = () => { 
    const queryClient = useQueryClient();
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showArchive, setShowArchive] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [reportIdToArchive, setReportIdToArchive] = useState(null);

    const { data: cloudReports, isLoading, isError } = useQuery({
        queryKey: ['reports'], 
        queryFn: fetchReports,
        refetchInterval: 5000, 
        staleTime: 0, 
        refetchOnWindowFocus: true
    });

    const updateReportMutation = useMutation({
        mutationFn: async ({ id, updates }) => {
            return await api.patch(`/api/reports/${id}`, updates);
        },
        onSuccess: () => queryClient.invalidateQueries(['reports']),
    });

    const handleSearch = (event) => setSearchTerm(event.target.value.toLowerCase());
    
    const handleUpdateStatus = (id, newStatus) => {
        updateReportMutation.mutate({ id, updates: { status: newStatus } });
        if (selectedReport?._id === id) {
            setSelectedReport(prev => ({ ...prev, status: newStatus }));
        }
    };

    const handleOpenModal = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
        if (!report.isViewed) updateReportMutation.mutate({ id: report._id, updates: { isViewed: true } });
    };

    const rawReports = cloudReports || []; 

    const reportsToShow = rawReports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        const subjectHebrew = subjectTranslations[report.subject] || report.subject || '';
        
        const matchesSearch = 
            (report.trackingCode?.toLowerCase().includes(searchLower)) ||
            (subjectHebrew.toLowerCase().includes(searchLower)) ||
            (report.description?.toLowerCase().includes(searchLower)) ||
            (report.location?.toLowerCase().includes(searchLower));

        const matchesStatus = activeFilter === 'all' ? true : report.status === activeFilter;
        const isArchiveView = showArchive ? report.status === 'ארכיון' : report.status !== 'ארכיון';
        
        return matchesSearch && matchesStatus && isArchiveView;
    });

    const activeReports = rawReports.filter(r => r.status !== 'ארכיון');

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (isError) return <Typography color="error" align="center" sx={{ mt: 5 }}>שגיאה בחיבור לשרת</Typography>;

    return (
        <Box sx={{ bgcolor: '#f4f7f9', minHeight: '100vh', p: 4 }} dir="rtl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>לוח ניהול דיווחים</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <StatCard label='סה"כ דיווחים פעילים' count={activeReports.length} type="all" />
                <StatCard label="חדשים" count={activeReports.filter(r => r.status === 'חדש').length} type="new" />
                <StatCard label="בטיפול" count={activeReports.filter(r => r.status === 'בטיפול').length} type="process" />
                <StatCard label="קריטיים" count={activeReports.filter(r => r.status === 'קריטי').length} type="urgent" />
            </Box>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField 
                        placeholder="חיפוש"
                        size="small" sx={{ flexGrow: 1 }} 
                        onChange={handleSearch}
                        InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment> }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>פילטר סטטוס</InputLabel>
                        <Select value={activeFilter} label="פילטר סטטוס" onChange={(e) => setActiveFilter(e.target.value)}>
                            <MenuItem value="all">כל הסטטוסים</MenuItem>
                            <MenuItem value="חדש">חדשים</MenuItem>
                            <MenuItem value="בטיפול">בטיפול</MenuItem>
                            <MenuItem value="קריטי">קריטי</MenuItem>
                        </Select>
                    </FormControl>
                    <Button 
                        variant="outlined" 
                        color={showArchive ? "primary" : "inherit"} 
                        onClick={() => setShowArchive(!showArchive)}
                        sx={{ 
                            display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 1, borderRadius: 2,
                            borderColor: showArchive ? 'primary.main' : '#e2e8f0'
                        }}
                    >
                        <TaskAltIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {showArchive ? "חזור לדיווחים פעילים" : "דיווחים שטופלו"}
                        </Typography>
                    </Button>
                    <ExportButton data={reportsToShow} />
                </Box>
            </Paper>

            <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {showArchive ? "דיווחים שטופלו" : "דיווחים פעילים"} 
                    <Chip label={reportsToShow.length} size="small" sx={{ mr: 1, bgcolor: '#e2e8f0' }} />
                </Typography>
                <ReportsTable 
                    reports={reportsToShow} 
                    onUpdateStatus={(id, newStatus) => {
                        if (newStatus === 'ארכיון') {
                            setReportIdToArchive(id);
                            setConfirmOpen(true);
                        } else {
                            handleUpdateStatus(id, newStatus);
                        }
                    }} 
                    onView={handleOpenModal} 
                />
            </Box>

            <ReportModal 
                open={isModalOpen} report={selectedReport} 
                onClose={() => { setIsModalOpen(false); setSelectedReport(null); queryClient.invalidateQueries(['reports']); }} 
                onUpdateStatus={handleUpdateStatus} 
            />

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} dir="rtl">
                <DialogTitle sx={{ fontWeight: 'bold' }}>סיום טיפול בדיווח</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        האם את בטוחה שסיימת לטפל בדיווח? הוא יעבור כעת לתיבת הדיווחים שטופלו.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setConfirmOpen(false)} color="inherit">ביטול</Button>
                    <Button 
                        onClick={() => { 
                            handleUpdateStatus(reportIdToArchive, 'ארכיון'); 
                            setConfirmOpen(false); 
                        }} 
                        color="success" 
                        variant="contained"
                    >
                        כן, סיום טיפול
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage;
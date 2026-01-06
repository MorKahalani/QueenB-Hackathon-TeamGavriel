//import LogoutButton from '../../components/LogoutButton/LogoutButton';
import ExportButton from '../../components/ExportButton/ExportButton';
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import StatCard from '../../components/StatCard/StatCard';
import { useState } from 'react'; 
import { FiSearch } from "react-icons/fi"; 
import InventoryIcon from '@mui/icons-material/Inventory';
import ReportModal from '../../components/ReportModal/ReportModal';
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, Box, CircularProgress, Typography, Paper, 
  FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Chip 
} from '@mui/material';
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'; 
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
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>לוח ניהול דיווחים</Typography>
                </Box>
                {/* <LogoutButton /> */}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <StatCard label='סה"כ דיווחים' count={activeReports.length} type="all" />
                <StatCard label="חדשים" count={activeReports.filter(r => r.status === 'חדש').length} type="new" />
                <StatCard label="בטיפול" count={activeReports.filter(r => r.status === 'בטיפול').length} type="process" />
                <StatCard label="חומרה גבוהה" count={activeReports.filter(r => r.status === 'קריטי').length} type="urgent" />
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
                        <InputLabel>כל הסטטוסים</InputLabel>
                        <Select value={activeFilter} label="כל הסטטוסים" onChange={(e) => setActiveFilter(e.target.value)}>
                            <MenuItem value="all">כל הסטטוסים</MenuItem>
                            <MenuItem value="חדש">חדשים</MenuItem>
                            <MenuItem value="בטיפול">בטיפול</MenuItem>
                            <MenuItem value="קריטי">קריטי</MenuItem>
                            <MenuItem value="טופל">טופלו</MenuItem>
                        </Select>
                    </FormControl>
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        onClick={() => setShowArchive(!showArchive)}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            borderColor: '#e2e8f0',
                            '&:hover': { bgcolor: '#f8fafc' }
                        }}
                    >
                        <InventoryIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {showArchive ? "חזור" : "ארכיון"}
                        </Typography>
                    </Button>
                    <ExportButton data={reportsToShow} />
                </Box>
            </Paper>

            <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    דיווחים 
                    <Chip label={reportsToShow.length} size="small" sx={{ mr: 1, bgcolor: '#e2e8f0' }} />
                </Typography>
                <ReportsTable reports={reportsToShow} onArchive={(id) => { setReportIdToArchive(id); setConfirmOpen(true); }} onView={handleOpenModal} />
            </Box>

            <ReportModal 
                open={isModalOpen} report={selectedReport} 
                onClose={() => { setIsModalOpen(false); setSelectedReport(null); queryClient.invalidateQueries(['reports']); }} 
                onUpdateStatus={handleUpdateStatus} 
            />

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} dir="rtl">
                <DialogTitle>העברה לארכיון</DialogTitle>
                <DialogContent><DialogContentText>האם את בטוחה שברצונך להעביר את הדיווח לארכיון?</DialogContentText></DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setConfirmOpen(false)}>ביטול</Button>
                    <Button onClick={() => { updateReportMutation.mutate({ id: reportIdToArchive, updates: { status: 'ארכיון' } }); setConfirmOpen(false); }} color="error" variant="contained">כן, העבר</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage;
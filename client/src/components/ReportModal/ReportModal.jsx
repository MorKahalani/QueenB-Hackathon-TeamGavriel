import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Box, Divider } from '@mui/material';
import PropTypes from 'prop-types'; 
import { useState, useEffect } from 'react'
import api from '../../services/api'; 
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CircularProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const subjectTranslations = {
  'self-harm': 'פגיעה עצמית',
  'bullying': 'בריונות או חרם',
  'violence': 'אלימות או איומים',
  'media': 'הפצת תמונות',
  'other': 'אחר'
};

const ReportModal = ({ open, report, onClose, onUpdateStatus }) => {
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setAnalysis(null);
  setLoading(false);
}, [report, open]);

const handleAnalyze = async () => {
  setLoading(true);
  try {
    const response = await api.get(`/api/reports/${report._id}/analyze`);
    setAnalysis(response.data.analysis);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    alert("לא ניתן היה לנתח את הדיווח כרגע.");
  } finally {
    setLoading(false);
  }
};

  if (!report) return null;

  const isArchived = report.status === 'ארכיון';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        פרטי דיווח: {report.trackingCode}
        <Chip 
          label={report.status} 
          color={report.status === 'קריטי' ? 'error' : report.status === 'בטיפול' ? 'primary' : 'success'} 
          variant="contained" 
        />
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary">נושא:</Typography>
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
            {subjectTranslations[report.subject] || report.subject}
          </Typography>
        </Box>

        {report.location && (
          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">מיקום האירוע:</Typography>
            <Typography variant="body1">{report.location}</Typography>
          </Box>
        )}

        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary">תאריך דיווח:</Typography>
          <Typography variant="body1">
            {report.createdAt ? new Date(report.createdAt).toLocaleString('he-IL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : 'אין תאריך'}
          </Typography>
        </Box>

        <Box mb={2} p={2} bgcolor="#f5f5f5" borderRadius={2}>
          <Typography variant="subtitle2" color="textSecondary">תיאור המקרה המלא:</Typography>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {report.description}
          </Typography>
        </Box>

        <Box mb={3} p={2} sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 2, 
            background: 'linear-gradient(to right, #f9f9ff, #ffffff)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon color="secondary" fontSize="small" />
              ניתוח חכם והמלצות (AI)
            </Typography>
            
            {!analysis && !loading && (
              <Button 
                size="small" 
                variant="contained" 
                color="secondary" 
                onClick={handleAnalyze}
                startIcon={<AutoAwesomeIcon />}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                נתח דיווח
              </Button>
            )}
          </Box>

          {loading && (
            <Box display="flex" alignItems="center" gap={2} p={1}>
              <CircularProgress size={20} color="secondary" />
              <Typography variant="body2" color="textSecondary">היועץ הדיגיטלי מנתח את המקרה...</Typography>
            </Box>
          )}

          {analysis && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: '#f0f4ff', 
              borderRadius: '12px', 
              borderRight: '5px solid #6200ea', 
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  whiteSpace: 'pre-wrap', 
                  color: '#333', 
                  lineHeight: 1.8, 
                  fontWeight: 500,
                  fontFamily: 'Segoe UI, Roboto, sans-serif' 
                }}
              >
                {analysis}
              </Typography>
            </Box>
          )}
        </Box>

        {report.files && report.files.length > 0 && (
          <Box mb={2} mt={3}> 
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'rgba(0, 0, 0, 0.85)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 1.5 
              }}
            >
              <AttachFileIcon sx={{ transform: 'rotate(45deg)', color: 'action.active' }} /> 
              קבצים והוכחות מצורפים:
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 1.5, 
              flexWrap: 'wrap',
              p: 1.5,
              bgcolor: '#fafafa', 
              borderRadius: 2,
              border: '1px dashed #ccc' 
            }}>
              {report.files.map((file, index) => (
                <Box 
                  key={index}
                  component="img"
                  src={file.startsWith('http') ? file : `http://localhost:5000/${file.replace(/^\//, '')}`}
                  alt={`קובץ מצורף ${index + 1}`}
                  sx={{
                    width: 130, 
                    height: 130,
                    objectFit: 'cover',
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                    '&:hover': { transform: 'scale(1.05)', transition: '0.2s' } 
                  }}
                  onClick={() => {
                    const cleanPath = file.startsWith('http') ? file : `http://localhost:5000/${file.replace(/^\//, '')}`;
                    window.open(cleanPath, '_blank');
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions style={{ justifyContent: 'space-between', padding: '16px' }}>
        <Box>
          {!isArchived ? (
            <>
              <Typography variant="caption" display="block" gutterBottom>
                שנה סטטוס ל:
              </Typography>
              <Button 
                size="small" 
                variant="outlined" 
                color="primary" 
                onClick={() => onUpdateStatus(report._id, 'בטיפול')}
                style={{ marginLeft: '8px' }}
              >
                בטיפול
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error" 
                onClick={() => onUpdateStatus(report._id, 'קריטי')}
                style={{ marginLeft: '8px' }}
              >
                קריטי
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="success" 
                onClick={() => onUpdateStatus(report._id, 'טופל')}
              >
                טופל
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
              הטיפול באירוע זה הסתיים והוא הועבר לארכיון.
            </Typography>
          )}
        </Box>
        
        <Button onClick={onClose} variant="contained" color="inherit">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReportModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  report: PropTypes.object
};

export default ReportModal;
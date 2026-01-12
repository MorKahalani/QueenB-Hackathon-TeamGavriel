import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Box, Paper } from '@mui/material';
import PropTypes from 'prop-types'; 
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';

const subjectTranslations = {
  'self-harm': 'פגיעה עצמית',
  'bullying': 'בריונות או חרם',
  'violence': 'אלימות או איומים',
  'media': 'הפצת תמונות',
  'other': 'אחר'
};

const ReportModal = ({ open, report, onClose, onUpdateStatus }) => {
  if (!report) return null;

  const isArchived = report.status === 'ארכיון';

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm" 
      dir="rtl"
      PaperProps={{
        sx: { borderRadius: 4, px: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
        דיווח {report.trackingCode}
        <Chip 
          label={report.status} 
          color={report.status === 'קריטי' ? 'error' : report.status === 'בטיפול' ? 'primary' : 'success'} 
          sx={{ fontWeight: 'bold', borderRadius: 1.5, px: 1 }}
        />
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>נושא</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {subjectTranslations[report.subject] || report.subject}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>תאריך</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
              <Typography variant="body2">
                {report.createdAt ? new Date(report.createdAt).toLocaleDateString('he-IL') : '---'}
              </Typography>
            </Box>
          </Box>
          {report.location && (
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>מיקום</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PlaceIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                <Typography variant="body2">{report.location}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>תיאור המקרה</Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: '#fcfcfc', borderRadius: 2, border: '1px solid #eee' }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#4a5568', lineHeight: 1.6 }}>
            {report.description}
          </Typography>
        </Paper>

        <Box sx={{ 
            p: 3, 
            bgcolor: '#f4f7ff', 
            borderRadius: 4, 
            borderRight: '6px solid #6366f1', 
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)'
          }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2d3748', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AutoAwesomeIcon sx={{ color: '#6366f1', fontSize: '1.2rem' }} />
            המלצות למורה:
          </Typography>

          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#4a5568', lineHeight: 1.8, fontWeight: 500, fontSize: '0.95rem' }}>
            {report.analysis}
          </Typography>
        </Box>

        {report.files && report.files.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AttachFileIcon sx={{ fontSize: '1rem', transform: 'rotate(45deg)' }} />
              קבצים מצורפים
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {report.files.map((file, index) => (
                <Box 
                  key={index} component="img"
                  src={file.startsWith('http') ? file : `http://localhost:5000/${file.replace(/^\//, '')}`}
                  sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, cursor: 'pointer', border: '1px solid #edf2f7' }}
                  onClick={() => window.open(file.startsWith('http') ? file : `http://localhost:5000/${file.replace(/^\//, '')}`, '_blank')}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#fcfcfc', borderTop: '1px solid #eee', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {!isArchived ? (
            <>
              <Button size="small" variant={report.status === 'בטיפול' ? 'contained' : 'outlined'} color="primary" onClick={() => onUpdateStatus(report._id, 'בטיפול')} sx={{ borderRadius: 2 }}>
                בטיפול
              </Button>
              <Button size="small" variant={report.status === 'קריטי' ? 'contained' : 'outlined'} color="error" onClick={() => onUpdateStatus(report._id, 'קריטי')} sx={{ borderRadius: 2 }}>
                קריטי
              </Button>
              <Button size="small" variant={report.status === 'טופל' ? 'contained' : 'outlined'} color="success" onClick={() => onUpdateStatus(report._id, 'טופל')} sx={{ borderRadius: 2 }}>
                טופל
              </Button>
            </>
          ) : (
            <Typography variant="caption" color="textSecondary">דיווח זה הועבר לארכיון</Typography>
          )}
        </Box>
        <Button onClick={onClose} variant="text" sx={{ fontWeight: 'bold', color: '#718096' }}>סגירה</Button>
      </DialogActions>
    </Dialog>
  );
};

ReportModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  report: PropTypes.shape({
    _id: PropTypes.string,
    trackingCode: PropTypes.string,
    status: PropTypes.string,
    subject: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    analysis: PropTypes.string,
    createdAt: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.string)
  })
};

export default ReportModal;
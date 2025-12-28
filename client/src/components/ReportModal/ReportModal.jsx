import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Box, Divider } from '@mui/material';
import PropTypes from 'prop-types'; 

const ReportModal = ({ open, report, onClose,onUpdateStatus }) => {
  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        פרטי דיווח: {report.id}
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
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>{report.subject}</Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary">מיקום האירוע:</Typography>
          <Typography variant="body1">{report.location}</Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary">תאריך וזמן דיווח:</Typography>
          <Typography variant="body1">{report.date}</Typography>
        </Box>

        <Box mb={2} p={2} bgcolor="#f5f5f5" borderRadius={2}>
          <Typography variant="subtitle2" color="textSecondary">תיאור המקרה המלא:</Typography>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {report.description}
          </Typography>
        </Box>
      </DialogContent>

        <DialogActions style={{ justifyContent: 'space-between', padding: '16px' }}>
        <Box>
            <Typography variant="caption" display="block" gutterBottom>
            שנה סטטוס ל:
            </Typography>
            <Button 
            size="small" 
            variant="outlined" 
            color="primary" 
            onClick={() => onUpdateStatus(report.id, 'בטיפול')}
            style={{ marginLeft: '8px' }}
            >
            בטיפול
            </Button>
            <Button 
            size="small" 
            variant="outlined" 
            color="error" 
            onClick={() => onUpdateStatus(report.id, 'קריטי')}
            style={{ marginLeft: '8px' }}
            >
            קריטי
            </Button>
            <Button 
            size="small" 
            variant="outlined" 
            color="success" 
            onClick={() => onUpdateStatus(report.id, 'טופל')}
            >
            טופל
            </Button>
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
  report: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    subject: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default ReportModal;
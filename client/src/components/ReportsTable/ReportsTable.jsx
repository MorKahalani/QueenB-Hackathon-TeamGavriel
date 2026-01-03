import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import styles from './ReportsTable.module.css';
import PropTypes from 'prop-types'; 
import InventoryIcon from '@mui/icons-material/Inventory';
 
const subjectTranslations = {
  'self-harm': 'פגיעה עצמית',
  'bullying': 'בריונות או חרם',
  'violence':'אלימות או איומים',
  'media': 'הפצת תמונות',
  'other':'אחר'
};
const ReportsTable = ({ reports, onArchive, onView }) => {
  return (
    <TableContainer component={Paper} className={styles.tableWrapper}>
      <Table dir="rtl">
        <TableHead className={styles.tableHeader}>
          <TableRow>
            <TableCell align="right">סטטוס</TableCell>
            <TableCell align="right">קוד דיווח</TableCell>
            <TableCell align="right">נושא</TableCell>
            <TableCell align="right">מיקום</TableCell>
            <TableCell align="right">תיאור</TableCell>
            <TableCell align="right">התקבל ב:</TableCell>
            <TableCell align="right">פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" style={{padding:'20px'}}>
                אין עדיין דיווחים במערכת
              </TableCell>
            </TableRow>
          ) : (
          reports.map((report) => (
            <TableRow key={report._id} hover> 
              <TableCell align="right">
                <Chip 
                  label={report.status} 
                  color={report.status === 'קריטי' ? 'error' : report.status === 'בטיפול' ? 'primary' : 'success'} 
                  variant="outlined" 
                />
              </TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>
                {report.trackingCode}
              </TableCell> 
              <TableCell align="right">{subjectTranslations[report.subject] || report.subject} </TableCell>
              <TableCell align="right">{report.location}</TableCell>
              <TableCell align="right" style={{ maxWidth: '200px' }}>
                  {report.description && report.description.length > 15 ? `${report.description.substring(0, 15)}...` : report.description}
              </TableCell>
              <TableCell align="right">
                {report.createdAt ? new Date(report.createdAt).toLocaleString('he-IL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : ''}
              </TableCell>
              <TableCell align="right">
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <Button variant="contained" size="small" className={styles.viewBtn} onClick={() => onView(report)}>
                    צפייה
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => onArchive(report._id)} 
                    style={{ minWidth: 'auto', padding: '6px' }}
                  >
                    <InventoryIcon/>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ReportsTable.propTypes = {
  reports: PropTypes.array.isRequired,
  onArchive: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default ReportsTable;
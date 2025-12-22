import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import styles from './ReportsTable.module.css';

const mockReports = [
  { id: 'ABC-123', status: 'קריטי', subject: 'חרם בוואטסאפ', date: '20.11.2025 11:35' },
  { id: 'DEF-456', status: 'בטיפול', subject: 'אלימות מילולית', date: '21.11.2025 09:00' },
  { id: 'GHI-789', status: 'הסתיים', subject: 'שימוש בשפה לא נאותה', date: '18.11.2025 14:20' },
];

const ReportsTable = () => {
  return (
    <TableContainer component={Paper} className={styles.tableWrapper}>
      <Table dir="rtl">
        <TableHead className={styles.tableHeader}>
          <TableRow>
            <TableCell align="right">סטטוס</TableCell>
            <TableCell align="right">קוד דיווח</TableCell>
            <TableCell align="right">נושא</TableCell>
            <TableCell align="right">התקבל ב:</TableCell>
            <TableCell align="right">פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockReports.map((report) => (
            <TableRow key={report.id} hover>
              <TableCell align="right">
                <Chip 
                  label={report.status} 
                  color={report.status === 'קריטי' ? 'error' : report.status === 'בטיפול' ? 'primary' : 'success'} 
                  variant="outlined" 
                />
              </TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>{report.id}</TableCell>
              <TableCell align="right">{report.subject}</TableCell>
              <TableCell align="right">{report.date}</TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small" className={styles.viewBtn}>
                  צפייה
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


export default ReportsTable;
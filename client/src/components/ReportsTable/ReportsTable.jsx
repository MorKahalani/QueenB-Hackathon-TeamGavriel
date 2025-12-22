import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import styles from './ReportsTable.module.css';
import PropTypes from 'prop-types'; 

const ReportsTable = ({reports}) => {
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
              <TableCell align="right">{report.location}</TableCell>
              <TableCell align="right" style={{ maxWidth: '200px',whiteSpace: 'nowrap', overflow: 'hidden',
                textOverflow: 'ellipsis' }}>{report.description}</TableCell>
              <TableCell align="right">{report.date}</TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small" className={styles.viewBtn}>
                  צפייה
                </Button>
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
  reports:PropTypes.array.isRequired,
};

export default ReportsTable;
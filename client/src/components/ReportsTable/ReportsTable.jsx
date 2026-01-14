import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Box, Typography, IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

const subjectTranslations = {
  'self-harm': 'פגיעה עצמית',
  'bullying': 'בריונות או חרם',
  'violence': 'אלימות או איומים',
  'media': 'הפצת תמונות',
  'other': 'אחר'
};

const ReportsTable = ({ reports, onUpdateStatus, onView }) => {
  const safeReports = reports || [];

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #edf2f7',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}
    >
      <Table dir="rtl">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#4a5568', py: 2 }}>סטטוס</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#4a5568' }}>קוד דיווח</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#4a5568' }}>נושא</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#4a5568' }}>מיקום</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#4a5568' }}>תיאור</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#4a5568' }}>התקבל ב:</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#4a5568' }}>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {safeReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  אין עדיין דיווחים התואמים את הסינון שנבחר
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            safeReports.map((report) => {
              const isHandled = report.status === 'ארכיון';

              return (
                <TableRow
                  key={report._id}
                  hover
                  sx={{
                    bgcolor: !report.isViewed ? '#fefce8 !important' : 'inherit',
                    transition: '0.2s',
                    '&:hover': { bgcolor: '#f1f5f9 !important' }
                  }}
                >
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!report.isViewed && (
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3182ce' }} />
                      )}
                      <Chip
                        label={report.status === 'ארכיון' ? 'טופל' : report.status}
                        size="small"
                        color={report.status === 'קריטי' ? 'error' : report.status === 'בטיפול' ? 'primary' : 'success'}
                        variant={!report.isViewed ? "filled" : "outlined"}
                        sx={{ fontWeight: 'bold', borderRadius: 1 }}
                      />
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2d3748' }}>{report.trackingCode}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{subjectTranslations[report.subject] || report.subject}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{report.location || "לא צוין מיקום"}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ maxWidth: '220px' }}>
                    <Typography variant="body2" noWrap sx={{ color: '#4a5568' }}>{report.description}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      {new Date(report.createdAt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon sx={{ ml: 1 }} />}
                        onClick={() => onView(report)}
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: '#1a2038',
                          '&:hover': { bgcolor: '#2d3748' }
                        }}
                      >
                        צפייה
                      </Button>

                      {isHandled ? (
                        <Tooltip title="החזר לטיפול פעיל">
                          <IconButton
                            onClick={() => onUpdateStatus(report._id, 'בטיפול')}
                            sx={{ color: '#3182ce', '&:hover': { bgcolor: '#ebf8ff' } }}
                          >
                            <SettingsBackupRestoreIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="סיום טיפול">
                          <IconButton
                            onClick={() => onUpdateStatus(report._id, 'ארכיון')}
                            sx={{
                              color: 'action.active', 
                              '&:hover': {
                                color: 'success.main', 
                                bgcolor: '#f0fff4'    
                              }
                            }}
                          >
                            <TaskAltIcon /> 
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ReportsTable.propTypes = {
  reports: PropTypes.array,
  onUpdateStatus: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default ReportsTable;
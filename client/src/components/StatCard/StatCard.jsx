import { Paper, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const cardConfig = {
  all: { icon: <AssignmentIcon sx={{ color: '#3182ce' }} />, bgColor: '#ebf8ff' },
  new: { icon: <NewReleasesIcon sx={{ color: '#38b2ac' }} />, bgColor: '#e6fffa' },
  urgent: { icon: <WarningAmberIcon sx={{ color: '#e53e3e' }} />, bgColor: '#fff5f5' },
  process: { icon: <AutorenewIcon sx={{ color: '#805ad5' }} />, bgColor: '#faf5ff' }
};

const StatCard = ({ label, count, type }) => {
  const config = cardConfig[type] || cardConfig.all;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, flex: 1, minWidth: '220px', borderRadius: 4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        bgcolor: 'white', border: '1px solid #edf2f7',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2d3748', mb: 0.5 }}>{count}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#718096', fontSize: '0.85rem' }}>{label}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 3, bgcolor: config.bgColor }}>
        {config.icon}
      </Box>
    </Paper>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  type: PropTypes.string
};

export default StatCard;
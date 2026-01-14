import { Container, Typography, Paper } from '@mui/material';
import {useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CodeTrackingBox from '../../components/CodeTrackingBox/CodeTrackingBox';

const StudentConfirmationPage = () => {
    const location = useLocation();
    const trackingCode = location.state?.trackingCode;

    return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
            <Paper elevation={3} sx={{ p: 5, borderRadius: 2 }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 90, mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ fontSize: 40}}>
                    !הדיווח נשלח בהצלחה
                </Typography>
                <Typography variant="h4" color="text.secondary" sx={{ fontSize: 20 ,mb: 4 }}>
                    המידע הועבר למורה באופן אנונימי ובטוח<br />
                    תודה על השיתוף
                </Typography>
                <CodeTrackingBox 
                code={trackingCode}
                title="זהו קוד המעקב האישי שלך"
                explanation="יש לשמור את הקוד כדי לצפות בתשובת המורה בהמשך"
                />
                <br />
            </Paper>
        </Container>
    );
};

export default StudentConfirmationPage;
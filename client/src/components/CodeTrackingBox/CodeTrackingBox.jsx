import { useState } from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PropTypes from 'prop-types';

const CodeTrackingBox = ({ code, title, explanation }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{ 
        mt: 4, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'}}>
            {title && (
                <Typography variant="h4" color="text.secondary" sx={{ fontSize: 20 , mb: 1, textAlign: 'right' }}>
                    {title}
                </Typography>
            )}
            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9' }}>
                <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {code}
                </Typography>
                <Tooltip title={copied ? "הועתק!" : "העתק קוד"}>
                    <IconButton onClick={handleCopy}>
                        {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                    </IconButton>
                </Tooltip>
            </Paper>
            {explanation && (
                <Typography variant="h4" color="text.secondary" sx={{fontSize: 15, mb: 1, textAlign: 'right' }}>
                    {explanation}
                </Typography>
            )}
        </Box>
    );
};
CodeTrackingBox.propTypes = {
    code: PropTypes.string.isRequired,
    explanation: PropTypes.string,
    title: PropTypes.string
};

export default CodeTrackingBox;
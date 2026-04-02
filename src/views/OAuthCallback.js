import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function OAuthCallback() {
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const error = params.get('error');

        if (error) {
            history.replace('/login?error=' + error);
            return;
        }

        if (id) {
            sessionStorage.setItem('id', id);
            history.replace('/home');
        } else {
            history.replace('/login?error=missing_id');
        }
    }, [history, location]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <CircularProgress />
            <Typography variant="body1" style={{ marginTop: 16 }}>
                Signing you in...
            </Typography>
        </Box>
    );
}

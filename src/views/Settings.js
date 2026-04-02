import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Paper,
    Typography,
    Button,
    Divider,
    Box,
    CircularProgress,
    Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import Header from '../components/Header/Header';
import API from '../components/api';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[100],
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(4),
        marginBottom: theme.spacing(3),
    },
    sectionTitle: {
        marginBottom: theme.spacing(2),
        fontWeight: 600,
    },
    profileRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1),
    },
    label: {
        color: theme.palette.text.secondary,
    },
    googleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2),
    },
    googleInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    connectedIcon: {
        color: theme.palette.success.main,
    },
    connectButton: {
        backgroundColor: '#fff',
        color: '#757575',
        border: '1px solid #ddd',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    disconnectButton: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main,
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Settings() {
    const classes = useStyles();
    const location = useLocation();

    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unlinking, setUnlinking] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchTrainerProfile();

        // Handle redirect messages from OAuth callback
        const params = new URLSearchParams(location.search);
        if (params.get('linked') === 'true') {
            showSnackbar('Google account connected successfully!', 'success');
        } else if (params.get('error') === 'google_already_linked') {
            showSnackbar('This Google account is already linked to another profile.', 'error');
        } else if (params.get('error') === 'google_link_failed' || params.get('error') === 'link_failed') {
            showSnackbar('Failed to connect Google account. Please try again.', 'error');
        } else if (params.get('error') === 'session_expired') {
            showSnackbar('Session expired. Please log in again.', 'error');
        }
    }, [location.search]);

    const fetchTrainerProfile = () => {
        setLoading(true);
        API.get('/api/settings/trainer')
            .then(res => {
                setTrainer(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleConnectGoogle = () => {
        window.location.href = 'http://localhost:3005/api/auth/google/link';
    };

    const handleUnlinkGoogle = () => {
        setUnlinking(true);
        API.post('/api/auth/google/unlink')
            .then(() => {
                showSnackbar('Google account disconnected.', 'success');
                fetchTrainerProfile();
            })
            .catch(() => {
                showSnackbar('Failed to disconnect Google account.', 'error');
            })
            .finally(() => setUnlinking(false));
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <div className={classes.root}>
            <Header />
            <Container maxWidth="sm" className={classes.container}>

                {/* Profile Info */}
                <Paper className={classes.paper}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        Profile
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={3}>
                            <CircularProgress />
                        </Box>
                    ) : trainer ? (
                        <>
                            <div className={classes.profileRow}>
                                <Typography className={classes.label}>Name</Typography>
                                <Typography>{trainer.firstname} {trainer.lastname}</Typography>
                            </div>
                            <div className={classes.profileRow}>
                                <Typography className={classes.label}>NIC</Typography>
                                <Typography>{trainer.nic}</Typography>
                            </div>
                            <div className={classes.profileRow}>
                                <Typography className={classes.label}>Phone</Typography>
                                <Typography>{trainer.telno}</Typography>
                            </div>
                            <div className={classes.profileRow}>
                                <Typography className={classes.label}>Workplace</Typography>
                                <Typography>{trainer.workplace}</Typography>
                            </div>
                        </>
                    ) : (
                        <Typography color="error">Could not load profile.</Typography>
                    )}
                </Paper>

                {/* Google Account */}
                <Paper className={classes.paper}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        Connected Accounts
                    </Typography>
                    <Divider />
                    <div className={classes.googleRow}>
                        <div className={classes.googleInfo}>
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                style={{ width: 24, height: 24 }}
                            />
                            <div>
                                <Typography variant="body1">Google</Typography>
                                {trainer && trainer.googleConnected && trainer.email && (
                                    <Typography variant="caption" color="textSecondary">
                                        {trainer.email}
                                    </Typography>
                                )}
                            </div>
                            {trainer && trainer.googleConnected && (
                                <CheckCircleIcon className={classes.connectedIcon} fontSize="small" />
                            )}
                        </div>

                        {loading ? (
                            <CircularProgress size={24} />
                        ) : trainer && trainer.googleConnected ? (
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.disconnectButton}
                                startIcon={<LinkOffIcon />}
                                onClick={handleUnlinkGoogle}
                                disabled={unlinking}
                            >
                                {unlinking ? 'Disconnecting...' : 'Disconnect'}
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.connectButton}
                                startIcon={
                                    <img
                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                        alt="Google"
                                        style={{ width: 16, height: 16 }}
                                    />
                                }
                                onClick={handleConnectGoogle}
                            >
                                Connect
                            </Button>
                        )}
                    </div>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

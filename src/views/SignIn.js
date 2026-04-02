import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import API from "../components/api";
import {confirmAlert} from "react-confirm-alert";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Lime Tree
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url("https://i01.appmifile.com/webfile/globalimg/mi-band-5/Lark20200707-153706.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    googleButton: {
        margin: theme.spacing(0, 0, 2),
        backgroundColor: '#fff',
        color: '#757575',
        border: '1px solid #ddd',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(1, 0),
        '& hr': {
            flexGrow: 1,
            border: 'none',
            borderTop: '1px solid #ddd',
        },
        '& span': {
            padding: theme.spacing(0, 1),
            color: '#757575',
            fontSize: '0.85rem',
        },
    },
}));

export default function SignInView() {
    const classes = useStyles();
    const history = useHistory();
    const { register, handleSubmit } = useForm();

    const [textInput, setTextInput] = useState({
        nic: "",
        password:""
    });

    const onSubmit = () => {
        let nic = textInput.nic;
        let pwd = textInput.password;

        API.post("/api/loginTrainer",{username:nic, password: pwd})
            .then(res=>{
                if(res.status==200){
                    // Token is now stored in httpOnly cookie automatically
                    // No need to store it in sessionStorage/localStorage
                    sessionStorage.setItem("id",res.data.id);
                    history.push("/home");
                    
                }else{
                    confirmAlert({
                        title: 'Login Error',
                        message: 'Your entered email address is not registered.',
                        buttons: [
                            {
                                label: 'Ok'
                            }
                        ]
                    });
                }
            }).catch(err=>{
                confirmAlert({
                    title: 'Login Error',
                    message: 'Your entered email address is not registered.',
                    buttons: [
                        {
                            label: 'Ok'
                        }
                    ]
                });
            });
    };
    const goToRegister=()=>{
        history.push("/register");
    }
    const handleTextInputChange = event => {
        const {name, value} = event.target;
        setTextInput((prev)=>{
            if(name==="nic")
            {
                return(
                    {
                        nic: value,
                        password:prev.password
                    }
                )
            }
            else if(name==="password")
            {
                return(
                    {
                        nic: prev.nic,
                        password:value,
                    }
                )
            }
        })
    };
    return (
        <div>
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={8} className={classes.image} />
                <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} >
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="nic"
                                label="NIC"
                                name="nic"
                                autoComplete="nic"
                                autoFocus
                                onChange={handleTextInputChange}
                                value={textInput.nic}
                            />
                            <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleTextInputChange}
                                value={textInput.password}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                            <div className={classes.divider}>
                                <hr /><span>OR</span><hr />
                            </div>
                            <Button
                                fullWidth
                                variant="outlined"
                                className={classes.googleButton}
                                onClick={() => { window.location.href = 'http://localhost:3005/api/auth/google'; }}
                                startIcon={
                                    <img
                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                        alt="Google"
                                        style={{ width: 18, height: 18 }}
                                    />
                                }
                            >
                                Sign in with Google
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link onClick={goToRegister} variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Box mt={5}>
                                <Copyright />
                            </Box>
                        </form>
                    </div>
                </Grid>
            </Grid>
        </div>

    );
}
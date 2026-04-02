import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from "react-hook-form";
import uniqueID from "uniqid";
import API from "../components/api";
import { confirmAlert } from "react-confirm-alert";
import { useHistory } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {

    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUpView() {
    const classes = useStyles();
    const history = useHistory();
    const { register, handleSubmit } = useForm();
    const [errors, setErrors] = useState([]);

    const [textInput, setTextInput] = useState({
        fname: "",
        lname: "",
        nic: "",
        password: "",
        address: ""
    });

    const onSubmit = () => {
        setErrors([]);
        textInput.status = "Active";
        textInput.tel = "0000000000";
        textInput.workplace = "ABC Ltd";
        textInput.gender = "Male";

        API.post("/api/registerTrainer", textInput)
            .then((res) => {
                confirmAlert({
                    title: 'Registered Successfully',
                    message: 'You have successfully registered',
                    buttons: [{ label: 'Ok' }]
                });
            })
            .catch((err) => {
                const data = err.response?.data;
                if (data?.details && Array.isArray(data.details)) {
                    setErrors(data.details.map((d) => d.msg));
                } else if (data?.error) {
                    setErrors([data.error]);
                } else {
                    setErrors(['Registration failed. Please try again.']);
                }
            });
    };

    const goToLogin = () => {
        history.push("/login");
    }

    const handleTextInputChange = event => {
        const { name, value } = event.target;
        setTextInput((prev) => {
            if (name === "fname") {
                return (
                    {
                        fname: value,
                        lname: prev.lname,
                        nic: prev.nic,
                        password: prev.password,
                        age: prev.age,
                        address: prev.address
                    }
                )
            }
            else if (name === "lname") {
                return (
                    {
                        fname: prev.fname,
                        lname: value,
                        nic: prev.nic,
                        password: prev.password,
                        age: prev.age,
                        address: prev.address
                    }
                )
            }
            else if (name === "nic") {
                return (
                    {
                        fname: prev.fname,
                        lname: prev.lname,
                        nic: value,
                        password: prev.password,
                        age: prev.age,
                        address: prev.address
                    }
                )
            }
            else if (name === "password") {
                return (
                    {
                        fname: prev.fname,
                        lname: prev.lname,
                        nic: prev.nic,
                        password: value,
                        age: prev.age,
                        address: prev.address
                    }
                )
            } else if (name === "age") {
                return (
                    {
                        fname: prev.fname,
                        lname: prev.lname,
                        nic: prev.nic,
                        password: prev.password,
                        age: value,
                        address: prev.address
                    }
                )
            }
            else if (name === "address") {
                return (
                    {
                        fname: prev.fname,
                        lname: prev.lname,
                        nic: prev.nic,
                        password: prev.password,
                        age: prev.age,
                        address: value                    
                    }
                )
            }
        })
    };

    return (
        <div className="sign-up">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className="sign-up-form">
                    <Avatar className={classes.avatar}>
                        <LockOpenIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="fname"
                                    variant="filled"
                                    required
                                    fullWidth
                                    id="fname"
                                    label="First Name"
                                    autoFocus
                                    onChange={handleTextInputChange}
                                    value={textInput.fname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="filled"
                                    required
                                    fullWidth
                                    id="lname"
                                    label="Last Name"
                                    name="lname"
                                    autoComplete="lname"
                                    onChange={handleTextInputChange}
                                    value={textInput.lname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    key="12"
                                    variant="filled"
                                    required
                                    fullWidth
                                    id="nic"
                                    label="NIC"
                                    name="nic"
                                    autoComplete="nic"
                                    onChange={handleTextInputChange}
                                    value={textInput.nic}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
                                    required
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    name="address"
                                    multiline
                                    rows={4}
                                    onChange={handleTextInputChange}
                                    value={textInput.description}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
                                    required
                                    type="number"
                                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    fullWidth
                                    id="age"
                                    label="Age"
                                    name="age"
                                    onChange={handleTextInputChange}
                                    value={textInput.price}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
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
                            </Grid>
                        </Grid>
                        {errors.length > 0 && (
                            <Box mt={2} mb={1}>
                                {errors.map((msg, i) => (
                                    <Alert key={i} severity="error" style={{ marginBottom: 6 }}>
                                        {msg}
                                    </Alert>
                                ))}
                            </Box>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link onClick={goToLogin} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        </div>
    );
}
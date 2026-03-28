import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { useLocation } from 'react-router-dom';
import API from "../../components/api";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        margin: 8
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function ChartView() {
    const location = useLocation();
    const [row, setRow] = useState([]);
    const [details, setDetails] = useState({
        fname: "",
        lname: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        nic: "",
        address: "",
        status: ""
    });
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    useEffect(() => {
        API.post("/api/getUsageByUserId", { userId: location.state.id })
            .then(res => {
                if (res.data.type == "done" && res.data.usage.length > 0) {
                    let latestUsage = res.data.usage[0];
                    let temp = latestUsage.usageData.substring(1, latestUsage.usageData.length - 1);
                    let usage = temp.split(",");

                    // Calculate time interval
                    // Assuming 'time' is something like "60s" or "1 min"
                    let timeStr = latestUsage.time || "60";
                    let totalSeconds = parseFloat(timeStr.replace(/[^\d.]/g, '')) || 60;
                    if (timeStr.toLowerCase().includes("min")) totalSeconds *= 60;

                    let interval = totalSeconds / (usage.length > 1 ? usage.length - 1 : 1);

                    let arr = usage.map((element, index) => {
                        let seconds = (index * interval).toFixed(1);
                        return {
                            name: `${seconds}s`,
                            bpm: parseFloat(element)
                        };
                    });
                    setRow(arr);
                    setSessionInfo({
                        status: latestUsage.status,
                        average: latestUsage.average,
                        time: latestUsage.time
                    });
                }
            })
            .catch(err => {
            });
        API.post("/api/getUsers", { userId: location.state.id })
            .then(res => {
                if (res.data.type == "done") {
                    setDetails({
                        fname: res.data.user.firstname,
                        lname: res.data.user.lastname,
                        age: res.data.user.age,
                        gender: res.data.user.gender,
                        height: res.data.user.height,
                        weight: res.data.user.weight,
                        nic: res.data.user.nic,
                        address: res.data.user.address,
                        status: res.data.user.status
                    });
                }
            })
            .catch(err => {
            });
    }, []);

    const [sessionInfo, setSessionInfo] = useState({
        status: "",
        average: "",
        time: ""
    });

    return (
        <div>
            <Header />
            <div className="table-header">
                <Typography variant="h6" gutterBottom>
                    Trainee Status - {details.fname} {details.lname}
                </Typography>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" align="center" style={{ marginBottom: '10px' }}>
                                Latest Training Session
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                                <Typography color="textSecondary">Condition: <b>{sessionInfo.status}</b></Typography>
                                <Typography color="textSecondary">Avg BPM: <b>{sessionInfo.average}</b></Typography>
                                <Typography color="textSecondary">Duration: <b>{sessionInfo.time}</b></Typography>
                            </div>
                            <div style={{ width: '100%', height: '400px' }}>
                                <ResponsiveContainer>
                                    <AreaChart data={row} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F9626B" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#F9626B" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" label={{ value: 'Time (s)', position: 'insideBottom', offset: -10 }} />
                                        <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="bpm" stroke="#F9626B" fillOpacity={1} fill="url(#colorUv)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Bio Data
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>NIC :</b> {details.nic}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>First Name :</b> {details.fname}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Last Name :</b> {details.lname}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Age :</b> {details.age}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Gender:</b> {details.gender}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Height :</b> {details.height == null ? "Not Found" : `${details.height} cm`}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Weight :</b> {details.weight == null ? "Not Found" : `${details.weight} kg`}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Address :</b> {details.address}
                            </Typography>
                            <Typography variant="body1" gutterBottom style={{ color: details.status === 'Active' ? 'green' : 'red' }}>
                                <b>Status :</b> {details.status}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
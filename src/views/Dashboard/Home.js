import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Typography from '@material-ui/core/Typography';
import TraineeTable from "../../components/Trainee/TraineeTable";
import API from "../../components/api";
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    TextField, 
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';
import { confirmAlert } from "react-confirm-alert";

export default function HomeView() {
    const [row, setRow] = useState([]);
    const [open, setOpen] = useState(false);
    const [traineeForm, setTraineeForm] = useState({
        nic: "",
        fname: "",
        lname: "",
        address: "",
        password: "",
        age: "",
        gender: "Male",
        height: "",
        weight: "",
        tel: "012456789",
        status: "Active"
    });

    const getTrainees = () => {
        API.post("/api/getTrainByTrainerId", { trainerId: sessionStorage.getItem("id") })
            .then(res => {
                if (res.data.type == "done") {
                    const trainees = res.data.train.map(t => ({
                        userId: t.userId,
                        trainerId: t.trainerId,
                        ...t.user
                    }));
                    setRow(trainees);
                }
            });
    };

    useEffect(() => {
        getTrainees();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTraineeForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTrainee = () => {
        // Close the modal immediately for better UX
        handleClose();

        // 1. Register User
        API.post("/api/registerUser", traineeForm)
            .then(res => {
                if (res.status === 200) {
                    const userId = res.data.user.id;
                    // 2. Link to Trainer
                    API.post("/api/registerTrain", {
                        userId: userId,
                        trainerId: sessionStorage.getItem("id")
                    }).then(trainRes => {
                        confirmAlert({
                            title: 'Success',
                            message: 'Trainee added and assigned successfully!',
                            buttons: [{ label: 'Ok', onClick: () => {
                                getTrainees();
                            }}]
                        });
                    });
                }
            }).catch(err => {
                confirmAlert({
                    title: 'Error',
                    message: 'Failed to add trainee: ' + (err.response?.data?.message || err.message),
                    buttons: [{ label: 'Ok' }]
                });
            });
    };

    return (
        <div>
            <Header />
            <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
                <Typography variant="h6" gutterBottom>
                    Trainee Details ({row.length})
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Trainee
                </Button>
            </div>
            <br />
            <div className="user-table">
                <TraineeTable rows={row} />
            </div>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Trainee</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} style={{ marginTop: '5px' }}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="First Name" name="fname" variant="outlined" value={traineeForm.fname} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Last Name" name="lname" variant="outlined" value={traineeForm.lname} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="NIC" name="nic" variant="outlined" value={traineeForm.nic} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Address" name="address" variant="outlined" multiline rows={2} value={traineeForm.address} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Age" name="age" type="number" variant="outlined" value={traineeForm.age} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select name="gender" value={traineeForm.gender} onChange={handleInputChange} label="Gender">
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Height (cm)" name="height" type="number" variant="outlined" value={traineeForm.height} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Weight (kg)" name="weight" type="number" variant="outlined" value={traineeForm.weight} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Password" name="password" type="password" variant="outlined" value={traineeForm.password} onChange={handleInputChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleAddTrainee} color="primary" variant="contained">Register & Assign</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
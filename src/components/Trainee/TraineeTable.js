import React, { useState } from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    TextField, 
    Grid,
    Typography
} from '@material-ui/core';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { confirmAlert } from "react-confirm-alert";
import { useHistory } from "react-router-dom";
import API from "../api";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#216DC4",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const OrderTable = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usageForm, setUsageForm] = useState({
        usageData: "", // Comma separated values
        time: "",
        status: "Active",
        average: ""
    });

    const handleOpen = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setUsageForm({ usageData: "", time: "", status: "Active", average: "" });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUsageForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUsage = () => {
        const beats = usageForm.usageData.split(",").map(v => v.trim()).filter(v => v !== "");
        if (beats.length === 0) return;

        // Convert to string formatted array for backend logic in Chart.js [val,val,val]
        const formattedData = `[${beats.join(",")}]`;
        
        // Calculate average if not provided
        const sum = beats.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        const avg = (sum / beats.length).toFixed(2);

        const newUsage = {
            userId: selectedUser.userId,
            usageData: formattedData,
            status: usageForm.status,
            average: usageForm.average || avg,
            time: usageForm.time
        };

        // Close the modal immediately for better UX
        handleClose();

        API.post("/api/registerUsage", newUsage)
            .then(res => {
                confirmAlert({
                    title: 'Success',
                    message: 'Usage data recorded successfully!',
                    buttons: [{ label: 'Ok' }]
                });
            })
            .catch(err => {
                confirmAlert({
                    title: 'Error',
                    message: 'Failed to record usage: ' + err.message,
                    buttons: [{ label: 'Ok' }]
                });
            });
    };

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">NIC</StyledTableCell>
                        <StyledTableCell align="left">First Name</StyledTableCell>
                        <StyledTableCell align="left">Last Name</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                        <StyledTableCell align="left">Gender</StyledTableCell>
                        <StyledTableCell align="left">Address</StyledTableCell>
                        <StyledTableCell align="left">Options</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.length > 0 && props.rows.map((row) => {
                        return (
                            <StyledTableRow key={row.userId}>
                                <StyledTableCell style={{ width: "10%" }} align="left">{row.nic}</StyledTableCell>
                                <StyledTableCell style={{ width: "15%" }} align="left">{row.firstname}</StyledTableCell>
                                <StyledTableCell style={{ width: "15%" }} align="left">{row.lastname}</StyledTableCell>
                                <StyledTableCell style={{ width: "10%" }} align="left">{row.status}</StyledTableCell>
                                <StyledTableCell style={{ width: "10%" }} align="left">{row.gender}</StyledTableCell>
                                <StyledTableCell style={{ width: "20%" }} align="left">{row.address}</StyledTableCell>
                                <StyledTableCell style={{ width: "20%" }} align="left">
                                    <Button variant="contained" color="primary" size="small" style={{ marginRight: '5px' }} onClick={() => {
                                        history.push({
                                            pathname: '/trainee/review',
                                            state: { id: row.userId },
                                        });
                                    }}>Review</Button>
                                    <Button variant="contained" color="secondary" size="small" onClick={() => handleOpen(row)}>Add Usage</Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Add Usage - {selectedUser?.firstname}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} style={{ marginTop: '5px' }}>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="textSecondary">Enter pulse values separated by commas (e.g., 70, 72, 75)</Typography>
                            <TextField fullWidth label="Pulse Data (Beats)" name="usageData" variant="outlined" value={usageForm.usageData} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Time (e.g., 10s or 1 min)" name="time" variant="outlined" value={usageForm.time} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Status" name="status" variant="outlined" value={usageForm.status} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Average BPM (Optional)" name="average" variant="outlined" type="number" value={usageForm.average} onChange={handleInputChange} helperText="Leave empty to auto-calculate" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleAddUsage} color="primary" variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}
export default OrderTable;
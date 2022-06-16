import {useEffect, useState} from 'react';   
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add'; 
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText'; 
import TextField from '@mui/material/TextField';
 

export default function NewProjectDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleCreate = (value) => {
    onClose("RELOAD");
  };
 

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth="md">
        <DialogTitle>Create Flowsheet</DialogTitle>
        <DialogContent> 
            <TextField  
                id="name"
                label="Flowsheet Name" 
                fullWidth
                variant="standard"
            />

            <br/><br/><br/>
            <h4>Configuration:</h4>
            <TextField  
                id="name"
                label="has bypass" 
                fullWidth
                variant="standard"
            />
            <TextField  
                id="has_desal_feed"
                label="has desal feed" 
                fullWidth
                variant="standard"
            />
            <TextField  
                id="is_twostage"
                label="is twostage" 
                fullWidth
                variant="standard"
            />
            <TextField  
                id="has_erd"
                label="has ERD" 
                fullWidth
                variant="standard"
            />
            <TextField  
                id="nf_type"
                label="NF type" 
                fullWidth
                variant="standard" 
            />
            <TextField  
                id="nf_base"
                label="NF base" 
                fullWidth
                variant="standard"
            />
            <TextField  
                id="ro_type"
                label="RO type" 
                fullWidth
                variant="standard"
            />
            <TextField  
                id="ro_base"
                label="RO base" 
                fullWidth
                variant="standard"
            />
            <TextField  
                id="ro_level"
                label="RO level" 
                fullWidth
                variant="standard"
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
    </Dialog>
  );
}
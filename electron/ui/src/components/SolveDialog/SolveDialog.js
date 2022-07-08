import {useEffect, useState} from 'react';   
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog'; 
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent'; 
import CircularProgress from '@mui/material/CircularProgress';
import { solve } from "../../services/output.service"; 

export default function SolveDialog(props) {
  const { open, handleSolved, handleError, flowsheetData, id } = props;

  useEffect(()=>{  
    if(open)
    {
        solve(id)
        .then(response => response.json())
        .then((outputData)=>{ 
            console.log("outputData",outputData);
            handleSolved(outputData);
        }).catch(e => {
          console.log("caught error: "+e)
          handleError()
      });
    }
  },[open]);

  return (
    <Dialog open={open} fullWidth={true} maxWidth="md">
        <DialogTitle></DialogTitle>
        <DialogContent>  
        <div style={{display:"flex", alignItems: "center", justifyContent: "center", gap:"10px"}}>
            <CircularProgress /> <h3>Processing...</h3>
        </div>
        </DialogContent>
        <DialogActions></DialogActions>
    </Dialog>
  );
}
import {useEffect, useState} from 'react';   
import Button from '@mui/material/Button'; 
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog'; 
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent'; 
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { solve } from "../../services/output.service"; 

export default function SolveDialog(props) {
  const { open, handleSolved, flowsheetData, id } = props;

  useEffect(()=>{  
    if(open)
    {
        //setTimeout(()=>{
        solve(id)
        .then(response => response.json())
        .then((outputData)=>{ 
            console.log("outputData",outputData);
            handleSolved(outputData);
        });
        //},3000);
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
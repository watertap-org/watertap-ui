import { useEffect } from 'react';   
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog'; 
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent'; 
import CircularProgress from '@mui/material/CircularProgress';
import { solve, sweep } from "../../services/output.service"; 

export default function SolveDialog(props) {
  const { open, handleSolved, handleError, flowsheetData, id, isSweep } = props;

  useEffect(()=>{  
    if(open)
    { 
        if(isSweep) {
          sweep(id)
          .then(response => {
            if(response.status === 200) {
              response.json()
              .then((data)=>{
                console.log(data)
                handleError("just handling success")
              });
            } else if(response.status === 400) {
              console.error("error saving data")
              handleError("just handling error")
            }
            
          })
        }else {
          solve(id)
          .then(r =>  r.json().then(data => ({status: r.status, body: data})))
          .then(data => {
            // console.log(data)
              let status = data.status
              let outputData = data.body
              if(status===200) {
                handleSolved(outputData);
              } else if (status===500) {
                handleError(outputData.detail)
              }
              
          }).catch(e => {
            console.log("caught error: "+e)
            handleError()
        });
      } 
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
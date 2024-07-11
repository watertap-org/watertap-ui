import React from 'react'; 
import {useEffect, useState } from 'react';   
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


export default function ErrorBar(props) {

    return ( 
      <Snackbar open={props.open} autoHideDuration={props.duration} onClose={props.handleErrorClose}>
        <Alert onClose={props.handleErrorClose} severity={props.severity}>
          <p className="error-message">{props.errorMessage}</p>
        </Alert>
      </Snackbar>
      
    );
  
}
 

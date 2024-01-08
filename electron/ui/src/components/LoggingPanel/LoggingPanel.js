import {useEffect, useState} from 'react';
import { Grid, Box, Modal, TextField, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const sampleData = [
    "[2024-01-08 08:30:53.961] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.feed.properties: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:53.983] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.feed: Initialization complete: optimal - Optimal Solution Found.\n",
    "\n",
    "[2024-01-08 08:30:53.984] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.magprex.properties_in: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:53.984] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.magprex.properties_treated: Initialization Complete.\n",
    "2024-01-08 08:30:53 [INFO] idaes.init.fs.magprex.properties_byproduct: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:54.007] [info]  stdout: 2024-01-08 08:30:54 [ERROR] idaes.init.fs.magprex.properties_in: State Released.\n",
    "\n",
    "[2024-01-08 08:30:54.008] [info]  stdout: 2024-01-08 08:30:54 [INFO] idaes.init.fs.magprex: Initialization Complete: optimal - Optimal Solution Found\n",
    "\n",
    "[2024-01-08 08:30:54.008] [info]  stdout: 2024-01-08 08:30:54 [INFO] idaes.init.fs.centrifuge.properties_in: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:54.008] [info]  stdout: 2024-01-08 08:30:54 [INFO] idaes.init.fs.centrifuge.properties_treated: Initialization Complete.\n",
    "2024-01-08 08:30:54 [INFO] idaes.init.fs.centrifuge.properties_byproduct: Initialization Complete.\n",
    "[2024-01-08 08:30:53.961] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.feed.properties: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:53.983] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.feed: Initialization complete: optimal - Optimal Solution Found.\n",
    "\n",
    "[2024-01-08 08:30:53.984] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.magprex.properties_in: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:53.984] [info]  stdout: 2024-01-08 08:30:53 [INFO] idaes.init.fs.magprex.properties_treated: Initialization Complete.\n",
    "2024-01-08 08:30:53 [INFO] idaes.init.fs.magprex.properties_byproduct: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:54.007] [info]  stdout: 2024-01-08 08:30:54 [ERROR] idaes.init.fs.magprex.properties_in: State Released.\n",
    "\n",
    "[2024-01-08 08:30:54.008] [info]  stdout: 2024-01-08 08:30:54 [INFO] idaes.init.fs.magprex: Initialization Complete: optimal - Optimal Solution Found\n",
    "\n",
    "[2024-01-08 08:30:54.008] [info]  stdout: 2024-01-08 08:30:54 [INFO] idaes.init.fs.centrifuge.properties_in: Initialization Complete.\n",
    "\n",
    "[2024-01-08 08:30:54.008] [info]  stdout: 2024-01-08 08:30:54 [INFO] idaes.init.fs.centrifuge.properties_treated: Initialization Complete.\n",
    "2024-01-08 08:30:54 [INFO] idaes.init.fs.centrifuge.properties_byproduct: Initialization Complete.\n",
  ]

export default function LoggingPanel(props) {
    const { open, onClose } = props;
    const [ logData, setLogData ] = useState(sampleData)
    // const [ open, setOpen ] = useState(true)
    const styles = {
        modalStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "80vw",
            height: "60vh",
            bgcolor: 'black',
            border: '1px solid #AEAEAE',
            borderRadius:2,
            boxShadow: 24,
            p: 2,
            overflowY: "scroll",
            overflowX: "scroll",
            color: "white"
        },
        header:{
            marginTop:5
        },
        button: {
            borderRadius: '8px', 
            width: 200,
        },
        console: {
            overflowX: "scroll"
        },
        consoleText: {
            // display: "flex",
            // overflowX: "scroll",
        },

    }

    const handleClose = () => {
        onClose()
    };


  return (
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Grid container sx={styles.modalStyle} spacing={1}>

            <Grid item xs={9}>
                <h2 style={styles.header}>Backend Logs</h2>
            </Grid>
            <Grid item xs={3}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight:'10px'}}>
                    <IconButton onClick={handleClose}><CloseIcon style={{color: "white"}}/></IconButton>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box sx={styles.console}>
                <Typography sx={styles.consoleText}>
                    {logData.map((line, idx) => {
                        if (line.includes('ERROR')) {
                            return (
                                <p style={{color: "#FF042E"}} key={idx}>{line}</p>
                            )
                        } else {
                            return (
                                <p style={{color: "#28FF24"}} key={idx}>{line}</p>
                            )
                        }
                    })}
                </Typography>
                    
                </Box>
            </Grid>
        </Grid>
    </Modal>
  );
}


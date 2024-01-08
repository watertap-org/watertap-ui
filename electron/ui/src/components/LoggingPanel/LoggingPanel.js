import {useEffect, useState, useRef} from 'react';
import { Grid, Box, Modal, TextField, IconButton, Typography, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getLogs } from '../../services/flowsheet.service';

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

    useEffect(() => {
        if (open)(
            getLogs()
            .then(response => response.json())
            .then((data) => {
                console.log('got logs: ')
                setLogData(data)
                // console.log(data)
            })
        )
        
    },[props])

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
            // overflowY: "scroll",
            // overflowX: "scroll",
            overflow: "hidden",
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
            overflow: "scroll",
        },
        consoleText: {
            // display: "flex",
            // overflowX: "scroll",
        },
        dialogTitle: {
            backgroundColor: "black",
            color: "white",
        },
        dialogContent: {
            backgroundColor: "black",
            color: "white",
        },
        dialogContentText: {
            backgroundColor: "black",
            color: "white",
        },
        dialog: {
            // maxWidth: "80vw",
        },
        dialogPaper: {
            minHeight: '60vh',
            maxHeight: '60vh',
            minWidth: '60vw',
            maxWidth: '60vw',
        },

    }

    const handleClose = () => {
        onClose()
    };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
      if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="console-dialog"
            aria-describedby="console-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
              }}
            
        >
            <DialogTitle id="dialog-title" style={styles.dialogTitle}>Backend Logs</DialogTitle>
            <DialogContent style={styles.dialogContent} dividers={true}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
                style={styles.dialogContentText}
            >
                {logData.map((line, idx) => {
                    if (line.includes('ERROR')) {
                        return (
                            <p style={{color: "#FF042E"}} key={idx}>{line}</p>
                        )
                    } else if (line.includes('INFO')) {
                        return (
                            <p style={{color: "#28FF24"}} key={idx}>{line}</p>
                        )
                    }
                    else if (line.includes('DEBUG')) {
                        return (
                            <p style={{color: "#3B90FF"}} key={idx}>{line}</p>
                        )
                    }
                    else if (line.includes('WARNING')) {
                        return (
                            <p style={{color: "#FFF42C"}} key={idx}>{line}</p>
                        )
                    }
                    else {
                        return (
                            <p style={{color: "WHITE"}} key={idx}>{line}</p>
                        )
                    }
                })}
            </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}


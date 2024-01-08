import {useEffect, useState, useRef } from 'react';
import { Grid, Box, Modal, TextField, IconButton, Typography, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getLogs } from '../../services/flowsheet.service';


export default function LoggingPanel(props) {
    const { open, onClose } = props;
    const [ logData, setLogData ] = useState([])
    const divRef = useRef(null);

    useEffect(() => {
        if (open)(
            getLogs()
            .then(response => response.json())
            .then((data) => {
                console.log('got logs: ')
                setLogData(data)
                // console.log(data)
                // window.scrollTo(0, document.body.scrollHeight);
            })
        )
        
    },[props])

    useEffect(() => {
        if (open) {
            console.log('log data was updated')
            // scrollToBottom("test-div")
            divRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        
    },[logData])

    

    const styles = {
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
                aria-labelledby="console-dialog-content-text"
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
                <div id="bottom-div" ref={divRef} ></div>
            </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}


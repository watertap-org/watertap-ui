import {useEffect, useState, useRef } from 'react';
import { Grid, Box, Modal, TextField, IconButton, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
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
            // overflowX: "auto"
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
    
    const getTextColor = (line) => {
        if (line.includes('ERROR')) return "#FF042E"
        else if (line.includes('INFO')) return "#28FF24"
        else if (line.includes('DEBUG')) return "#3B90FF"
        else if (line.includes('WARNING')) return "#FFF42C"
        else return "white"
    }

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
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: "white",
                }}
                >
                <CloseIcon />
            </IconButton>
            <DialogContent style={styles.dialogContent} dividers={true}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
                style={styles.dialogContentText}
                aria-labelledby="console-dialog-content-text"
            >   
                    {logData.map((line, idx) => {
                        return <Typography style={{color: getTextColor(line.log_level), overflowWrap: "break-word"}} key={idx}>[{line.log_level}] {line.log_name}: {line.log_message}</Typography>
                    })}
                <div id="bottom-div" ref={divRef} ></div>
            </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}


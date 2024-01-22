import {useEffect, useState, useRef } from 'react';
import { Grid, Box, Modal, TextField, IconButton, Button, Tooltip } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getLogs, downloadLogs } from '../../services/flowsheet.service';
import Draggable from 'react-draggable';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import DownloadIcon from '@mui/icons-material/Download';


export default function LoggingPanel(props) {
    const { open, onClose } = props;
    const [ logData, setLogData ] = useState([])
    const [ dialogHeight, setDialogHeight ] = useState('60vh')
    const [ dialogWidth, setDialogWidth ] = useState('60vw')
    const [ fullscreen, setFullscreen] = useState(false)
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
            minHeight: dialogHeight,
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
        },

    }

    const handleClose = () => {
        onClose()
    };

    const handleFullscreen = () => {
        if (fullscreen) {
            setDialogHeight('60vh')
            setDialogWidth('60vw')
        } else {
            setDialogHeight('100vh')
            setDialogWidth('100vw')
        }
        setFullscreen(!fullscreen)
    }

    const handleDownloadLogs = () => {
        downloadLogs().then(response => response.blob())
        .then((data) => {
            console.log(data)
            let logsUrl = window.URL.createObjectURL(data);
            let tempLink = document.createElement('a');
            tempLink.href = logsUrl;
            tempLink.setAttribute('download', 'watertap-ui-logs.log');
            tempLink.click();
        })
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
        <Draggable>
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="console-dialog"
            aria-describedby="console-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
              }}
            BackdropProps={{
                sx: {backgroundColor: "transparent"}
            }}
        >
            <DialogTitle id="dialog-title" style={styles.dialogTitle}>Backend Logs</DialogTitle>
            <Tooltip title={"Download full logs"}>
                <IconButton
                    aria-label="close"
                    onClick={handleDownloadLogs}
                    sx={{
                        position: 'absolute',
                        right: 80,
                        top: 8,
                        color: "white",
                    }}
                    >
                    <DownloadIcon/>
                </IconButton>
            </Tooltip>
            <IconButton
                aria-label="close"
                onClick={handleFullscreen}
                sx={{
                    position: 'absolute',
                    right: 40,
                    top: 8,
                    color: "white",
                }}
                >
                {fullscreen ? <FullscreenExitIcon/> : <FullscreenIcon />}
            </IconButton>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 0,
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
        </Draggable>
    )
}


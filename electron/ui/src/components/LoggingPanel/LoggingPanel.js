import {useEffect, useState, useRef } from 'react';
import { InputAdornment, TextField, IconButton, Tooltip, MenuItem, Checkbox, ListItemText, Menu } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getLogs, downloadLogs } from '../../services/flowsheet.service';
import Draggable from 'react-draggable';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';


export default function LoggingPanel(props) {
    const { open, onClose } = props;
    const [ logData, setLogData ] = useState([])
    const [ dialogHeight, setDialogHeight ] = useState('60vh')
    const [ dialogWidth, setDialogWidth ] = useState('60vw')
    const [ fullscreen, setFullscreen] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ filters, setFilters ] = useState(["DEBUG", "INFO", "WARNING", "ERROR"])
    const [ showFilters, setShowFilters ] = useState(false)
    const [ anchorEl, setAnchorEl ] = useState(null);
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
        DEBUG: {
            color: "#3B90FF",
        },
        INFO: {
            color: "#28FF24",
        },
        WARNING: {
            color: "#FFF42C",
        },
        ERROR: {
            color: "#FF042E",
        }
    }

    const handleClose = () => {
        setSearchTerm("")
        setShowFilters(false)
        setFilters(["DEBUG", "INFO", "WARNING", "ERROR"])
        if(fullscreen) handleFullscreen()
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

    const handleShowLogFilters = (event) => {
        setShowFilters(!showFilters)
        setAnchorEl(event.currentTarget);
    }

    const handleFilter = (level) => {
        let tempFilters = [...filters]
        const index = tempFilters.indexOf(level);
        if (index > -1) {
            tempFilters.splice(index, 1);
        } else {
            tempFilters.push(level)
        }
        setFilters(tempFilters)
    }
    
    const getTextColor = (line) => {
        if (line.includes('ERROR')) return styles.ERROR.color
        else if (line.includes('INFO')) return styles.INFO.color
        else if (line.includes('DEBUG')) return styles.DEBUG.color
        else if (line.includes('WARNING')) return styles.WARNING.color
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
        <Draggable handle="#console-dialog">
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
            
            <TextField id={'searchBar'} 
                    label={'Search'}
                    variant="outlined" 
                    size="small"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    sx={{
                        position: 'absolute',
                        right: 160,
                        top: 12,
                        color: "white",
                        backgroundColor: "#292f30",
                        borderRadius: 10,
                        input: { color: 'white' },
                    }}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{color: "white"}}>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
            />
            <IconButton
                aria-label="close"
                onClick={handleShowLogFilters}
                sx={{
                    position: 'absolute',
                    right: 120,
                    top: 8,
                    color: "white",
                }}
                >
                <FilterListIcon/>
            </IconButton>
                <Menu
                    id="log-filter"
                    anchorEl={anchorEl}
                    open={showFilters}
                    onClose={() => setShowFilters(false)}
                    sx={{
                        "& .MuiPaper-root": {
                            backgroundColor: "#292f30"
                        }
                    }}
                >
                    {["DEBUG", "INFO", "WARNING", "ERROR"].map((loglevel, idx) => (
                        <MenuItem key={loglevel} value={loglevel} onClick={() => handleFilter(loglevel)} sx={{color: "white"}}>  
                            <Checkbox 
                                checked={filters.includes(loglevel)} 
                                sx={{
                                    color: styles[loglevel].color,
                                    '&.Mui-checked': {
                                    color: styles[loglevel].color,
                                    },
                                }}
                            />
                            <ListItemText primary={loglevel} />
                        </MenuItem>
                    ))}
                </Menu>

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
                component="span"
            >   
                    {logData.map((line, idx) => {
                        if (line.log_message.toLowerCase().includes(searchTerm.toLowerCase()) && filters.includes(line.log_level)) {
                            return <Typography style={{color: getTextColor(line.log_level), overflowWrap: "break-word"}} key={idx}>[{line.log_level}] {line.log_name}: {line.log_message}</Typography>
                        }
                        
                    })}
                <div id="bottom-div" ref={divRef} ></div>
            </DialogContentText>
            </DialogContent>
        </Dialog>
        </Draggable>
    )
}


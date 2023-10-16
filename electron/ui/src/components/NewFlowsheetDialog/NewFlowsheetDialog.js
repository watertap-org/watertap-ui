import {useEffect, useState} from 'react';   
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { FileUploader } from "react-drag-drop-files";
 

export default function NewFlowsheetDialog(props) {
  const { onClose, open } = props;
  

  const handleClose = () => {
    onClose(null);
  };

//   const handleCreate = (value) => {
//     onClose("RELOAD");
//   };
 

    const [ showWarning, setShowWarning ] = useState(false)
    const [ warningMessage, setWarningMessage ] = useState("")
    const [ file, setFile ] = useState(null)
    const [ files, setFiles ] = useState({"Model File": null, "Export File": null, "Diagram File": null, "Data Files": []})
    const fileTypes = {"Model File": ["py"], "Export File": ["py"], "Diagram File": ["png"], "Data Files": ["yaml", "yml", "json", "csv"], };

  useEffect(()=>{
    console.log('fileuploadmodal props: ')
    console.log(props)
  }, [props]);

   const styles = {
    modalStyle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      border: '1px solid #AEAEAE',
      borderRadius:2,
      boxShadow: 24,
      p: 2,
    },
    header:{
        color:"#0884b4",
        marginTop:5
    },
    button: {
        backgroundColor: '#0884b4',
        borderRadius: '8px', 
        color:'white',
        width: 200,
        '&:hover': {
            backgroundColor: '#0884b4',
            opacity: 0.9
        },
    },
    sampleFile:{
        color:"#0884b4",
        textDecoration: "none",
        fontWeight: "bold"
    },
    fileUploaderBox: {
        border: '2px dashed black',
        borderRadius:2,
        px:10,
        py: 3,
        cursor: "pointer"
    }
   }


   const handleUploadFlowsheet = () => {
    if (files["Model File"] === null) {
        setWarningMessage("Please upload a valid model file")
        setShowWarning(true)
        setTimeout(function() {
            setShowWarning(false)
          }, 5000)
    } else if (files["Export File"] === null) {
        setWarningMessage("Please upload a valid export file")
        setShowWarning(true)
        setTimeout(function() {
            setShowWarning(false)
          }, 5000)
    } else if (files["Diagram File"] === null) {
        setWarningMessage("Please upload a valid diagram file")
        setShowWarning(true)
        setTimeout(function() {
            setShowWarning(false)
          }, 5000)
    } else {
        // ensure that files are all named in correct format
        let modelFileName = files["Model File"].name.replace('.py', '')
        let exportFileName = files["Export File"].name.replace('.py', '')
        let diagramFileName = files["Diagram File"].name.replace('.png', '')
        let filesAreValid
        try {
            if (    
                exportFileName.substring(0, modelFileName.length) === modelFileName && 
                diagramFileName === exportFileName && 
                exportFileName.substring(modelFileName.length) === '_ui'
            ) filesAreValid = true
        else filesAreValid = false
        } catch (e) {
            filesAreValid = false
        }
        if (filesAreValid) {
            // make api call


            setShowWarning(false)
            handleClose()
        } else {
            setWarningMessage("Incorrect file name formatting. Export file name must be same as model file name with _ui appended to end. Export and diagram files must have matching names. For example: model.py, model_ui.py, model_ui.png.")
            setShowWarning(true)
            setTimeout(function() {
                setShowWarning(false)
            }, 30000)
            }
    }
   }

   const fileTypeError = (fileId) => {
    try {
        let newWarningMessage = "Please choose a valid file type from these options: "
        for (let fileType of fileTypes[fileId]) {
            newWarningMessage+= fileType+", "
        }
        setWarningMessage(newWarningMessage)
        setShowWarning(true)
        setTimeout(function() {
            setShowWarning(false)
          }, 5000)

    } catch(e) {
        console.log('failed file type error : '+e)
    }

   }

   const fileUploaderContainer = (fileId) => {
    return (
        <Box sx={styles.fileUploaderBox} style={fileId === "Data Files" ? {backgroundColor: "#D4EFFF"} : files[fileId] !== null ? {backgroundColor: "#D7F5D7"} : {backgroundColor: "#FEF1F0"}}>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <h4 style={{marginTop:0, paddingTop:0, color:"#9B9B9B"}}>Drag and drop <u>{fileId}</u> or <Button style={{color: '#0884b4',}} variant="outlined">Browse...</Button></h4>
            </Box>
            {/* <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <h4 style={{marginTop:0, paddingTop:0, color:"#9B9B9B"}}>or</h4>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Button style={{color: '#0884b4',}} variant="outlined">Browse...</Button>
            </Box> */}
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <p style={{marginBottom:0, paddingTop:0}}>{files[fileId] === null ? "" : files[fileId].name}</p>
            </Box>
        </Box>
    )
   }

   function DragDrop(fileId) {
    const handleChange = (file) => {
        console.log('setting file for '+fileId+': '+file.name)
        let tempFiles = {...files}
        tempFiles[fileId] = file
        setFiles(tempFiles)
    //   setFile(file);

    };
    return (
      <FileUploader 
        handleChange={handleChange} 
        name="file" 
        types={fileTypes[fileId]}
        children={fileUploaderContainer(fileId)}
        onTypeError={() => fileTypeError(fileId)}
      />
    );
  }


  return (
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >

        <Grid container sx={styles.modalStyle} spacing={1}>
                    
        <Grid item xs={9}>
            <h2 style={styles.header}>Upload a new flowsheet</h2>
        </Grid>
        <Grid item xs={3}>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight:'10px'}}>
                <IconButton onClick={handleClose}><CloseIcon/></IconButton>
            </Box>
        </Grid>


        <Grid item xs={12}>
            {DragDrop("Model File")}
        </Grid>
        <Grid item xs={12}>
            {DragDrop("Export File")}
        </Grid>
        <Grid item xs={12}>
            {DragDrop("Diagram File")}
        </Grid>
        <Grid item xs={12}>
            {DragDrop("Data Files")}
        </Grid>
        {/* <Grid item xs={12}></Grid> */}
        <Grid item xs={12}>
            {showWarning && <p style={{color:'red'}}>{warningMessage}</p>}
        </Grid>
        <Grid item xs={12}>
            <Button id="create-scenario-button" style={styles.button} onClick={handleUploadFlowsheet}>Upload Flowsheet</Button>
        </Grid>
        </Grid>
    </Modal>
  );
}


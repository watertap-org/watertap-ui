import {useEffect, useState} from 'react';   
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { FileUploader } from "react-drag-drop-files";
import { uploadFlowsheet } from "../../services/flowsheetsList.service";
import ErrorBar from "../../components/ErrorBar/ErrorBar";

export default function NewFlowsheetDialog(props) {
  const { onClose, open, setNewFlowsheetError } = props;
  const [ showWarning, setShowWarning ] = useState(false)
  const [ warningMessage, setWarningMessage ] = useState("")
  const [ files, setFiles ] = useState({"Model File": null, "Export File": null, "Diagram File": null, "Data Files": []})
  const fileTypes = {"Model File": ["py"], "Export File": ["py"], "Diagram File": ["png", "jpeg", "jpg"], "Data Files": ["yaml", "yml", "json", "csv", "txt", "zip"], };
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
        marginTop:5
    },
    button: {
        borderRadius: '8px',
        width: 200,
    },
    fileUploaderOuterBox: {
        border: '2px dashed black',
        borderRadius:2,
    },
    fileUploaderInnerBox: {
        display: 'flex', 
        justifyContent: 'center', 
        px:10,
        py: 3,
        cursor: "pointer"
    }
   }

   const handleClose = () => {
        setFiles({"Model File": null, "Export File": null, "Diagram File": null, "Data Files": []})
        onClose(null);
    }; 

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
    } else {
        // ensure that files are all named in correct format
        let modelFileName = files["Model File"].name.replace('.py', '')
        let exportFileName = files["Export File"].name.replace('.py', '')
        let diagramFileName
        if (files["Diagram File"] === null) diagramFileName = exportFileName // removes the need for an additional check below
        else diagramFileName = files["Diagram File"].name.replace('.png', '')
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
            const formData = new FormData();
            formData.append('files', files['Model File'], files['Model File'].name);
            formData.append('files', files['Export File'], files['Export File'].name);
            if (files["Diagram File"] !== null) formData.append('files', files['Diagram File'], files['Diagram File'].name);
            for (let dataFile of files['Data Files']) {
                formData.append('files', dataFile, dataFile.name);
            }

            // call API upload flowsheet
            uploadFlowsheet(formData)
            .then(response => {
            if (response.status === 200) {
                response.json()
                .then((data)=>{
                    console.log('fileupload successful: ',data)
                    window.location.reload()

                }).catch((err)=>{
                    console.error("error on file upload: ",err)
                })
            }
            /*
                in the case of bad file type
            */
            else if (response.status === 400) {
                response.json()
                .then((data)=>{
                    console.error("error on file upload: ",data.detail)
                    setNewFlowsheetError(data.detail)
                }).catch((err)=>{
                    console.error("error on file upload / json(): ",err)
                })                
            }
            })

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
            newWarningMessage+= fileType+" "
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

   const removeFile = (fileId, i, e) => {
    let tempFiles = {...files}
    if (fileId === "Data Files") {
        let tempDataFiles = [...tempFiles[fileId]]
        tempDataFiles.splice(i, 1)
        tempFiles[fileId] = tempDataFiles

    } else {
        tempFiles[fileId] = null
    }
    setFiles(tempFiles)
   }



   const fileUploaderContainer = (fileId) => {
    return (
        <Box className={fileId.replace(" ","")} sx={styles.fileUploaderInnerBox}>
            <h4 style={{margin:0, color:"#9B9B9B"}}>Drag and drop <u>{fileId}</u> or <Button style={{color: '#0884b4'}} variant="outlined">Browse...</Button></h4>
        </Box>

    )
   }

   function DragDrop(fileId) {
    const handleChange = (file) => {
        let tempFiles = {...files}
        if (fileId === "Data Files") {
            let tempDataFiles = [...tempFiles[fileId]]
            tempDataFiles.push(file[0])
            tempFiles[fileId] = tempDataFiles
        } else {
            tempFiles[fileId] = file
        }
        setFiles(tempFiles)

    };
    return (
        <Box 
                sx={styles.fileUploaderOuterBox} 
                style={(fileId === "Data Files" || fileId === "Diagram File") ? {backgroundColor: "#D4EFFF"} : 
                files[fileId] !== null ? {backgroundColor: "#D7F5D7"} : 
                {backgroundColor: "#FEF1F0"}}
        >
            <FileUploader 
                handleChange={handleChange} 
                name="file" 
                types={fileTypes[fileId]}
                children={fileUploaderContainer(fileId)}
                onTypeError={() => fileTypeError(fileId)}
                multiple={fileId === "Data Files" ? true : false}
                onSelect={(f) => console.log('selected boi')}
            />
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Grid container>
                    { fileId === "Data Files" ? 
                    files[fileId].map((v,i) => (
                        <Grid item xs={12} key={i}>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <p style={{margin: 3}}>{v.name}<IconButton onClick={(e) => removeFile(fileId, i, e)}><CloseIcon sx={{fontSize: "15px"}}/></IconButton></p>
                            </Box>
                        </Grid>
                    )) 
                    : 
                        files[fileId] !== null &&
                        <Grid item xs={12}>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <p style={{margin: 3}}>{files[fileId] === null ? "" : files[fileId].name}<IconButton onClick={(e) => removeFile(fileId, -1, e)}><CloseIcon sx={{fontSize: "15px"}}/></IconButton></p>
                            </Box>
                        </Grid>
                    }
                </Grid>
            </Box>
        </Box>
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
            <Box sx={{display: 'flex', justifyContent: 'center', marginRight:'10px'}}>
                <Button className="upload-flowsheet-button" variant="contained" style={styles.button} onClick={handleUploadFlowsheet}>Upload Flowsheet</Button>
            </Box>
            </Grid>
        </Grid>
    </Modal>
  );
}


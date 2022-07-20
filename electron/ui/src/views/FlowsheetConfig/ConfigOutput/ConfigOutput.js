 
import React from 'react'; 
import {useEffect, useState, useContext} from 'react';
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';  
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { saveConfig }  from '../../../services/output.service.js'
import Modal from '@mui/material/Modal';


export default function ConfigOutput(props) {
    let params = useParams(); 
    const { outputData, historyData } = props;
    const [ configName, setConfigName ] = useState("Configuration #"+props.historyData.length)
    const [ openSaveConfig, setOpenSaveConfig ] = React.useState(false);
    const [ saved, setSaved ] = React.useState(false);

    const handleOpenSaveConfig = () => setOpenSaveConfig(true);
    const handleCloseSaveConfig = () => setOpenSaveConfig(false);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      

    useEffect(()=>{   
        // console.log(outputData)
    }, [outputData]);

    const handleChangeConfigName = (event) => {
        setConfigName(event.target.value)
    }

    const handleSaveConfig = () => {
        saveConfig(params.id,configName)
        .then(response => response.json())
        .then((data)=>{
            console.log('successfully saved config')
            historyData[historyData.length-1]['name'] = configName
            handleCloseSaveConfig()
            setSaved(true)
        })
        .catch((e) => {
            console.log('error saving config')
            handleCloseSaveConfig()
        });
    }

    // renders the data in output accordions
    const renderFields = (fieldData) => {
        // console.log("F:",fieldData);
        return Object.keys(fieldData).map((key)=>{ 
            let _key = key + Math.floor(Math.random() * 100001); 
            return (<div key={_key}>
                           <span>{key+" "}</span>
                           <span style={{color:"#68c3e4",fontWeight:"bold"}}>{fieldData[key][0]}</span>
                           <span>{" "+fieldData[key][1]}</span>
                    </div>)
        })
    };


    const renderOutputAccordions = () => { 
        if(!outputData.hasOwnProperty("output") || !outputData.output)
        {
            return (<Grid item xs={12} >
                        <Alert severity="info">No soluction found!</Alert>
                    </Grid>);
        }

        return Object.keys(outputData.output).map((key,index)=>{
            //console.log("O key:",key);
            let gridSize = 4;
            if(index===0)
                gridSize = 12;
            
            let _key = key + Math.floor(Math.random() * 100001); 
            return (<Grid item xs={gridSize} key={_key}>
                        <Accordion expanded={true} style={{border:"1px solid #ddd"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                {key}
                            </AccordionSummary>
                            <AccordionDetails>  
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1 },
                                    }}
                                    autoComplete="off"
                                >
                                {
                                    renderFields(outputData.output[key])
                                }
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>)
        })
    };
    
    return ( 
        <> 
            <Grid container spacing={2} alignItems="flex-start"> 
            {   
                renderOutputAccordions()
            }
            <Grid item xs={12}> 
                <Button disabled={saved ? true : false} onClick={handleOpenSaveConfig}>
                    Save Configuration
                </Button> 
                <Modal
                    open={openSaveConfig}
                    onClose={handleCloseSaveConfig}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Grid container sx={modalStyle} spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                variant="standard"
                                id="margin-none"
                                label="Config Name"
                                value={configName}
                                onChange={handleChangeConfigName}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                            <Button onClick={handleSaveConfig} variant="contained">Save</Button>
                        </Grid>
                    </Grid>
                </Modal>
            </Grid>
            </Grid>
        </>
    );
}
 

 
import React from 'react'; 
import { useEffect, useState } from 'react';
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
import { saveConfig, listConfigNames, loadConfig }  from '../../../services/output.service.js'
import Modal from '@mui/material/Modal';


export default function ConfigOutput(props) {
    let params = useParams(); 
    const { outputData } = props;
    const [ configName, setConfigName ] = useState(outputData.name)
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
      

    const handleChangeConfigName = (event) => {
        setConfigName(event.target.value)
    }

    const handleSaveConfig = () => {
        saveConfig(params.id,outputData.data,configName)
        .then(response => response.json())
        .then((data)=>{
            console.log('successfully saved config')
            handleCloseSaveConfig()
            setSaved(true)
        })
        .catch((e) => {
            console.log('error saving config')
            handleCloseSaveConfig()
        });
    }

    const organizeVariables = (bvars) => {
        let var_sections = {}
        for (const [key, v] of Object.entries(bvars)) {
            let catg = v.input_category
            if (catg === null) {
                catg = "Uncategorized"
            }
            if (!Object.hasOwn(var_sections, catg)) {
                var_sections[catg] = {display_name: catg, variables: {}}
            }
            var_sections[catg]["variables"][key] = v
        }
        return var_sections
    }

    // renders the data in output accordions
    const renderFields = (fieldData) => {
        return Object.keys(fieldData).map((key)=>{ 
            let _key = key + Math.floor(Math.random() * 100001); 
            return (<div key={_key}>
                           <span>{fieldData[key].name+" "}</span>
                           <span style={{color:"#68c3e4",fontWeight:"bold"}}>{fieldData[key].value}</span>
                           <span>{" "+fieldData[key].display_units}</span>
                    </div>)
        })
    };


    const renderOutputAccordions = () => { 
        // if(!outputData.hasOwnProperty("output") || !outputData.output)
        // {
        //     return (<Grid item xs={12} >
        //                 <Alert severity="info">No soluction found!</Alert>
        //             </Grid>);
        // }
        let var_sections = organizeVariables(outputData.data.model_objects)
        return Object.entries(var_sections).map(([key,value])=>{
            //console.log("O key:",key);
            let gridSize = 4;
            // if(index===0)
            //     gridSize = 12;
            
            let _key = key + Math.floor(Math.random() * 100001); 
            return (<Grid item xs={gridSize} key={_key}>
                        <Accordion expanded={true} style={{border:"1px solid #ddd"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                {value.display_name}
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
                                    renderFields(value.variables)
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
                <Button disabled={saved ? true : false} variant="contained" onClick={handleOpenSaveConfig}>
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
                                className="modal-save-config"
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
 

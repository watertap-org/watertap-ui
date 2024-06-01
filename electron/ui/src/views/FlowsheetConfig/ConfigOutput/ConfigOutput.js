 
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
import { saveConfig }  from '../../../services/output.service.js'
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
        saveConfig(params.id,{inputData: outputData.inputData, outputData: outputData.outputData},configName, outputData.inputData.version)
        .then(response => response.json())
        .then((data)=>{
            console.log('successfully saved config')
            let tempFlowsheetData = {...outputData}
            tempFlowsheetData.name=configName
            props.updateFlowsheetData(tempFlowsheetData, "UPDATE_CONFIG")
            handleCloseSaveConfig()
            setSaved(true)
        })
        .catch((e) => {
            console.log('error saving config',e)
            handleCloseSaveConfig()
        });
    }

    const organizeVariables = (bvars) => {
        let var_sections = {}
        for (const [key, v] of Object.entries(bvars)) {
            let catg = v.output_category
            let is_input = v.is_input
            let is_output = v.is_output
            if (catg === null) {
                catg = ""
            }
            if (!Object.hasOwn(var_sections, catg)) {
                var_sections[catg] = {display_name: catg, variables: {}, input_variables:{}, output_variables:{}}
            }
            var_sections[catg]["variables"][key] = v
            if(is_input) var_sections[catg]["input_variables"][key] = v;
            if(is_output) var_sections[catg]["output_variables"][key] = v
        }
        return var_sections
    }

    // renders the data in output accordions
    const renderFields = (fieldData) => {
        // console.log("field data", fieldData)
        return Object.keys(fieldData).map((key)=>{ 
            let _key = key + Math.floor(Math.random() * 100001); 

            // handle rounding
            let roundedValue
            if(fieldData[key].rounding != null) {
                if (fieldData[key].rounding > 0) {
                    roundedValue = parseFloat((fieldData[key].value).toFixed(fieldData[key].rounding))
                } else if (fieldData[key].rounding === 0) 
                {
                    roundedValue = Math.round(fieldData[key].value)
                }
                else // if rounding is negative
                {
                    let factor = 1
                    let tempRounding = fieldData[key].rounding
                    console.log('rounding is negative : ',fieldData[key].rounding)
                    while (tempRounding < 0) {
                        factor *= 10
                        tempRounding += 1
                    }
                    roundedValue = Math.round((fieldData[key].value / factor)) * factor
                    console.log("old value is: ", fieldData[key].value)
                    console.log('new value is: ', roundedValue)
                }
            }else // if rounding is not provided, just use given value 
            {
                roundedValue = fieldData[key].value
            }
            return (<div key={_key}>
                           <span>{fieldData[key].name+" "}</span>
                           <span style={{color:"#68c3e4",fontWeight:"bold"}}>{roundedValue}</span>
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
        let var_sections = organizeVariables(outputData.outputData.model_objects)
        // console.log("var_sections",var_sections)
        return Object.entries(var_sections).map(([key,value])=>{
            //console.log("O key:",key);
            let gridSize = 4;
            // if(index===0)
            //     gridSize = 12;
            
            let _key = key + Math.floor(Math.random() * 100001); 
            if(Object.keys(value.output_variables).length > 0) {
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
                                renderFields(value.output_variables)
                            }
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>)
            }

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
 

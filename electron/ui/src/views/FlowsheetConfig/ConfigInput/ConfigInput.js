 
import React from 'react'; 
import {useEffect, useState } from 'react';    
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAccordion from "../../../components/InputAccordion/InputAccordion"; 
import Toolbar from '@mui/material/Toolbar';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import { loadConfig, listConfigNames }  from '../../../services/output.service.js'
import { useParams } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { deleteConfig }  from '../../../services/input.service.js'
import Modal from '@mui/material/Modal';
import ErrorBar from "../../../components/ErrorBar/ErrorBar"; 





export default function ConfigInput(props) {
    let params = useParams(); 
    const { flowsheetData, updateFlowsheetData } = props; 
    const [ previousConfigs, setPreviousConfigs ] = useState([]) 
    const [ configName, setConfigName ] = React.useState("");
    const [ openDeleteConfig, setOpenDeleteConfig] = useState(false)
    const [ openErrorMessage, setOpenErrorMessage ] = useState(false);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      

    useEffect(()=>{ 
        console.log('list config names with version ', flowsheetData.inputData.version)
        listConfigNames(params.id, flowsheetData.inputData.version)
        .then(response => {
            if (response.status === 200) {
                response.json()
                .then((data)=>{
                  setPreviousConfigs(data)
                  if(data.includes(flowsheetData.name)) {
                    setConfigName(flowsheetData.name)
                  }
                }).catch((err)=>{
                    console.error("unable to get list of config names: ",err)
                })
            }
        else {
            console.error("unable to get list of config names: ",response.statusText)
        }
        })
    }, []);
 
    const handleConfigSelection = (event) => {
        const {
          target: { value },
        } = event;
  
        loadConfig(params.id, value)
        .then(response => response.json())
        .then((data)=>{
          let tempFlowsheetData = {...flowsheetData}
          tempFlowsheetData.name = value
          tempFlowsheetData.outputData = data.outputData
          tempFlowsheetData.inputData = data.inputData
          updateFlowsheetData(tempFlowsheetData,"UPDATE_CONFIG")
          setConfigName(value);
        }).catch((err)=>{
            console.error("unable to get load config: ",err)
        });
        
      };

    const handleDelete = () => {
        console.log('deleting id=',params.id,'name=',configName)
        deleteConfig(params.id, configName)
        .then(response => response.json())
        .then((data)=>{
            console.log('returned data (configs) ',data)
          setConfigName("");
          setPreviousConfigs(data)
          setOpenDeleteConfig(false)
        }).catch((err)=>{
            console.error("unable to get load config: ",err)
            setOpenDeleteConfig(false)
        });
    }

    /**
     * Organize variables into sections by their 'category' attribute.
     *
     * @returns Object {<category-name>: [list, of, variable, objects]}
     */
    const organizeVariables = (bvars) => {
        let var_sections = {}
        for (const [key, v] of Object.entries(bvars)) {
            let catg = v.input_category
            let is_input = v.is_input
            let is_output = v.is_output
            // console.log("key",key)

            if (catg === null) {
                catg = ""
            }
            if (!Object.hasOwn(var_sections, catg)) {
                var_sections[catg] = {display_name: catg, variables: {}, input_variables:{}, output_variables:{} }
            }
            var_sections[catg]["variables"][key] = v
            if(is_input) var_sections[catg]["input_variables"][key] = v;
            if(is_output) var_sections[catg]["output_variables"][key] = v;

            //round values for input 
            try {
                let roundedValue
                if(v.rounding != null) {
                    if (v.rounding > 0) {
                        roundedValue = parseFloat((Number(v.value)).toFixed(v.rounding))
                    } else if (v.rounding === 0) 
                    {
                        roundedValue = Math.round(Number(v.value))
                    }
                    else // if rounding is negative
                    {
                        let factor = 10 ** (-v.rounding)
                        roundedValue = Math.round((Number(v.value) / factor)) * factor
                    }
                }else // if rounding is not provided, just use given value 
                {
                    roundedValue = v.value
                }
                var_sections[catg]["variables"][key].value = roundedValue
                if(is_input) var_sections[catg]["input_variables"][key].value = roundedValue;
                if(is_output) var_sections[catg]["output_variables"][key].value = roundedValue;
            } catch (e) {
                console.error('error rounding input for: ',v)
                console.error(e)
            }
            
        }
        return var_sections
    }

    const renderInputAccordions = () => {
        try {
            let var_sections = organizeVariables(flowsheetData.inputData.model_objects)
            return Object.entries(var_sections).map(([key, value])=>{
                let _key = key + Math.floor(Math.random() * 100001);
                if(Object.keys(value.input_variables).length > 0) {
                    return (<Grid item xs={6} key={_key}>
                        <InputAccordion data={value}></InputAccordion>
                    </Grid>)
                }
            })
        } catch (e) {
            // version of data is likely wrong
            // should we delete this data automatically? 
            // for now just output an error. the user will have the ability to delete this record
            console.error('unable to display this data, likely an incorrect version of data')
            console.error(e)
        }
        
    };
    
  
    return ( 
        <>
            <Toolbar spacing={2}>
            <Stack direction="row" spacing={2}>
                {previousConfigs.length > 0 && 
                <>
                <InputLabel style={{paddingTop:"8px"}} id="previous-configs-label">Previous Configurations:</InputLabel>
                <FormControl sx={{ width: 200 }}>
                    {/* <InputLabel id="previous-configs-label">Previous Configs</InputLabel> */}
                    <Select
                    labelId="previous-configs-label"
                    id="previous-configs-select"
                    value={configName}
                    onChange={handleConfigSelection}
                    // MenuProps={MenuProps}
                    size="small"
                    >
                    {previousConfigs.map((name) => (
                        <MenuItem
                        key={name}
                        value={name}
                        // style={getStyles(name, personName, theme)}
                        >
                        {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </>
                }
                
                

                </Stack>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Stack direction="row" spacing={2}>
                    {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={()=>updateFlowsheetData(flowsheetData,"RESET")}>RESET ALL</Button> */}
                    <Button variant="outlined" startIcon={<SaveIcon />} onClick={()=>updateFlowsheetData(flowsheetData.inputData,null)}>SAVE</Button>
                    <Button variant="contained" onClick={()=>updateFlowsheetData(flowsheetData.inputData,"SOLVE")}>SOLVE</Button>
                    {configName.length > 0 &&
                    <Button variant="outlined" color="error" onClick={() => setOpenDeleteConfig(true)}>Delete</Button>
                    }
                </Stack>
            </Toolbar>

            <Grid container spacing={2} alignItems="flex-start">
                {
                    renderInputAccordions()
                }
            </Grid>
                <Modal
                    open={openDeleteConfig}
                    onClose={() => setOpenDeleteConfig(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Grid container sx={modalStyle} spacing={1}>
                        <Grid item xs={12}>
                            <Box justifyContent="center" alignItems="center" display="flex">
                                <p>Are you sure you want to delete {configName}?</p>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box justifyContent="center" alignItems="center" display="flex">
                                <Button onClick={() => handleDelete()} variant="contained" color="error">Delete</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Modal>
            <br/>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Stack direction="row" spacing={2}>
                    {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={()=>updateFlowsheetData(flowsheetData,"RESET")}>RESET ALL</Button> */}
                    <Button variant="outlined" startIcon={<SaveIcon />} onClick={()=>updateFlowsheetData(flowsheetData.inputData,null)}>SAVE</Button>
                    <Button variant="contained" onClick={()=>updateFlowsheetData(flowsheetData.inputData,"SOLVE")}>SOLVE</Button>
                </Stack>
            </Toolbar>
        </>
         
      
    );
  
}
 

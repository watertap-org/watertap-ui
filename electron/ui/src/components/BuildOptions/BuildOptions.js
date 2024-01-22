//import './Page.css';
import React from 'react'; 
import {useEffect, useState, Fragment } from 'react';
import { useParams } from "react-router-dom";
import { Button, Divider, Select, InputLabel, MenuItem, FormControl, Collapse, IconButton, Grid, Box, TextField } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { selectOption } from '../../services/flowsheet.service';


export default function BuildOptions(props) {
    let params = useParams(); 
    const { flowsheetData, tabValue, isBuilt, showBuildOptions, setShowBuildOptions, runBuildFlowsheet, setFlowsheetData } = props
    const [ optionsAreValid, setOptionsAreValid ] = useState({})
    const [ disableBuildButton, setDisableBuildButton ] = useState(false)

    useEffect(() => {
        let tempOptionsAreValid = {}
        for (let key of Object.keys(flowsheetData.inputData.build_options)) {
            tempOptionsAreValid[key] = true
        }
        setOptionsAreValid(tempOptionsAreValid)
    }, [])

    useEffect(() => {
        // console.log('options are valid: ')
        // console.log(optionsAreValid)
        let tempDisableBuildButton = false
        for (let each of Object.keys(optionsAreValid)) {
            if (!optionsAreValid[each]) tempDisableBuildButton = true
        }
        setDisableBuildButton(tempDisableBuildButton)
    }, [optionsAreValid])

    return ( 

    <Box>
        <div style={{display:"flex", justifyContent: "space-between"}} >
        <h3 style={{marginBottom: 5, marginTop:10}}>
            Model Options
            <IconButton disableRipple size="small" sx={{marginTop: -3, marginBottom: -3}} onClick={() => {setShowBuildOptions(!showBuildOptions)}}>
            {showBuildOptions ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
        </h3>
        </div>
        <Divider light sx={{marginBottom:"20px"}}/>
        <Collapse in={showBuildOptions} timeout={0}>
        <Grid container sx={{marginBottom: "50px"}}>
        {Object.entries(flowsheetData.inputData.build_options).map(([k,v]) => (
            <BuildOption 
                key={k} 
                v={v} 
                k={k} 
                params={params} 
                setFlowsheetData={setFlowsheetData} 
                flowsheetData={flowsheetData} 
                disabled={tabValue!==0}
                optionsAreValid={optionsAreValid}
                setOptionsAreValid={setOptionsAreValid}
            />
        ))}
        <Grid item xs={6}>
            <div style={{display:"flex"}}>
            <Button size="small" variant="contained" color="primary" sx={{marginLeft: 1}} onClick={runBuildFlowsheet} disabled={tabValue!==0 || disableBuildButton}>
                {isBuilt ? "Re-build Flowsheet" : "Build Flowsheet"}
            </Button>
            </div>
            
        </Grid>
        <Grid item xs={6}></Grid>
        </Grid>
        </Collapse>
    </Box>
      
    );
  
}
 
function BuildOption(props) {

    const { v, k, params, setFlowsheetData, flowsheetData, disabled, optionsAreValid, setOptionsAreValid } = props;
    
    const [ value,setValue] = useState(v.value)
    const [ isValid, setIsValid ] = useState(true)

    const formatOptionType = (option) => {
        try {
          return option.toString()
        } catch(e) {
          return option
        }
      }

      const handleValidity = (valid) => {
        setIsValid(valid)
        let tempOptionsAreValid = {...optionsAreValid}
        tempOptionsAreValid[k] = valid
        setOptionsAreValid(tempOptionsAreValid)
      }

      const handleUpdateValue = (event, type, min, max) => {
        let body
        setValue(event.target.value)
        if (type === "int") {
            let newVal
            if (isNaN(event.target.value) || event.target.value === "") {
                handleValidity(false)
                return
            } else {
                newVal = parseInt(event.target.value)
                if (newVal <= max && newVal >= min) {
                    handleValidity(true)
                    body = {option_name: event.target.name, new_option: newVal}
                } else {
                    handleValidity(false)
                    return
                }
                
            }
        }
        else if (type === "float") {
            let newVal
            if (isNaN(event.target.value) || event.target.value === "") {
                handleValidity(false)
                return
            } else {
                newVal = parseFloat(event.target.value)
                if (newVal <= max && newVal >= min) {
                    handleValidity(true)
                    body = {option_name: event.target.name, new_option: newVal}
                } else {
                    handleValidity(false)
                    return
                }
            }
        }
        else if (type === "string") {
            body = {option_name: event.target.name, new_option: event.target.value}
        } 
        else {
            body = {option_name: event.target.name, new_option: event.target.value}
        }
        selectOption(params.id, body)
        .then(response => response.json())
        .then((data)=>{
            console.log("selected option successfully:", data);
            setFlowsheetData({outputData:flowsheetData.outputData, inputData: data, name: data.name});
        }).catch((e) => {
            console.error('error selecting option: ',e)
        });
      }

    return (
        <Fragment key={k}>
            <Grid item xs={6}>
                {['int', 'float', 'string'].includes(v.values_allowed) ? 
                    <TextField
                        label={v.display_name}
                        fullWidth
                        placeholder={['int', 'float'].includes(v.values_allowed) ? `[${v.min_val}-${v.max_val}]` : ''}
                        id={v.values_allowed+"-input-"+k}
                        onChange={(e) => handleUpdateValue(e, v.values_allowed, v.min_val, v.max_val)}
                        value={value}
                        sx={{marginBottom: 2}}
                        name={k}
                        disabled={disabled}
                        error={!isValid}
                    />
                    :
                    <FormControl fullWidth sx={{marginBottom: 2}}>
                        <InputLabel id={`${k}_label`}>{v.display_name}</InputLabel>
                        <Select labelId={`${k}_label`} id={`${k}`} label={v.display_name} size="small" 
                            name={k}
                            sx={{textAlign: "left"}}
                            value={value}
                            onChange={handleUpdateValue}
                            disabled={disabled}
                        >
                        {v.values_allowed.map((va, idx) => (
                            <MenuItem key={idx} value={va}>{formatOptionType(va)}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                }
            </Grid>
            <Grid item xs={6}></Grid>
        </Fragment>
    )
}
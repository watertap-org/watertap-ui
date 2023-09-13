//import './Page.css';
import React from 'react'; 
import {useEffect, useState, Fragment } from 'react';
import { useParams } from "react-router-dom";
import { Button, Divider, Select, InputLabel, MenuItem, FormControl, Collapse, IconButton, Grid, Box } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { selectOption } from '../../services/flowsheet.service';


export default function BuildOptions(props) {
    let params = useParams(); 
    const { flowsheetData, tabValue, isBuilt, showBuildOptions, setShowBuildOptions, runBuildFlowsheet, setFlowsheetData } = props
    const [ options, setOptions ] = useState({})


    const formatOptionType = (option) => {
      try {
        return option.toString()
      } catch(e) {
        return option
      }
    }

    const handleSelect = (event) => {
        let body = {option_name: event.target.name, new_option: event.target.value}

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

    <Box>
        <div style={{display:"flex", justifyContent: "space-between"}} >
        <h3 style={{marginBottom: 5, marginTop:10}}>
            Build Options
            <IconButton disableRipple size="small" sx={{marginTop: -3, marginBottom: -3}} onClick={() => {setShowBuildOptions(!showBuildOptions)}}>
            {showBuildOptions ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
        </h3>
        </div>
        <Divider light sx={{marginBottom:"20px"}}/>
        <Collapse in={showBuildOptions} timeout="auto" unmountOnExit>
        <Grid container sx={{marginBottom: "50px"}}>
        {Object.entries(flowsheetData.inputData.options).map(([k,v]) => {
            return (
            <Fragment key={k}>
                <Grid item xs={6}>
                <FormControl fullWidth sx={{marginBottom: 2}}>
                    <InputLabel id={`${k}_label`}>{v.display_name}</InputLabel>
                    <Select labelId={`${k}_label`} id={`${k}`} label={v.display_name} size="small" 
                        name={k}
                        sx={{textAlign: "left"}}
                        value={v.value}
                        onChange={handleSelect}
                        disabled={tabValue!==0}
                    >
                    {v.display_values.map((va, idx) => (
                        <MenuItem key={idx} value={va}>{formatOptionType(va)}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={6}></Grid>
            </Fragment>
            )
        })}
        <Grid item xs={6}>
            <div style={{display:"flex"}}>
            <Button size="small" variant="contained" color="primary" sx={{marginLeft: 1}} onClick={runBuildFlowsheet} disabled={tabValue!==0}>
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
 

import React from 'react'; 
import {useEffect, useState} from 'react';
import { TextField, InputAdornment, Tooltip, Grid, MenuItem, FormControl, Select } from '@mui/material'
import { solve } from '../../services/output.service';

export default function InputWrapper(props) {
    const { fieldData, handleUpdateDisplayValue, handleUpdateFixed, handleUpdateBounds, handleUpdateSamples, solveType } = props;
    // const [ disabled, setDisabled ] = useState(false)
    const [value, setValue] = useState("");
    const [ showBounds, setShowBounds ] = useState(!fieldData.fixed)
    const [ isSweep, setIsSweep ] = useState(fieldData.is_sweep)
    const disabled = false

    useEffect(()=>{  
        if (fieldData.fixed === undefined) {
            fieldData.fixed = true
        } else if (!fieldData.fixed) {
            setShowBounds(true)
        }
    }, [fieldData]);

    useEffect(()=>{  
        // handleFixedChange({target: {name: fieldData.obj_key, value: false}})
        if (solveType === "solve" && fieldData.is_sweep) {
            fieldData.is_sweep = false
            handleUpdateFixed(fieldData.obj_key, false, "free")
        }
        
    }, [solveType]);

    const handleFieldChange = (event) => {
        setValue(event.target.value);
        fieldData.value = event.target.value;
        handleUpdateDisplayValue(event.target.id,event.target.value)
    };

    const handleFixedChange = (event) => {
        console.log(`updating fixed for ${event.target.name} with value ${event.target.value}`)
        let value
        if(event.target.value === "fixed") { 
            value = true
            setIsSweep(false)
        }
        else if(event.target.value === "free") {
            value = false
            setIsSweep(false)
        }
        else if(event.target.value === "sweep") {
            value = false
            fieldData.is_sweep = true
            setIsSweep(true)
            // add variable to sweep variables
        }
        // setDisabled(true)
        fieldData.fixed = value;
        handleUpdateFixed(event.target.name,value, event.target.value)

        // if (showBounds) {
        //     setShowBounds(!showBounds)
        //     setTimeout(() => {
        //         setShowBounds(!value)
        //     }, 1)
        // } else {
        setShowBounds(!value)
        // }
        
    };

    const handleBoundsChange = (event) => {
        let value = event.target.value;
        let name = event.target.name
        let bound = name.split("::")[1]
        let key = name.split("::")[0]
        if(!isNaN(value)) {
            if(value === "") {
                console.log(`updating ${bound} for ${key} with value ${null}`)
                fieldData[bound] = null
                handleUpdateBounds(key, null, bound)
            } else {
                console.log(`updating ${bound} for ${key} with value ${value}`)
                fieldData[bound] = value
                handleUpdateBounds(key, value, bound)
            }
        }
        
    };
    const handleSamplesChange = (event) => {
        let value = event.target.value;
        let name = event.target.name
        let key = name.split("::")[0]
        if(!isNaN(value)) {
            if(value === "") {
                console.log(`updating num_samples for ${key} with value ${null}`)
                fieldData.num_samples = null
                handleUpdateSamples(key, null)
            } else {
                console.log(`updating num_samples for ${key} with value ${value}`)
                fieldData.num_samples = value
                handleUpdateSamples(key, value)
            }
        }
        
    };

    // const handleShowBounds = () => {
    //     setShowBounds(!showBounds)
    // }

    const getVariableState = () => {
        if(isSweep) return "sweep"
        else if (fieldData.fixed) return "fixed"
        else return "free"
        // else if(!fieldData.fixed && fieldData.is_sweep) return "sweep"
    }


    const displayUnits = (d) => {
        let u = d.display_units
        // replace USD currency with simple '$'
        u = u.replace(/USD_[^/]*/, "$")
        u = u.replace(/USD/, "$")
        //console.log("displayUnits:", u)
        return {__html: u}
    }

    return  <Grid container>
                <Grid item xs={9}>
                <Tooltip title={fieldData.description}>
                    <TextField id={fieldData.obj_key} 
                            label={fieldData.name}
                            variant="outlined" 
                            size="small"
                            value={fieldData.value}
                            onChange={handleFieldChange}
                            fullWidth 
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                    <span dangerouslySetInnerHTML={displayUnits(fieldData)}>
                                    </span>
                                    </InputAdornment>
                            }}
                            disabled={fieldData.is_readonly ? true : disabled ? true : false}
                    />
                </Tooltip>
                </Grid>
                <Grid item xs={3}>
                <FormControl size="small" sx={{width:'80%'}}>
                    <Select
                        name={fieldData.obj_key} 
                        value={getVariableState()}
                        onChange={handleFixedChange}
                        // sx={{color:'#0b89b9', fontWeight: "bold"}}
                    >
                    <MenuItem key={true} value={"fixed"}>Fixed</MenuItem>
                    <MenuItem disabled={!fieldData.has_bounds || disabled} key={false} value={"free"}>Free</MenuItem>
                    {solveType === "sweep" && <MenuItem disabled={!fieldData.has_bounds || disabled} key={"sweep"} value={"sweep"}>Sweep</MenuItem>}
                    
                    </Select>
                </FormControl>
                </Grid>
                {/* <Grid item xs={1}>
                    <IconButton onClick={handleShowBounds}><ExpandIcon/></IconButton>
                </Grid> */}
                {
                    showBounds &&
                    <>
                        <Grid item xs={0.25}></Grid>
                        <Grid item xs={3} sx={{marginTop:1, marginBottom: 2}}> 
                        
                        <TextField id={'lower_bound'} 
                                name={`${fieldData.obj_key}::lb`} 
                                label={'Lower'}
                                variant="outlined" 
                                size="small"
                                defaultValue={fieldData.lb}
                                onChange={handleBoundsChange}
                                fullWidth 
                                disabled={disabled}
                        />
                        </Grid>
                        <Grid item xs={.25}>
                        </Grid>

                        <Grid item xs={3} sx={{marginTop:1, marginBottom: 2}}>
                        <TextField id={'upper_bound'} 
                                name={`${fieldData.obj_key}::ub`} 
                                label={'Upper'}
                                variant="outlined" 
                                size="small"
                                defaultValue={fieldData.ub}
                                onChange={handleBoundsChange}
                                fullWidth 
                                disabled={disabled}
                        />

                        </Grid>
                        <Grid item xs={0.25}></Grid>

                        {
                        // fieldData.is_sweep===true &&
                        isSweep &&
                        <>
                        <Grid item xs={3} sx={{marginTop:1, marginBottom: 2}}>
                            
                        <TextField id={'num_samples'} 
                                name={`${fieldData.obj_key}::num_samples`} 
                                label={'Num. samples'}
                                variant="outlined" 
                                size="small"
                                defaultValue={fieldData.num_samples}
                                onChange={handleSamplesChange}
                                fullWidth 
                                disabled={disabled}
                        />
                        
                        {/* <Typography variant="h6">
                            1000
                        </Typography> */}
                        </Grid>
                        <Grid item xs={0.3}></Grid>
                        </>}
                        
                    </>
                }
                
            </Grid>

}
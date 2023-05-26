import React from 'react'; 
import {useEffect, useState} from 'react';    
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function InputWrapper(props) {
    //"fs.feed.flow_vol[0.0]"
    const { fieldData, handleUpdateDisplayValue, handleUpdateFixed, handleUpdateBounds, handleUpdateSamples } = props;
    const [ disabled, setDisabled ] = useState(false)
    const [value, setValue] = useState("");
    const [ showBounds, setShowBounds ] = useState(!fieldData.fixed)

    useEffect(()=>{  
        if (fieldData.fixed === undefined) {
            fieldData.fixed = true
        } else if (!fieldData.fixed) {
            setShowBounds(true)
        }
    }, [fieldData]);

    const handleFieldChange = (event) => {
        setValue(event.target.value);
        fieldData.value = event.target.value;
        handleUpdateDisplayValue(event.target.id,event.target.value)
    };

    const handleFixedChange = (event) => {
        console.log(`updating fixed for ${event.target.name} with value ${event.target.value}`)
        let value
        if(event.target.value === "fixed") value = true
        else if(event.target.value === "free") value = false
        else if(event.target.value === "sweep") {
            value = false
            fieldData.is_sweep = true
            // add variable to sweep variables
        }
        // setDisabled(true)
        fieldData.fixed = value;
        handleUpdateFixed(event.target.name,value, event.target.value)
        setShowBounds(!value)
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

    const handleShowBounds = () => {
        setShowBounds(!showBounds)
    }

    const getVariableState = () => {
        if (fieldData.fixed) return "fixed"
        else if(!fieldData.fixed && !fieldData.is_sweep) return "free"
        else if(!fieldData.fixed && fieldData.is_sweep) return "sweep"
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
                    <MenuItem disabled={!fieldData.has_bounds || disabled} key={"sweep"} value={"sweep"}>Sweep</MenuItem>
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
                        fieldData.is_sweep===true &&
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
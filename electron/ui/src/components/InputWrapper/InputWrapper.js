import React from 'react'; 
import {useEffect, useState} from 'react';    
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandIcon from '@mui/icons-material/Expand';
import Typography from '@mui/material/Typography';

export default function InputWrapper(props) {

    const {fieldLabel, fieldData} = props;
    const [value, setValue] = useState("");
    const [ showBounds, setShowBounds ] = useState(false)
    const [ editBounds, setEditBounds ] = useState(false)
    const styles = {
        highlighted: {
            backgroundColor: '#F5F5F5',
            // paddingTop: 20,
            border: "15px solid #F5F5F5"
        },
        other: {
        }
    }

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
        props.handleUpdateDisplayValue(event.target.id,event.target.value)
    };

    const handleFixedChange = (event) => {
        console.log(`updating fixed for ${event.target.name} with value ${event.target.value}`)
        fieldData.fixed = event.target.value;
        props.handleUpdateFixed(event.target.name,event.target.value)
        setShowBounds(!event.target.value)
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
                props.handleUpdateBounds(key, null, bound)
            } else {
                console.log(`updating ${bound} for ${key} with value ${value}`)
                fieldData[bound] = value
                props.handleUpdateBounds(key, value, bound)
            }
        }
        
    };

    const handleShowBounds = () => {
        setShowBounds(!showBounds)
    }

    const handleEditBounds = () => {
        setEditBounds(!editBounds)
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
                            disabled={fieldData.is_readonly ? true : false}
                    />
                </Tooltip>
                </Grid>
                <Grid item xs={3}>
                <FormControl size="small" sx={{width:'80%'}}>
                    <Select
                        name={fieldData.obj_key} 
                        value={fieldData.fixed}
                        onChange={handleFixedChange}
                        // sx={{color:'#0b89b9', fontWeight: "bold"}}
                    >
                    <MenuItem key={true} value={true}>Fixed</MenuItem>
                    <MenuItem disabled={!fieldData.has_bounds} key={false} value={false}>Free</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
                {/* <Grid item xs={1}>
                    <IconButton onClick={handleShowBounds}><ExpandIcon/></IconButton>
                </Grid> */}
                {
                    showBounds &&
                    <>
                        <Grid item xs={1.2}></Grid>
                        <Grid item xs={4} sx={{marginTop:1, marginBottom: 2}}> 
                        <TextField id={'lower_bound'} 
                                name={`${fieldData.obj_key}::lb`} 
                                label={'Lower'}
                                variant="outlined" 
                                size="small"
                                defaultValue={fieldData.lb}
                                onChange={handleBoundsChange}
                                fullWidth 
                                disabled={!editBounds}
                        />
                        </Grid>
                        <Grid item xs={.5}>

                        </Grid>
                        <Grid item xs={4} sx={{marginTop:1, marginBottom: 2}}>
                        <TextField id={'upper_bound'} 
                                name={`${fieldData.obj_key}::ub`} 
                                label={'Upper'}
                                variant="outlined" 
                                size="small"
                                defaultValue={fieldData.ub}
                                onChange={handleBoundsChange}
                                fullWidth 
                                disabled={!editBounds}
                        />
                        {/* <Typography variant="h6">
                            1000
                        </Typography> */}
                        </Grid>
                        <Grid item xs={0.3}></Grid>
                        <Grid item xs={1} sx={{marginTop: 1}}>
                            <IconButton onClick={handleEditBounds}><EditIcon/></IconButton>
                        </Grid>
                    </>
                }
                
            </Grid>

}
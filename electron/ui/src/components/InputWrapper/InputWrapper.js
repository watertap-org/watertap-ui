




import React from 'react'; 
import {useEffect, useState} from 'react';    
import Container from '@mui/material/Container';  
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; 
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';

export default function InputWrapper(props) {

    const {fieldLabel, fieldData} = props;
    const [value, setValue] = useState("");

    useEffect(()=>{  
        //console.log("fieldData:", fieldData);
    }, [fieldData]);

    const handleFieldChange = (event) => {
        setValue(event.target.value);
        fieldData.value.value = event.target.value;
    };

    const displayUnits = (d) => {
        let u = d.display_units
        // replace USD currency with simple '$'
        u = u.replace(/USD_[^/]*/, "$")
        u = u.replace(/USD/, "$")
        //console.log("displayUnits:", u)
        return {__html: u}
    }

    return  <Tooltip title={fieldData.description}>
                <TextField id={"outlined-basic"+fieldData.display_name} 
                        label={fieldData.display_name}
                        variant="outlined" 
                        size="small"
                        value={fieldData.value.value}
                        onChange={handleFieldChange}
                        fullWidth 
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                <span dangerouslySetInnerHTML={displayUnits(fieldData)}>
                                </span>
                                </InputAdornment>
                        }}
                />
            </Tooltip>

}
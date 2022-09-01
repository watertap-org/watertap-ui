import React from 'react'; 
import {useEffect, useState} from 'react';    
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
        fieldData.value = event.target.value;
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
                <TextField id={"outlined-basic"+fieldData.name} 
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

}
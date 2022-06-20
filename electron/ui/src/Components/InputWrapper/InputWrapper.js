




import React from 'react'; 
import {useEffect, useState} from 'react';    
import Container from '@mui/material/Container';  
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; 
import TextField from '@mui/material/TextField';


export default function InputWrapper(props) {

    const {fieldData} = props;
    const [value, setValue] = useState("");

    useEffect(()=>{  
        console.log("fieldData:", fieldData);
    }, [fieldData]);

    const handleFieldChange = (event) => {
        setValue(event.target.value);
        fieldData.value.value = event.target.value;
    };

    return <TextField id="outlined-basic" 
                    label={fieldData.display_name}
                    variant="outlined" 
                    size="small"
                    value={fieldData.value.value}
                    onChange={handleFieldChange}
                    fullWidth />

}
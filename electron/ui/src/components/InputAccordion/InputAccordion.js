import React from 'react'; 
import {useEffect, useState} from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputWrapper from "../InputWrapper/InputWrapper";


export default function InputAccordion(props) {
    const { handleUpdateDisplayValue, handleUpdateFixed, handleUpdateBounds, handleUpdateSamples, data } = props;
    const [expanded1, setExpanded1] = useState('panel1'); 
    // const [value, setValue] = useState("");

    useEffect(()=>{  
        // console.log("DDD:",data);
    }, [data]);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
      setExpanded1(isExpanded ? panel : false);
    };

    // const handleFieldChange = (event) => {
    //     setValue(event.target.value);
    // };

    const renderFields = () => {
        return Object.keys(data.input_variables).map((key)=>{
            let vItem = data.input_variables[key];
            return <InputWrapper 
                        key={key} 
                        fieldData={vItem} 
                        handleUpdateDisplayValue={handleUpdateDisplayValue} 
                        handleUpdateFixed={handleUpdateFixed} 
                        handleUpdateBounds={handleUpdateBounds}
                        handleUpdateSamples={handleUpdateSamples}
                    />
            
        });
    };

    return (
        <Accordion expanded={expanded1 === 'panel1'} onChange={handleAccordionChange('panel1')} style={{border:"1px solid #ddd"}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            {data.display_name}
        </AccordionSummary>
        <AccordionDetails>
            {/*data.description*/}
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1 },
                }}
                autoComplete="off"
            >
            {
                renderFields()
            }
            </Box>
        </AccordionDetails>
        </Accordion>
    );

}
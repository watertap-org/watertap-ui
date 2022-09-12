 
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




export default function ConfigInput(props) {
    const { flowsheetData, updateFlowsheetData } = props;  
    // const [costingBlocks, setCostingBlocks] = useState({});
    // const [parametersBlocks, setParametersBlocks] = useState({}); 
    // const [inputBlocks, setInputBlocks] = useState({});

    useEffect(()=>{   

    }, [flowsheetData]);
 

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
        let var_sections = organizeVariables(flowsheetData.model_objects)
        return Object.entries(var_sections).map(([key, value])=>{
            let _key = key + Math.floor(Math.random() * 100001);
            if(Object.keys(value.input_variables).length > 0) {
                return (<Grid item xs={6} key={_key}>
                    <InputAccordion data={value}></InputAccordion>
                </Grid>)
            }
        })
    };
    
  
    return ( 
        <>
            <Toolbar spacing={2}>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={()=>updateFlowsheetData(flowsheetData,"RESET")}>RESET ALL</Button>
                    <Button variant="outlined" startIcon={<SaveIcon />} onClick={()=>updateFlowsheetData(flowsheetData,null)}>SAVE</Button>
                    <Button variant="contained" onClick={()=>updateFlowsheetData(flowsheetData,"SOLVE")}>SOLVE</Button>
                </Stack>
            </Toolbar>

            <Grid container spacing={2} alignItems="flex-start">
                {
                    renderInputAccordions()
                }
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={6}> 
                    {  /* 
                        Object.keys(costingBlocks).map((key)=><InputAccordion key={key} dataKey={key} data={costingBlocks[key]}></InputAccordion>)
                    */
                    }
                </Grid>
                <Grid item xs={6}>
                    { /*  
                        Object.keys(parametersBlocks).map((key)=><InputAccordion key={key} dataKey={key} data={parametersBlocks[key]}></InputAccordion>) 
                    */
                    }
                </Grid>
            </Grid>
            <br/>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={()=>updateFlowsheetData(flowsheetData,"RESET")}>RESET ALL</Button>
                    <Button variant="outlined" startIcon={<SaveIcon />} onClick={()=>updateFlowsheetData(flowsheetData,null)}>SAVE</Button>
                    <Button variant="contained" onClick={()=>updateFlowsheetData(flowsheetData,"SOLVE")}>SOLVE</Button>
                </Stack>
            </Toolbar>
        </>
         
      
    );
  
}
 

 
import React from 'react'; 
import {useEffect, useState, useContext} from 'react';    
import Container from '@mui/material/Container';  
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAccordion from "../../../components/InputAccordion/InputAccordion"; 
import Toolbar from '@mui/material/Toolbar';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';




export default function ConfigInput(props) {
    const { flowsheetData, updateFlowsheetData } = props;  
    const [costingBlocks, setCostingBlocks] = useState({});
    const [parametersBlocks, setParametersBlocks] = useState({}); 
    const [inputBlocks, setInputBlocks] = useState({});

    useEffect(()=>{   
        //splitData(flowsheetData); 
        //console.log("changed");
    }, [flowsheetData]);
 

    //separate blocks data into costing or parameters
    //is this not even used ??
    const splitData = (flowsheetData) => {
        let _costingBlocks = {};
        let _parametersBlocks = {};
        try 
        {
            let _inputBlocks = {};
            let b = flowsheetData.blocks.fs.blocks; 
            for(let key of Object.keys(b))
            { 
                //console.log("kkk:",key,b[key]);
                let variables = b[key].variables;
                for(let varItem of variables)
                {
                    if(varItem.hasOwnProperty("category"))
                    {

                    }
                }
                
            }
            console.log("blocks:",_costingBlocks, _parametersBlocks);
            setCostingBlocks(_costingBlocks);
            setParametersBlocks(_parametersBlocks);
        }
        catch {
            console.log("Error in split flowsheet data.");
        }

    };


    /**
     * Collect all variables from 'block' and its subblocks.
     *
     * @param Object Root block
     * @returns Object with a flattened map of variables
     */
    const extractVariables = (block) => {
        console.debug("extractVariables. block=", block.display_name)
        let bvars = { ...block.variables }  // shallow copy
        // iterate through subblocks
        for (const [_, subblock] of Object.entries(block.blocks)) {
            // add extracted values of each subblock to this one (recursively)
            let subv = extractVariables(subblock)
            for (const [key, value] of Object.entries(subv)) {
                bvars[key] = value
            }
        }
        console.debug("Block and subblock vars:", bvars)
        return bvars
    }

    /**
     * Organize variables into sections by their 'category' attribute.
     *
     * @returns Object {<category-name>: [list, of, variable, objects]}
     */
    const organizeVariables = (bvars) => {
        let var_sections = {}
        for (const [key, v] of Object.entries(bvars)) {
            console.debug("organizeVariables:map. variable=", key)
            let catg = v.category
            if (!Object.hasOwn(var_sections, catg)) {
                var_sections[catg] = {display_name: catg, variables: {}}
            }
            var_sections[catg]["variables"][key] = v
        }
        return var_sections
    }

    const renderInputAccordions = () => {
        console.debug("calling extractVariables with root block:", flowsheetData.blocks.fs)
        let variables = extractVariables(flowsheetData.blocks.fs)
        let var_sections = organizeVariables(variables)
        console.log("var_sections:", var_sections);

        //sort sections, put treatment and feed first
        let sortedSectionKeys = [];
        console.log("1sortedSectionKeys::",sortedSectionKeys);
        for(let key of Object.keys(var_sections))
        {
            if(key.toLowerCase() === "feed")
            {
                sortedSectionKeys.unshift(key)
            }
        }
        for(let key of Object.keys(var_sections))
        {
            if(key.toLowerCase() === "treatment specification")
            {
                sortedSectionKeys.unshift(key)
            }
        }
        for(let key of Object.keys(var_sections))
        {
            if(key.toLowerCase() !== "feed" && key.toLowerCase() !== "treatment specification")
            {
                sortedSectionKeys.push(key)
            }
        }
        console.log("2sortedSectionKeys::",sortedSectionKeys);
        // let sectionBlocks = flowsheetData.blocks.fs.blocks
        return sortedSectionKeys.map((key)=>{
            let _key = key + Math.floor(Math.random() * 100001);
            return (<Grid item xs={6} key={_key}>
                        <InputAccordion  dataKey={key} data={var_sections[key]}></InputAccordion>
                    </Grid>)
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
 

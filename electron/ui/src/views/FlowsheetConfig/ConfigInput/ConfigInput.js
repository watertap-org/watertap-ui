 
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
                        
                        
                        /*if(varItem.category==="costing")
                        {
                            _costingBlocks[key] = b[key];
                        }
                        else
                        {
                            _parametersBlocks[key] = b[key];
                        }*/
                    }
                }
                
            }

            console.log("blocks:",_costingBlocks, _parametersBlocks);
            setCostingBlocks(_costingBlocks);
            setParametersBlocks(_parametersBlocks);

            //===========
            //_costingBlocks.costing.variables.TIC.value.value=9999999999;
            //console.log("-----22222 blocks:",_costingBlocks);
            //console.log("-----22222 flowsheetData:",flowsheetData);
            //===========

        }
        catch {
            console.log("Error in split flowsheet data.");
        }

    };


    
    const renderInputAccordions = () => {
        let sectionBlocks = flowsheetData.blocks.fs.blocks;
        return Object.keys(sectionBlocks).map((key)=>{
            //console.log("key:",key);
            let _key = key + Math.floor(Math.random() * 100001);
            //console.log("_key:",_key);
            return (<Grid item xs={6} key={_key}>
                        <InputAccordion  dataKey={key} data={sectionBlocks[key]}></InputAccordion>
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
                    {   
                        Object.keys(costingBlocks).map((key)=><InputAccordion key={key} dataKey={key} data={costingBlocks[key]}></InputAccordion>)
                    }
                </Grid>
                <Grid item xs={6}> 
                    {   
                        Object.keys(parametersBlocks).map((key)=><InputAccordion key={key} dataKey={key} data={parametersBlocks[key]}></InputAccordion>) 
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
 

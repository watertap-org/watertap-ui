 
import React from 'react'; 
import {useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';  
import Alert from '@mui/material/Alert';


export default function ConfigOutput(props) {
    const { outputData } = props;   

    useEffect(()=>{   
         
    }, [outputData]);
 
    // renders the data in output accordions
    const renderFields = (fieldData) => {
        console.log("F:",fieldData);
        return Object.keys(fieldData).map((key)=>{ 
            let _key = key + Math.floor(Math.random() * 100001); 
            return (<div key={_key}>
                           <span>{key+" "}</span>
                           <span style={{color:"#68c3e4",fontWeight:"bold"}}>{fieldData[key][0]}</span>
                           <span>{" "+fieldData[key][1]}</span>
                    </div>)
        })
    };


    const renderOutputAccordions = () => { 
        if(!outputData.hasOwnProperty("output") || !outputData.output)
        {
            return (<Grid item xs={12} >
                        <Alert severity="info">No soluction found!</Alert>
                    </Grid>);
        }

        return Object.keys(outputData.output).map((key,index)=>{
            //console.log("O key:",key);
            let gridSize = 4;
            if(index===0)
                gridSize = 12;
            
            let _key = key + Math.floor(Math.random() * 100001); 
            return (<Grid item xs={gridSize} key={_key}>
                        <Accordion expanded={true} style={{border:"1px solid #ddd"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                {key}
                            </AccordionSummary>
                            <AccordionDetails>  
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1 },
                                    }}
                                    autoComplete="off"
                                >
                                {
                                    renderFields(outputData.output[key])
                                }
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>)
        })
    };
    
    return ( 
        <> 
            <Grid container spacing={2} alignItems="flex-start"> 
            {   
                renderOutputAccordions()
            }
            </Grid>
        </>
         
      
    );
  
}
 

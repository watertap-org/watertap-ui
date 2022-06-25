 
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';  



export default function ConfigOutput(props) {
    const { outputData } = props;   

    useEffect(()=>{   
         
    }, [outputData]);
 
 
    const renderOutputAccordions = () => { 
        return Object.keys(outputData).map((key)=>{
            console.log("key:",key);
            let _key = key + Math.floor(Math.random() * 100001);
            console.log("_key:",_key);
            return (<Grid item xs={12} key={_key}>
                            <Accordion style={{border:"1px solid #ddd"}}>
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
                                        //renderFields()
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
 

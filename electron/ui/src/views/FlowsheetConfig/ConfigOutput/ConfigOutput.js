 
import React from 'react'; 
import {useEffect, useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';  
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


export default function ConfigOutput(props) {
    const { currData, historyData } = props;
    const [currDataIndex, setDataIndex]  = useState(historyData.length-1)
    const [outputData, setOutputData] = useState(props.outputData)
    useEffect(()=>{   
        console.log('in use effect currData = ')
        console.log(outputData)
    }, [outputData]);

    const handleHistorySelection = (event) => {
        console.log('in handlehistory = ')
        console.log(outputData)
        console.log('selecting history# ')
        setDataIndex(event.target.value)
        setOutputData(historyData[event.target.value])
    }
 
    const renderHistorySelect = () => {
        return <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Past Runs</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currDataIndex}
                label="Past Runs"
                onChange={handleHistorySelection}
            >
                {historyData.map((value, index) => {
                    return <MenuItem value={index}>{index}</MenuItem>
                })}
            </Select>
        </FormControl>
    }

    // renders the data in output accordions
    const renderFields = (fieldData) => {
        // console.log("F:",fieldData);
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
            <Grid item xs={6}>{
                
                renderHistorySelect()
                
            }</Grid>
            {   
                renderOutputAccordions()
            }
            </Grid>
        </>
         
      
    );
  
}
 

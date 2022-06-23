//import './Page.css';
import React from 'react'; 
import {useEffect, useState, useContext} from 'react';   
import { useParams } from "react-router-dom";
import { getFlowsheet } from "../../services/flowsheet.service"; 
import Container from '@mui/material/Container';
import Graph from "../../components/Graph/Graph";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ConfigInput from "./ConfigInput/ConfigInput";
import Alert from '@mui/material/Alert';
import SolveDialog from "../../components/SolveDialog/SolveDialog"; 

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function FlowsheetConfig() {
  
    let params = useParams(); 
    const [flowsheetData, setFlowsheetData] = useState(null); 
    const [tabValue, setTabValue] = useState(0);
    const [title, setTitle] = useState("");
    const [solveDialogOpen, setSolveDialogOpen] = useState(false);
    const [outputData, setOutputData] = useState(null);

    useEffect(()=>{ 
      //console.log("params.id",params.id);
      if( !params.hasOwnProperty("id") || !params.id)
        return;

      getFlowsheet(params.id)
      .then((data)=>{
        console.log("Flowsheet Data:", data);
        setFlowsheetData(data);
        setTitle(getTitle(data));
        //setContexFlowsheetData(data);
      });
    }, [params.id]);


    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };

    
    const getTitle = (data) => {
      try{
        let v = data.blocks.fs.display_name;
        if(v)
          return v;
        else
          return "";
      }
      catch{
        return "";
      }
    };


    //send updated flowsheet data
    const updateFlowsheetData = (data, solve) => {
      console.log(">main updateFlowsheetData:",data);
      if(solve==="SOLVE")
      {
        setSolveDialogOpen(true);
      }
    };
  

    const handleSolved = (data) => {
      console.log("handle solved.....",data);
      setOutputData(data);
      setTabValue(1);
      setSolveDialogOpen(false);
    };


    return ( 
      <Container>
      {(flowsheetData) ? (
        
        <>
          <h2 style={{textAlign:"left"}}>
          {title}
          </h2>

          <Graph/>

          <Box sx={{ width: '100%', border: '0px solid #ddd' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Input" {...a11yProps(0)} />
              <Tab label="Output" {...a11yProps(1)} /> 
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <ConfigInput flowsheetData={flowsheetData} 
                          updateFlowsheetData={updateFlowsheetData}>
              </ConfigInput>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <div style={{textAlign:"left"}} dangerouslySetInnerHTML={{ __html: outputData}} />
            </TabPanel> 
          </Box>
        </>
        )
        :
        (
          <Box>
            <Alert severity="error">No data found!</Alert>
          </Box>
        )
      }  
      <SolveDialog open={solveDialogOpen} handleSolved={handleSolved} flowsheetData={flowsheetData}></SolveDialog>
      </Container>  
      
    );
  
}
 

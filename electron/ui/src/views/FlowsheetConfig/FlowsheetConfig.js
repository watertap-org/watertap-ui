//import './Page.css';
import React from 'react'; 
import {useEffect, useState} from 'react';   
import { useParams } from "react-router-dom";
import { getFlowsheet } from "../../services/flowsheet.service"; 
import Container from '@mui/material/Container';
import Graph from "../../components/Graph/Graph";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


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
    const [project, setProject] = useState(null); 
    const [tabValue, setTabValue] = useState(0);


    useEffect(()=>{ 
      getFlowsheet(params.projectId)
      .then((data)=>{
        console.log("Project:", data);
          setProject(data);
      });
    }, [params.projectId]);


    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
    
  
    return (
      <Container>
        <h2 style={{textAlign:"left"}}>
        {(project) &&
          <>{project.projectName + params.id}</> 
        }  
        </h2>


        <Graph/>

        <Box sx={{ width: '100%', border: '0px solid #ddd' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Input" {...a11yProps(0)} />
          <Tab label="Output" {...a11yProps(1)} /> 
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          IN
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          OUT
        </TabPanel> 
        </Box>
 
      </Container> 
      
    );
  
}
 

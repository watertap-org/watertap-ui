//import './Page.css';
import React from 'react'; 
import {useEffect, useState } from 'react';   
import { useParams, useNavigate } from "react-router-dom";
import { getFlowsheet, saveFlowsheet, resetFlowsheet } from "../../services/flowsheet.service"; 
import Container from '@mui/material/Container';
import Graph from "../../components/Graph/Graph";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ConfigInput from "./ConfigInput/ConfigInput";
import ConfigOutput from "./ConfigOutput/ConfigOutput";
import Alert from '@mui/material/Alert';
import SolveDialog from "../../components/SolveDialog/SolveDialog"; 
import Snackbar from '@mui/material/Snackbar';
import ConfigOutputComparisonTable from './ConfigOutput/OutputComparisonTable'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog'; 
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent'; 
import CircularProgress from '@mui/material/CircularProgress';


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
    let navigate = useNavigate();
    let params = useParams(); 
    const [flowsheetData, setFlowsheetData] = useState(null); 
    const [loadingFlowsheetData, setLoadingFlowsheetData] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [title, setTitle] = useState("");
    const [solveDialogOpen, setSolveDialogOpen] = useState(false);
    const [outputData, setOutputData] = useState(null);
    const [pastConfigs, setPastConfigs] = useState(null)
    const [openSuccessSaveConfirmation, setOpenSuccessSaveConfirmation] = React.useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")


    useEffect(()=>{ 
      //console.log("params.id",params.id);
      if( !params.hasOwnProperty("id") || !params.id)
        return;

      getFlowsheet(params.id)
      .then(response => response.json())
      .then((data)=>{
        console.log("Flowsheet Data:", data);
        setLoadingFlowsheetData(false)
        setFlowsheetData(data);
        setTitle(getTitle(data)); 
      }).catch((e) => {
        console.error('error getting flowsheet: ',e)
        // return to list page?
        navigateHome(e)
      });
    }, [params.id]);

    const navigateHome = (e) => {
      navigate("/", {replace: true, state:{error:e}})
    }

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
      else if(solve===null)
      {
        handleSave(data);
      }
      else if(solve==="RESET")
      {
        handleReset();
      }
    };

    const handleSolved = (data) => {
      console.log("handle solved.....",data);
      // data = data[data.length - 1]
      
      setOutputData({name: data.name, data: data});
      
      if(data.hasOwnProperty("input") && data.input)
      {console.log("iiiiiiii:",data.input);
        setFlowsheetData(data.input);
      }

      setTabValue(1);
      setSolveDialogOpen(false);
    };

    const handleError = (msg) => {
      console.log("handle error");
      setErrorMessage(msg)
      setOpenErrorMessage(true);
      setSolveDialogOpen(false);
    };

    const handleSave = (data) => {
      console.log("handle save.....",data);
      saveFlowsheet(params.id, data)
      .then(response => response.json())
      .then((data)=>{
        console.log("new Flowsheet Data:", data); 
        setOpenSuccessSaveConfirmation(true);
      });
    };


    const handleSuccessSaveConfirmationClose = () => {
      setOpenSuccessSaveConfirmation(false);
    };

    const handleErrorClose = () => {
      setOpenErrorMessage(false);
    };

    const handleReset = () => {
      console.log("reset. id:", params.id)
      resetFlowsheet(params.id)
      .then(response => response.json())
      .then((data)=>{
        console.log("reset Flowsheet:", data)
        setFlowsheetData(data)
      })
    }


    return ( 
      <Container>
      {(loadingFlowsheetData) ? 
          (
            <Dialog open={loadingFlowsheetData} fullWidth={true} maxWidth="md">
              <DialogTitle></DialogTitle>
              <DialogContent>  
              <div style={{display:"flex", alignItems: "center", justifyContent: "center", gap:"10px"}}>
                  <CircularProgress /> <h3>Building flowsheet...</h3>
              </div>
              </DialogContent>
              <DialogActions></DialogActions>
          </Dialog>
          )
          :
          (
          <>
            <h2 style={{textAlign:"left"}}>
            {title}
            </h2>

            <Graph/>

            <Box sx={{ width: '100%', border: '0px solid #ddd' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Input" {...a11yProps(0)} />
                <Tab label="Output" disabled={!outputData} {...a11yProps(1)} /> 
                <Tab label="Compare" disabled={!outputData} {...a11yProps(2)} /> 
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <ConfigInput flowsheetData={flowsheetData} 
                            updateFlowsheetData={updateFlowsheetData}>
                </ConfigInput>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <ConfigOutput outputData={outputData}  setPastConfigs={setPastConfigs}>
                </ConfigOutput>
              </TabPanel> 
              <TabPanel value={tabValue} index={2}>
                <ConfigOutputComparisonTable outputData={outputData}>
                </ConfigOutputComparisonTable>
              </TabPanel> 
            </Box>
          </>
          )
      }  
      <SolveDialog open={solveDialogOpen} handleSolved={handleSolved} handleError={handleError} flowsheetData={flowsheetData} id={params.id}></SolveDialog>
      <Snackbar
        open={openSuccessSaveConfirmation}
        autoHideDuration={2000} 
        onClose={handleSuccessSaveConfirmationClose}
        message="Changes saved!" 
      />
      <Snackbar open={openErrorMessage} autoHideDuration={3000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      </Container>  
      
    );
  
}
 

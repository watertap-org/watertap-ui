//import './Page.css';
import React from 'react'; 
import {useEffect, useState } from 'react';   
import { useParams, useNavigate } from "react-router-dom";
import { getFlowsheet, saveFlowsheet, resetFlowsheet } from "../../services/flowsheet.service"; 
import { ToggleButton, ToggleButtonGroup, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material'
import { Typography, CircularProgress, Tabs, Tab, Box, Grid, Container, Snackbar, Stack } from '@mui/material';
import Graph from "../../components/Graph/Graph";
import ConfigInput from "./ConfigInput/ConfigInput";
import ConfigOutput from "./ConfigOutput/ConfigOutput";
import SolveDialog from "../../components/SolveDialog/SolveDialog"; 
import ErrorBar from "../../components/ErrorBar/ErrorBar";
import ConfigOutputComparisonTable from './ConfigOutput/OutputComparisonTable'


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
    const [flowsheetData, setFlowsheetData] = useState({inputData:{}, outputData:null}); 
    const [loadingFlowsheetData, setLoadingFlowsheetData] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [title, setTitle] = useState("");
    const [solveDialogOpen, setSolveDialogOpen] = useState(false);
    const [ sweep, setSweep ] = useState(true)
    // const [outputData, setOutputData] = useState(null);
    const [openSuccessSaveConfirmation, setOpenSuccessSaveConfirmation] = React.useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [ solveType, setSolveType ] = useState("solve")

    useEffect(()=>{ 
      //console.log("params.id",params.id);
      if( !params.hasOwnProperty("id") || !params.id)
        return;

      getFlowsheet(params.id)
      .then(response => response.json())
      .then((data)=>{
        console.log("Flowsheet Data:", data);
        setLoadingFlowsheetData(false)
        setFlowsheetData({outputData:null, inputData: data, name: data.name});
        setTitle(getTitle(data)); 
      }).catch((e) => {
        console.error('error getting flowsheet: ',e)
        navigateHome(e)
      });
    }, [params.id]);

    const navigateHome = (e) => {
      navigate("/flowsheets", {replace: true, state:{error:e}})
    }

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };

    
    const getTitle = (data) => {
      try{
        let v = data.name;
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
      if(solve==="solve")
      { 
        setSolveDialogOpen(true);
        setSweep(false)
      } 
      else if(solve==="sweep")
      {
        //check if sweep variables all have lower and upper bounds
        let goodToGo = true
        for (let each of Object.entries(data.model_objects)) {
          if(each[1].is_sweep) {
            if(each[1].ub === null || each[1].lb === null) goodToGo=false
          }
        }
        if(goodToGo) {
          setSolveDialogOpen(true);
          setSweep(true);
        } else {
          handleError('please provide a lower and upper bound for all sweep variables')
        }
        
      }
      else if(solve===null)
      {
        handleSave(data.inputData);
      }
      else if(solve=== "UPDATE_CONFIG"){
        setFlowsheetData(data)
        handleSave(data.inputData);
      }
    };

    const handleSolved = (data) => {
      console.log("handle solved.....",data);
      let tempFlowsheetData = {...flowsheetData}
      tempFlowsheetData.outputData = data
      setFlowsheetData(tempFlowsheetData);
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
      .then(response => {
        if(response.status === 200) {
          response.json()
          .then((data)=>{
            console.log("new Flowsheet Data:", data); 
            let tempFlowsheetData = {...flowsheetData}
            tempFlowsheetData.inputData = data
            setFlowsheetData(tempFlowsheetData)
            // setOpenSuccessSaveConfirmation(true);
          });
        } else if(response.status === 400) {
          console.error("error saving data")
          handleError("Infeasible data, configuration not saved")
        }
        
      })
        
    };

    const handleSuccessSaveConfirmationClose = () => {
      setOpenSuccessSaveConfirmation(false);
    };

    const handleErrorClose = () => {
      setOpenErrorMessage(false);
    };

    const reset = () => {
      setLoadingFlowsheetData(true)
      resetFlowsheet(params.id)
      .then(response => response.json())
      .then((data)=>{
        // console.log("Reset flowsheet Data:", data);
        setLoadingFlowsheetData(false)
        setFlowsheetData({outputData:null, inputData: data, name: data.name});
        setTitle(getTitle(data)); 
      }).catch((e) => {
        console.error('error getting flowsheet: ',e)
        navigateHome(e)
      });
    }

    const handleToggleSolveType = (event, nextType) => {
      setSolveType(nextType)
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
            <Grid container>
                <Grid item xs={6}>
                    <Box justifyContent="left" display="flex">
                    <h2 style={{marginTop:10, marginBottom: 6}}>
                      {title}
                    </h2>
                    </Box>
                </Grid>
                {(tabValue === 0 || tabValue === 1) && 
                <Grid item xs={6}>
                  <Box justifyContent="right" display="flex">
                  <Typography style={{marginTop:15}}>
                      DEGREES OF FREEDOM: {flowsheetData.inputData.dof}
                  </Typography>
                  </Box>
              </Grid>
                } 
                
            </Grid>

            <Graph/>

            <Box sx={{ width: '100%', border: '0px solid #ddd' }}>

              
                <Grid container>
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="left"
                    alignItems="left"
                    spacing={2}
                  >
                    <ToggleButtonGroup
                        orientation="horizontal"
                        value={solveType}
                        exclusive
                        onChange={handleToggleSolveType}
                        disabled={tabValue!==0}
                    >
                        <ToggleButton value="solve" aria-label="solve">
                        <Typography>Solve</Typography>
                        </ToggleButton>
                        <ToggleButton value="sweep" aria-label="sweep">
                        <Typography>Sweep</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                  
                  </Grid>
                  <Grid item xs={12}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="process tabs">
                    <Tab label="Input" {...a11yProps(0)} />
                    <Tab label="Output" disabled={!flowsheetData.outputData} {...a11yProps(1)} /> 
                    {solveType === "solve" && <Tab label="Compare" disabled={!flowsheetData.outputData} {...a11yProps(2)} /> }
                  </Tabs>
                  </Grid>

                </Grid>
              
              <TabPanel value={tabValue} index={0}>
                <ConfigInput flowsheetData={flowsheetData} 
                            updateFlowsheetData={updateFlowsheetData}
                            reset={reset}
                            solveType={solveType}
                            >
                </ConfigInput>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <ConfigOutput outputData={flowsheetData} updateFlowsheetData={updateFlowsheetData} isSweep={sweep} solveType={solveType}>
                </ConfigOutput>
              </TabPanel> 
              <TabPanel value={tabValue} index={2}>
                <ConfigOutputComparisonTable outputData={flowsheetData}>
                </ConfigOutputComparisonTable>
              </TabPanel> 
            </Box>
          </>
          )
      }  
      <SolveDialog open={solveDialogOpen} handleSolved={handleSolved} handleError={handleError} flowsheetData={flowsheetData} id={params.id} isSweep={sweep}></SolveDialog>
      <Snackbar
        open={openSuccessSaveConfirmation}
        autoHideDuration={2000} 
        onClose={handleSuccessSaveConfirmationClose}
        message="Changes saved!" 
      />
      <ErrorBar 
        open={openErrorMessage} 
        duration={3000}
        handleErrorClose={handleErrorClose}
        severity={"error"}
        errorMessage={errorMessage}
      />
      </Container>  
      
    );
  
}
 

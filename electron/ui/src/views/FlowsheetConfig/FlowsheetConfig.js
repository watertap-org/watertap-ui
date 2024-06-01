//import './Page.css';
import React from 'react';
import {useEffect, useState} from 'react';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {
    getFlowsheet,
    saveFlowsheet,
    resetFlowsheet
} from "../../services/flowsheet.service";
import {Dialog, DialogTitle, DialogActions, DialogContent} from '@mui/material'
import {
    Typography,
    CircularProgress,
    Tabs,
    Tab,
    Box,
    Grid,
    Container,
    Snackbar
} from '@mui/material';
import Graph from "../../components/Graph/Graph";
import ConfigInput from "./ConfigInput/ConfigInput";
import ConfigOutput from "./ConfigOutput/ConfigOutput";
import SolveDialog from "../../components/SolveDialog/SolveDialog";
import ErrorBar from "../../components/ErrorBar/ErrorBar";
import ConfigOutputComparisonTable from './ConfigOutput/OutputComparisonTable'
import BuildOptions from '../../components/BuildOptions/BuildOptions';

/* Some utility functions */
export const getInputs = (flowsheetData) => flowsheetData.inputData.exports;
export const getOutputs = (flowsheetData) => flowsheetData.outputData.exports;
export const emptyOrNullObj = (o) => {
    try {
        return (Object.keys(o).length === 0);
    } catch (e) {
        return true;
    }
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
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

export default function FlowsheetConfig(props) {
    let navigate = useNavigate();
    let params = useParams();
    const location = useLocation();
    const [flowsheetData, setFlowsheetData] = useState({
        inputData: {},
        outputData: null
    });
    const [loadingFlowsheetData, setLoadingFlowsheetData] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [title, setTitle] = useState("");
    const [solveDialogOpen, setSolveDialogOpen] = useState(false);
    const [sweep, setSweep] = useState(true)
    // const [outputData, setOutputData] = useState(null);
    const [openSuccessSaveConfirmation, setOpenSuccessSaveConfirmation] = React.useState(false);
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [solveType, setSolveType] = useState("solve")
    const [analysisName, setAnalysisName] = useState("")
    const [isBuilt, setIsBuilt] = useState(false)
    const [showBuildOptions, setShowBuildOptions] = useState(false)
    const theme = props.theme;
    console.log("flowsheet config theme=", theme);

    useEffect(() => {
        console.log("params.id", params.id);
        if (!params.hasOwnProperty("id") || !params.id)
            return;
        // gotta find a way to figure out whether to build or not
        let to_build = 1
        try {
            // 4 possibilities
            // hasoptions AND built -> dont build, dont show build options
            // hasoptions and !build -> dont build, show build options
            // !hasoptions and built -> dont build, dont show build options
            // !hasoptions and !built -> build, dont show build options
            if (location.state.built) to_build = 0
            else if (location.state.hasOptions) {
                to_build = 0
                setShowBuildOptions(true)
            }
        } catch (e) {
            console.log('unable to check for built status; defaulting to build flowsheet')
        }
        getFlowsheet(params.id, to_build)
            .then(response => response.json())
            .then((data) => {
                // console.log("Flowsheet Data:", data);
                setLoadingFlowsheetData(false)
                setFlowsheetData({outputData: null, inputData: data, name: data.name});
                setTitle(getTitle(data));
            }).catch((e) => {
            console.error('error getting flowsheet: ', e)
            navigateHome(e)
        });
    }, [params.id]);

    useEffect(() => {
        console.info("Check/set whether flowsheet is built");
        const inputs = getInputs(flowsheetData);
        if (!emptyOrNullObj(inputs)) {
            console.log('flowsheet is indeed built');
            setIsBuilt(true);
        }
    }, [flowsheetData])

    useEffect(() => {
        if (tabValue !== 0) setShowBuildOptions(false)

    }, [tabValue])

    const runBuildFlowsheet = () => {
        setLoadingFlowsheetData(true)
        getFlowsheet(params.id, 1)
            .then(response => response.json())
            .then((data) => {
                // console.log("Flowsheet Data:", data);
                setLoadingFlowsheetData(false)
                setFlowsheetData({outputData: null, inputData: data, name: data.name});
                setTitle(getTitle(data));
            }).catch((e) => {
            console.error('error getting flowsheet: ', e)
            navigateHome(e)
        });
    }

    const navigateHome = (e) => {
        navigate("/flowsheets", {replace: true, state: {error: e}})
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    const getTitle = (data) => {
        try {
            let v = data.name;
            if (v)
                return v;
            else
                return "";
        } catch {
            return "";
        }
    };

    //send updated flowsheet data
    const updateFlowsheetData = (data, solve) => {
        switch (solve) {
            case "solve":
                setSolveDialogOpen(true);
                setSweep(false);
                break;
            case "sweep":
                // check if sweep variables all have lower and upper bounds
                let goodToGo = true;
                for (let each of Object.entries(data.exports)) {
                    if (each[1].is_sweep) {
                        if (each[1].ub === null || each[1].lb === null) goodToGo = false
                    }
                }
                if (goodToGo) {
                    setSolveDialogOpen(true);
                    setSweep(true);
                } else {
                    handleError('please provide a lower and upper bound for all sweep variables')
                }
                break;
            case "UPDATE_CONFIG":
                // setFlowsheetData(data)
                handleSave(data.inputData, true);
                break;
            case null:
                handleSave(data.inputData, false);
                break;
            default:
                console.error("updateFlowsheetData: no action for solve=", solve);
        }
    }

    const handleSolved = (data) => {
        // console.log("handle solved.....",data);
        let tempFlowsheetData = {...flowsheetData}
        tempFlowsheetData.outputData = data
        setFlowsheetData(tempFlowsheetData);
        setTabValue(1);
        setSolveDialogOpen(false);
    }

    const handleError = (msg) => {
        // console.log("handle error");
        setErrorMessage(msg)
        setOpenErrorMessage(true);
        setSolveDialogOpen(false);
    }

    const handleSave = (data, update) => {
        // console.log("handle save.....",data);
        saveFlowsheet(params.id, data)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then((data) => {
                            // console.log("new Flowsheet Data:", data);
                            let tempFlowsheetData = {...flowsheetData}
                            tempFlowsheetData.inputData = data
                            if (update) {
                                console.log("SETTING FLOWSHEET DATA")
                                setFlowsheetData(tempFlowsheetData)
                            }

                            // setOpenSuccessSaveConfirmation(true);
                        });
                } else if (response.status === 400) {
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
            .then((data) => {
                // console.log("Reset flowsheet Data:", data);
                setLoadingFlowsheetData(false)
                setFlowsheetData({outputData: null, inputData: data, name: data.name});
                setTitle(getTitle(data));
            }).catch((e) => {
            console.error('error getting flowsheet: ', e)
            navigateHome(e)
        });
    }

    const handleSelectSolveType = (event) => {
        setSolveType(event.target.value)
    }

    const handleToggleSolveType = (event, nextType) => {
        setSolveType(nextType)
    }

    const handleChangeAnalysisName = (event) => {
        let newName = event.target.value
        setAnalysisName(newName)
    }

    const handleSaveConfiguration = () => {
        if (analysisName.length > 0) {

        } else {
            setOpenErrorMessage(true)
            setErrorMessage("Please provide a name for analysis.")
        }
    }

    const formatOptionType = (option) => {
        try {
            return option.toString()
        } catch (e) {
            return option
        }
    }

    console.log("Returning container for FlowsheetConfig. build_options=", flowsheetData.inputData.build_options, "isBuilt=", isBuilt,
        "loadingFlowsheetData=", loadingFlowsheetData);
    return (
        <Container>
            {(loadingFlowsheetData) ?
                (
                    <Dialog open={loadingFlowsheetData} fullWidth={true} maxWidth="md">
                        <DialogTitle></DialogTitle>
                        <DialogContent>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}>
                                <CircularProgress/> <h3>Building flowsheet...</h3>
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
                                    <h2 style={{marginTop: 10, marginBottom: 6}}>
                                        {title}
                                    </h2>
                                </Box>
                            </Grid>
                            {(tabValue === 0 || tabValue === 1) &&
                                <Grid item xs={6}>
                                    <Box justifyContent="right" display="flex">
                                        <Typography style={{marginTop: 15}}>
                                            DEGREES OF
                                            FREEDOM: {flowsheetData.inputData.dof}
                                        </Typography>
                                    </Box>
                                </Grid>
                            }

                        </Grid>

                        <Graph/>

                        <Box sx={{width: '100%', border: '0px solid #ddd'}}>

                            {/* build options component */}
                            {flowsheetData.inputData.build_options && Object.keys(flowsheetData.inputData.build_options).length > 0 &&
                                <BuildOptions
                                    flowsheetData={flowsheetData}
                                    tabValue={tabValue}
                                    isBuilt={isBuilt}
                                    showBuildOptions={showBuildOptions}
                                    setShowBuildOptions={setShowBuildOptions}
                                    runBuildFlowsheet={runBuildFlowsheet}
                                    setFlowsheetData={setFlowsheetData}
                                >

                                </BuildOptions>
                            }


                            {isBuilt &&

                                <Box>
                                    <Grid container>
                                        <Grid item xs={12}>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <div style={{
                                                backgroundColor: theme.tabs.background,
                                                color: theme.tabs.color
                                            }}>
                                                <Tabs value={tabValue}
                                                      onChange={handleTabChange}
                                                      aria-label="process tabs" centered
                                                      textColor='inherit'
                                                      TabIndicatorProps={{style: {background: '#727272'}}}
                                                >
                                                    <Tab
                                                        label="Input" {...a11yProps(0)} />
                                                    <Tab label="Output"
                                                         disabled={!flowsheetData.outputData} {...a11yProps(1)} />
                                                    {solveType === "solve" &&
                                                        <Tab label="Compare"
                                                             disabled={!flowsheetData.outputData} {...a11yProps(2)} />}
                                                </Tabs>
                                            </div>

                                        </Grid>

                                    </Grid>

                                    <TabPanel value={tabValue} index={0} theme={theme}>
                                        <ConfigInput
                                            theme={theme}
                                            flowsheetData={flowsheetData}
                                            updateFlowsheetData={updateFlowsheetData}
                                            reset={reset}
                                            solveType={solveType}
                                            handleSelectSolveType={handleSelectSolveType}
                                            numberOfSubprocesses={props.numberOfSubprocesses}
                                            setNumberOfSubprocesses={props.setNumberOfSubprocesses}
                                        >
                                        </ConfigInput>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <ConfigOutput outputData={flowsheetData}
                                                      updateFlowsheetData={updateFlowsheetData}
                                                      isSweep={sweep}
                                                      solveType={solveType}>
                                        </ConfigOutput>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2}>
                                        <ConfigOutputComparisonTable
                                            outputData={flowsheetData}>
                                        </ConfigOutputComparisonTable>
                                    </TabPanel>
                                </Box>
                            }
                        </Box>
                    </>
                )
            }
            <SolveDialog open={solveDialogOpen} handleSolved={handleSolved}
                         handleError={handleError} flowsheetData={flowsheetData}
                         id={params.id} isSweep={sweep}></SolveDialog>
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
 

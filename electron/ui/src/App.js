import './App.css';
import React, {useEffect, useState} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// MUI spinner
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {Container} from '@mui/material';
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import Header from './components/Boilerplate/Header/Header';
import SplashPage from './views/SplashPage/SplashPage';
import FlowsheetsList from './views/FlowsheetsList/FlowsheetsList';
import FlowsheetConfig from './views/FlowsheetConfig/FlowsheetConfig';
import {getFlowsheetsList} from "./services/flowsheetsList.service";
import {getProjectName} from './services/projectName.service';
import {themes} from './theme';

function App() {
    let navigate = useNavigate();
    const [loadLandingPage, setLoadLandingPage] = useState(1);
    const [hasFlowsheetsList, setHasFlowsheetsList] = useState(false);
    const [hasTheme, setHasTheme] = useState(false);
    const [numberOfSubprocesses, setNumberOfSubprocesses] = useState({})
    const [theme, setTheme] = useState(null);

    console.log("App hasTheme = ",hasTheme);

    useEffect(() => {
        // Set the theme
        if (!hasTheme) {
            getProjectName().then((name) => {
                console.log("setting theme: name=", name, "value=", themes[name]);
                setTheme(themes[name]);
                setHasTheme(true);
                console.debug("app set theme =", theme);
            })
        }

        // Get list of flowsheets
        if (!hasFlowsheetsList) {
            getFlowsheetsList()
                .then((data) => {
                    console.log("got flowsheets list")
                    setHasFlowsheetsList(true);
                    // navigate('/flowsheets', {replace: true});
                });
        }
        // .catch(e => {
        //         console.error('try #' + loadLandingPage + ' unable to connect to backend: ', e)
        //         setTimeout(function () {
        //             setLoadLandingPage(loadLandingPage => loadLandingPage + 1)
        //         }, 1000);
        //     })
    });

    return (
        <div className="App">
            {(hasTheme && hasFlowsheetsList) ? (
                <Container>
                    <Header theme={theme}/>
                    <Routes>
                        <Route path="flowsheet/:id/config" element={<FlowsheetConfig
                            numberOfSubprocesses={numberOfSubprocesses}
                            setNumberOfSubprocesses={setNumberOfSubprocesses}
                            theme={theme}/>}/>
                        <Route path="flowsheets" element={<FlowsheetsList
                            setNumberOfSubprocesses={setNumberOfSubprocesses}/>}/>
                        {/*<Route path="/" element={<SplashPage theme={theme}/>}/>*/}
                        <Route path="*"
                               element={<Navigate replace to="flowsheets"/>}/>
                    </Routes>
                </Container>
            ) : (<Container>
                    {!hasTheme && (<Box sx={{display: 'flex'}}><CircularProgress/></Box>)}
                    {!hasFlowsheetsList && (<SplashPage theme={theme}/>)}
                </Container>)
            }
        </div>
    );
}

    export default App;

import './App.css';
import React, {useEffect, useState} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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
    const [loadLandingPage, setLoadLandingPage] = useState(1)
    const [showHeader, setShowHeader] = useState(false)
    const [numberOfSubprocesses, setNumberOfSubprocesses] = useState({})
    const [theme, setTheme] = useState({});

    useEffect(() => {
        // Set the theme
        getProjectName().then((name) => {
            setTheme(themes[name]);
            console.debug("app set theme =",theme);
        });

        /*
          ping backend until it is ready then redirect away from splash page
        */
        getFlowsheetsList()
            .then(response => response.json())
            .then((data) => {
                // console.log('connected to backend')
                setShowHeader(true)
                navigate('/flowsheets', {replace: true})
            })
            .catch(e => {
                console.error('try #' + loadLandingPage + ' unable to connect to backend: ', e)
                setTimeout(function () {
                    setLoadLandingPage(loadLandingPage => loadLandingPage + 1)
                }, 1000)


            })

    }, [loadLandingPage])
    return (
            <div className="App">
                <Header show={showHeader} theme={theme}/>
                <Routes>
                    <Route path="flowsheet/:id/config" element={<FlowsheetConfig
                        numberOfSubprocesses={numberOfSubprocesses}
                        setNumberOfSubprocesses={setNumberOfSubprocesses}/>}/>
                    <Route path="flowsheets" element={<FlowsheetsList
                        setNumberOfSubprocesses={setNumberOfSubprocesses}/>}/>
                    <Route path="/" element={<SplashPage theme={theme}/>}/>
                    <Route path="*" element={<Navigate replace to="flowsheets"/>}/>
                </Routes>
            </div>
    );

}

export default App;

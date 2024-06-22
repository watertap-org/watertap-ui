import './App.css';
import React, {useEffect, useState} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {useNavigate} from "react-router-dom";
import SplashPage from './views/SplashPage/SplashPage';
import {getFlowsheetsList} from "./services/flowsheetsList.service";
import {getProjectName} from './services/projectName.service';
import MainContent from "./components/MainContent/MainContent";
import WaitForProject from "./components/WaitForProject/WaitForProject";
import {themes} from './theme';

function App() {
    let navigate = useNavigate();
    const [hasFlowsheetsList, setHasFlowsheetsList] = useState(false);
    const [hasTheme, setHasTheme] = useState(false);
    const [numberOfSubprocesses, setNumberOfSubprocesses] = useState({})
    const [theme, setTheme] = useState(null);

    console.log("App hasTheme = ",hasTheme);

    useEffect(() => {
        // Set the theme
        if (!hasTheme) {
            getProjectName().then((name) => {
                console.debug("setting theme: name=", name, "value=", themes[name]);
                setTheme(themes[name]);
                setHasTheme(true);
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
    });

    const subProcState = {value: numberOfSubprocesses, setValue: setNumberOfSubprocesses}
    return (
        <div className="App">
            <MainContent theme={theme} hasTheme={hasTheme} hasFlowsheets={hasFlowsheetsList}
                         subProcState={subProcState}/>
            <WaitForProject hasTheme={hasTheme}></WaitForProject>
            <SplashPage theme={theme} hasTheme={hasTheme} hasFlowsheets={hasFlowsheetsList}/>
        </div>
    )
}


export default App;

import './App.css';
import React, {useEffect, useState} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SplashPage from './views/SplashPage/SplashPage';
import {setProject} from "./services/flowsheet.service";
import MainContent from "./components/MainContent/MainContent";
import {themes} from './theme';
import { ThemeProvider, createTheme } from '@mui/material/styles';


function App() {
    const [connectedToBackend, setConnectedToBackend] = useState(false);
    const [numberOfSubprocesses, setNumberOfSubprocesses] = useState({})
    const [checkAgain, setCheckAgain] = useState(1)

    /* 
        if in dev mode, first check for theme in local storage because we allow for toggling between themes in dev mode
        if not found or not in dev mode, check for environment variable. 
        if not found, use watertap as default
    */
    let theme
    if (process.env.NODE_ENV === 'development') theme = themes[localStorage.getItem("theme")] || themes[process.env.REACT_APP_THEME] || themes["watertap"]
    else theme = themes[process.env.REACT_APP_THEME] || themes["watertap"]

    const WAIT_TIME = 1

    // use Material UI theme for styles to be consistent throughout app
    const mui_theme = createTheme({
        palette: {
            primary: {
                main: theme?.button.background,
            },
        },
    });
    useEffect(() => {
        if (checkAgain !== 0)
        {
            setProject(theme.project.toLowerCase())
            .then((data) => {
                localStorage.setItem("theme", theme.project.toLowerCase())
                setConnectedToBackend(true);
                setCheckAgain(0)
            }).catch((e) => {
                // console.log(`unable to get flowsheets, trying again in ${WAIT_TIME} seconds`)
                // if its taking a long time log the error
                if (checkAgain > 10) console.log(`get flowsheets failed: ${e}`)
                setTimeout(() => {
                    setCheckAgain(checkAgain+1)
                }, WAIT_TIME * 1000)
            });
        }
    }, [checkAgain]);

    const changeTheme = (new_theme) => {
        localStorage.setItem("theme", new_theme)
        window.location.reload()
    }

    const subProcState = {value: numberOfSubprocesses, setValue: setNumberOfSubprocesses}
    return (

        <ThemeProvider theme={mui_theme}>
            <div className="App">
                <MainContent theme={theme} connectedToBackend={connectedToBackend}
                            subProcState={subProcState} changeTheme={changeTheme}/>
                {/* <WaitForProject hasTheme={hasTheme}></WaitForProject> */}
                <SplashPage theme={theme} connectedToBackend={connectedToBackend}/>
            </div>
        </ThemeProvider>
    )
}


export default App;

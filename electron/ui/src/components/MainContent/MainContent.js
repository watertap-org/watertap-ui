/**
 * Component to display main content of the app.
 *
 * Displays nothing if the theme and list of flowsheets is not yet loaded
 * -- this avoids adding conditional rendering logic to the App component.
 */
import './MainContent.css';
import {Container} from "@mui/material";
import Header from "../Boilerplate/Header/Header";
import {Navigate, Route, Routes} from "react-router-dom";
import FlowsheetConfig from "../../views/FlowsheetConfig/FlowsheetConfig";
import FlowsheetsList from "../../views/FlowsheetsList/FlowsheetsList";
import React from "react";

export default function MainContent(props) {
    console.debug("MainContent: props=", props);
    if (props.hasTheme && props.connectedToBackend) {
        const theme = props.theme;
        const hasTheme = props.hasTheme;
        const spState = props.subProcState;
        return (
            <Container id='AppRootContainer'>
                <Header theme={theme} hasTheme={hasTheme}/>
                <Routes>
                    <Route path="flowsheet/:id/config" element={<FlowsheetConfig
                        numberOfSubprocesses={spState.value}
                        setNumberOfSubprocesses={spState.setValue}
                        theme={theme}/>}/>
                    <Route path="flowsheets" element={<FlowsheetsList
                        setNumberOfSubprocesses={spState.setValue}/>}/>
                    <Route path="*"
                           element={<Navigate replace to="flowsheets"/>}/>
                </Routes>
            </Container>
        );
    }
    else {
        return null;
    }
}

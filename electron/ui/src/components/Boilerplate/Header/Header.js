import './Header.css';
import React from 'react';
import LoggingPanel from '../../LoggingPanel/LoggingPanel';
import {useNavigate} from "react-router-dom";
import {Menu, MenuItem, IconButton} from '@mui/material';
import ListIcon from '@mui/icons-material/List';

export default function Header({theme, hasTheme}) {
    console.debug("header hasTheme=", hasTheme, ", theme=", theme);
    let navigate = useNavigate();
    const [showLogs, setShowLogs] = React.useState(false)
    const [actionsList, setActionsList] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleNavigateHome = () => {
        // setActionsList(!actionsList)
        navigate("/flowsheets", {replace: true})
    }

    const handleShowLogs = () => {
        setShowLogs(!showLogs)
        setActionsList(false)
    }

    const handleShowActions = (event) => {
        setActionsList(!actionsList)
        setAnchorEl(event.currentTarget);
    }
    if (!hasTheme) {
        // Can't return null, or React complains about handleXYZ hooks not being
        // called in the same order. So, return 'hidden' header.
        return (
            <div id="Header" style={{display: "hidden"}}>
                <span id="logo" data-testid="project-logo" onClick={handleNavigateHome} alt={`${theme.project} logo`}></span>
                <span onClick={handleShowActions}></span>
                <span onClick={handleShowLogs}></span>
                <span onClick={handleNavigateHome}></span>
            </div>
        );
    }

    return (
        <div id="Header">
            <div className="titlebar"
                 style={{background: theme.header.background}}>
                <div id="logo" style={{
                    cursor: 'pointer',
                    background: theme.header.logoBackground
                }} onClick={handleNavigateHome}>
                    <img  data-testid="project-logo" src={theme.logoOnly} alt={`${theme.project} logo`}/>
                </div>
                <div id="titlebar-name" style={{color: theme.header.color}}>
                    {theme.projectTitle}
                </div>
                <div className="right">
                    <IconButton className="header-actions" style={{color: theme.menuButton.color}} onClick={handleShowActions}>
                        <ListIcon/>
                    </IconButton>
                    <Menu
                        id="actions-list"
                        anchorEl={anchorEl}
                        open={actionsList}
                        onClose={() => setActionsList(false)}
                    >
                        <MenuItem className="view-logs" onClick={handleShowLogs}>View Logs</MenuItem>
                        <MenuItem className="return-home" onClick={handleNavigateHome}>Return to list
                            page</MenuItem>
                    </Menu>
                </div>
            </div>
            <LoggingPanel open={showLogs} onClose={handleShowLogs}/>
        </div>
    )
}


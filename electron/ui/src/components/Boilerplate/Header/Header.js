import './Header.css';
import React from 'react';
import LoggingPanel from '../../LoggingPanel/LoggingPanel';
import {useNavigate} from "react-router-dom";
import {Button, Menu, MenuItem, IconButton} from '@mui/material';
import ListIcon from '@mui/icons-material/List';

export default function Header(props) {
    let theme = props.theme;
    console.log("header theme =", theme);
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
    return (
        props.show &&
        <div id="Header">

            <div className="titlebar"
                 style={{background: theme.header.background}}>
                <div id="logo" style={{
                    cursor: 'pointer',
                    background: theme.header.logoBackground
                }} onClick={handleNavigateHome}>
                    <img src={theme.logoOnly} alt={`${theme.project} logo`}/>
                </div>
                <div id="titlebar-name" style={{color: theme.header.color}}>
                    {theme.projectTitle}
                </div>
                <div className="right">
                    <IconButton style={{color: theme.menuButton.color}}
                                onClick={handleShowActions}><ListIcon/></IconButton>
                    <Menu
                        id="actions-list"
                        anchorEl={anchorEl}
                        open={actionsList}
                        onClose={() => setActionsList(false)}
                    >
                        <MenuItem onClick={handleShowLogs}>View Logs</MenuItem>
                        <MenuItem onClick={handleNavigateHome}>Return to list
                            page</MenuItem>
                    </Menu>
                </div>
            </div>
            <LoggingPanel open={showLogs} onClose={handleShowLogs}/>
        </div>
    )
}


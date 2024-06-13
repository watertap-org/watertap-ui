/**
 * Component to display a spinner while waiting for the backend to respond with the
 * name (and other metadata, potentially) of the current project.
 *
 * Without this information, the app can't know how to style the display or which
 * flowsheets to list, so it is the first thing that must happen.
 */
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function WaitForProject({hasTheme}) {
    if (!hasTheme) {
        return (<Box sx={{display: 'flex'}}>Loading project... <CircularProgress/></Box>);
    } else {
        return null;
    }
}

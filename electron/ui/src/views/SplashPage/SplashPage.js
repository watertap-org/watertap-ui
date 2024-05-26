import './SplashPage.css';
import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function SplashPage({theme, hasTheme, hasFlowsheets}) {
    console.log("splash page theme =", theme, "hasTheme=", hasTheme, "hasFlowsheets=", hasFlowsheets);

    // Without the theme, we can't display anything yet.
    // If we have the flowsheets, then no longer show the splash page.
    if (!hasTheme || hasFlowsheets || theme == null) {
        return null;
    }

    return (
        <div className="splashBackground">
            <img alt={theme.name + " background"} src={theme.splashImage}/>
            <Box id="splashContent">
                <Grid container>
                    <Grid item xs={2}> </Grid>
                    <Grid item xs={8}>
                        <Box>
                            <img alt={theme.name + " logo"} src={theme.logoFull}
                                 id="splashLogo"/>
                        </Box>
                    </Grid>
                    <Grid item xs={2}> </Grid>

                    <Grid item xs={3}> </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <p id="splashRelease">v24.03.29 (WaterTAP v0.12.0)</p>
                        </Box>
                    </Grid>
                    <Grid item xs={3}> </Grid>

                    <Grid item xs={1}> </Grid>
                    <Grid item xs={10}>
                        <Box id="splashBlurb">
                            <p>{theme.projectBlurb}</p>
                        </Box>
                    </Grid>
                    <Grid item xs={1}> </Grid>
                    <Grid item xs={1}> </Grid>
                    <Grid item xs={10}>
                        <Box>
                            <p style={{paddingTop: 1}}></p>
                        </Box>
                    </Grid>
                    <Grid item xs={1}> </Grid>
                </Grid>
            </Box>
        </div>
    );
}



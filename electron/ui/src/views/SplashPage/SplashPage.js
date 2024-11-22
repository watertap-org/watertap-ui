import './SplashPage.css';
import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {displayVersion} from '../../theme';

export default function SplashPage({theme, connectedToBackend}) {

    // Stop and return nothing if SplashPage should not be displayed:
    //   - without the theme, we can't display anything yet
    //   - if we have the flowsheets, then no longer show the splash page
    if (connectedToBackend || theme == null) {
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
                            <p id="splashRelease">{displayVersion(theme)}</p>
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

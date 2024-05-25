import React from 'react';
import Grid from '@mui/material/Grid';  
import Box from '@mui/material/Box';

export default function SplashPage(props) {
    const theme = props.theme;
    console.log("splash page theme =", theme);
    const styles = {
        background: {
            height: '100vh',
        },
        backgroundImage: {
            width: '100%',
            height: '100%',
            objectFit: 'fill'
        },
        boxStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            borderRadius: 8,
            boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)',
            p: 4,
            backgroundColor: 'white',
        },
        tableBox: {
            border: '1px solid #0884b4',
            borderRadius: 2
        },
        newButton: {
            backgroundColor: '#0884b4',
            borderRadius: '8px',
            '&:hover': {
                backgroundColor: '#0884b4',
                opacity: 0.9
            },
        },
    }

    if (theme == null) {
        return (<div></div>);
    }
    else {
        return (
            <div style={styles.background}>
                <img alt="WaterTAP background" src={theme.splashImage}
                     style={styles.backgroundImage}>

                </img>
                <Box style={styles.boxStyle}>
                    <Grid container>
                        <Grid item xs={2}> </Grid>
                        <Grid item xs={8}>
                            <Box style={{}}>
                                <img alt="WaterTAP logo" src={theme.logoFull}
                                     style={{width: '100%', paddingTop: "50px"}}></img>
                            </Box>
                        </Grid>
                        <Grid item xs={2}> </Grid>

                        <Grid item xs={3}> </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <p style={{
                                    paddingTop: 0,
                                    marginTop: 0,
                                    color: "#9c9c9c"
                                }}>v24.03.29 (WaterTAP v0.12.0)</p>
                            </Box>
                        </Grid>
                        <Grid item xs={3}> </Grid>

                        <Grid item xs={1}> </Grid>
                        <Grid item xs={10}>
                            <Box style={{color: "#676B71", paddingBottom: "40px"}}>
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
}



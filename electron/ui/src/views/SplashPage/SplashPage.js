import React from 'react';
import Grid from '@mui/material/Grid';  
import Box from '@mui/material/Box';
import BackgroundPic from '../../assets/splashpage-background.png'

export default function LandingPage(props) {

    const styles = {
        background: {
            height: '100vh',
        },
        bacgkroundImage: {
            width: '100%',
            height: '100%',
            objectFit:'fill'
        },
        boxStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            borderRadius: 8,
            boxShadow:'0px 5px 10px 0px rgba(0, 0, 0, 0.5)',
            p: 4,
            backgroundColor:'white',
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

  return ( 
    <div style={styles.background}>
        <img alt="PARETO background" src={BackgroundPic} style={styles.bacgkroundImage}>
        
        </img>
        {/* <Box style={styles.boxStyle}>
            <Grid container>
                <Grid item xs={2}> </Grid>
                <Grid item xs={8}> 
                    <Box style={{}}>
                        <img alt="PARETO logo" src={FullLogo} style={{width:'100%'}}></img>
                    </Box>
                </Grid>
                <Grid item xs={2}> </Grid>

                <Grid item xs={5}> </Grid>
                <Grid item xs={2}> 
                    <Box>
                        <p style={{paddingTop:0, marginTop: 0, color:"#9c9c9c"}}>v 0.6.0</p>
                    </Box>
                </Grid>
                <Grid item xs={5}> </Grid>

                <Grid item xs={1}> </Grid>
                <Grid item xs={10}> 
                    <Box style={{}}>
                        <p>
                            PARETO helps organizations better manage, better treat, and 
                            - where possible - beneficially reuse produced water from oil 
                            and gas operations.
                        </p>
                    </Box>
                </Grid>
                <Grid item xs={1}> </Grid>

                <Grid item xs={1}> </Grid>
                <Grid item xs={10}> 
                    <Box>
                        <p style={{paddingTop:1}}></p>
                    </Box>
                </Grid>
                <Grid item xs={1}> </Grid>
                
            </Grid>
        </Box> */}
    </div> 
  );

}



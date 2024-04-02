import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Box, Paper, Stack, Toolbar, Tabs, Tab } from '@mui/material';
import OutputComparisonTable from "../../../components/OutputComparisonTable/OutputComparisonTable.js";
import OutputComparisonChart from "../../../components/OutputComparisonChart/OutputComparisonChart.js";

export default function OutputComparison(props) {
    const { outputData } = props;
    const [ tabValue, setTabValue ] = useState(0)

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue)
    }

  return (

        <Box> 
            <Grid item xs={12}> 
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
                        <Tab label="Table View" />
                        <Tab label="Chart View" /> 
                    </Tabs>
                </Box>
                
            </Grid>
            {  tabValue === 0 &&
                <OutputComparisonTable outputData={outputData}/>
            }
            {  tabValue === 1 &&
                <OutputComparisonChart outputData={outputData}/>
            }
        </Box>
      
  );
}

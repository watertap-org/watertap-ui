import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Box, Paper, Stack, Toolbar } from '@mui/material';
import OutputComparisonTable from "../../../components/OutputComparisonTable/OutputComparisonTable.js";

export default function OutputComparison(props) {
    const { outputData } = props;
    const [ outputTab, setOutputTab ] = useState("table")

  return (

        <Box> 
            {  outputTab === "table" &&
                <OutputComparisonTable outputData={outputData}/>
            }
        </Box>
      
  );
}

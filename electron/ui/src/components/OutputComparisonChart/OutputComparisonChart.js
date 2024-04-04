  
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Select } from '@mui/material';
import { Grid, Typography, Button, InputLabel, MenuItem, FormControl, Tabs, Tab, Box } from '@mui/material';
import Plot from 'react-plotly.js';

export default function OutputComparisonChart(props) {
    const { flowsheetData, historyData } = props;
    const [ plotData, setPlotData ] = useState({data: [], layout: []})
    const [ showPlot, setShowPlot ] = useState(false)

    const styles = {

    }

    useEffect(() => {
        // unpackData("line")
        // console.log("history data")
        // console.log(historyData)
        try {
            unpackData(
                'line', 
                [historyData[0].data.Feed.variables[0].obj_key],
                historyData[0].data['Levelized cost metrics'].variables[0].obj_key
            )
        } catch(e) {
            console.error(e)
        }
        
    }, [flowsheetData])

    const unpackData = (plotType, xVariables, yVariable) => {
        let traces = []
        if (plotType==="line"){ // line plot
            for (let xVariable of xVariables) {
                let x = []
                let y = []
                for(let config of historyData) {
                    let xValue = config.raw.data[xVariable].value
                    let vValue = config.raw.data[yVariable].value
                    x.push(Math.round(xValue * 100, 2) / 100)
                    y.push(Math.round(vValue * 100, 2) / 100)
                }
                traces.push({
                    x: x,
                    y: y,
                    type: 'scatter'
                })
            }
            let xLabel = `${historyData[0].raw.data[xVariables[0]].name} (${historyData[0].raw.data[xVariables[0]].display_units})`
            let yLabel = `${historyData[0].raw.data[yVariable].name} (${historyData[0].raw.data[yVariable].display_units})`
            let tempLayout = {
                xaxis: {
                    title: {
                        text: xLabel,
                    },
                },
                yaxis: {
                    title: {
                        text: yLabel,
                    },
                    // type: 'log',
                    // autorange: true,
                },
                width: 700,
                height: 500,
            };
            // console.log('lineplot data: ')
            // console.log(tempData)

            setPlotData({data: traces, layout:tempLayout})
            setShowPlot(true)
        } 
    }

    
    return ( 
        <Grid container spacing={2}> 
                
            <Grid sx={{marginBottom:15, paddingBottom: 50}} item xs={12}>
                {showPlot && 
                <>
                <Plot
                    data={plotData.data}
                    layout={plotData.layout}
                />
                </>
                
                }
            
            </Grid>

        </Grid>
    );
}
 
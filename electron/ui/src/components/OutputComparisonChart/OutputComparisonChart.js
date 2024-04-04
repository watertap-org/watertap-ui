  
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Select } from '@mui/material';
import { Grid, Typography, Button, InputLabel, MenuItem, FormControl, Tabs, Tab, Box } from '@mui/material';
import Plot from 'react-plotly.js';
import { round } from '../../assets/helperFunctions';

export default function OutputComparisonChart(props) {
    const { flowsheetData, historyData } = props;
    const [ plotData, setPlotData ] = useState({data: [], layout: []})
    const [ showPlot, setShowPlot ] = useState(false)

    const styles = {

    }

    useEffect(() => {
        // console.log(historyData)
        try {
            let barChartKeys = []
            for (let each of historyData[0].data['Operating costs'].variables) {
                barChartKeys.push(each.obj_key)
            }
            unpackData(
                'bar', 
                // [historyData[0].data.Feed.variables[0].obj_key],
                barChartKeys
                // [
                //     historyData[0].data['Operating costs'].variables[0].obj_key,
                //     historyData[0].data['Operating costs'].variables[1].obj_key,
                // ]
            )
        } catch(e) {
            console.error(e)
        }
        
    }, [flowsheetData])

    const unpackData = (plotType, yVariables) => {
        if (plotType === "bar") {
            let traces = []
            let x = []
            let ys = []
            // x: the configuration names; will be the same for each trace
            // y: the values for each y variable
            for(let config of historyData) {
                x.push(config.name)
            }
            let yNames = []
            for(let yVariable of yVariables) {
                let y = []
                for(let config of historyData) {
                    y.push(round(config.raw.data[yVariable].value, 3))
                }
                yNames.push(`${historyData[0].raw.data[yVariable].name} (${historyData[0].raw.data[yVariable].display_units})`)
                ys.push(y)
            }
            console.log(ys)
            for(let i = 0; i < ys.length; i++) {
                let y = ys[i]
                let yName = yNames[i]
                let trace = {
                    x: x,
                    y: y,
                    name: yName,
                    type: 'bar'
                };
                traces.push(trace)
            }
            console.log(traces)
            let layout =  {//barmode: 'stack'};
                xaxis: {
                    title: {
                        text: "Optimization Name",
                    },
                },
                yaxis: {
                    title: {
                        text: "Operating costs",
                    },
                },
                width: 700,
                height: 500,
                barmode: 'stack'
            };
            setPlotData({data: traces, layout:layout})
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
 
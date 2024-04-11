  
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Select } from '@mui/material';
import { Grid, Typography, Button, InputLabel, MenuItem, FormControl, Tabs, Tab, Box } from '@mui/material';
import Plot from 'react-plotly.js';
import { round } from '../../assets/helperFunctions';

export default function OutputComparisonChart(props) {
    const { flowsheetData, historyData, categoriesWithCharts } = props;
    const [ plotData, setPlotData ] = useState({data: [], layout: []})
    const [ showPlot, setShowPlot ] = useState(false)
    const [ displayCategory, setDisplayCategory ] = useState(null)

    const styles = {

    }

    useEffect(() => {
        try {
            if (categoriesWithCharts.length > 0) setDisplayCategory(categoriesWithCharts[0])
            // setDisplayCategory(Object.keys(historyData[0].data)[0])
        } catch (e) {
            console.error(e)
        }
        
    }, [historyData])

    useEffect(() => {
        if (displayCategory) {
            // console.log(historyData)
            let barChartKeys = []
            for (let each of historyData[0].data[displayCategory].variables) {
                barChartKeys.push(each.obj_key)
            }
            unpackData(
                'bar',
                barChartKeys
            )
        }
    }, [displayCategory])

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
            // console.log(ys)
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
            // console.log(traces)
            let layout =  {//barmode: 'stack'};
                xaxis: {
                    title: {
                        text: "Optimization Name",
                    },
                },
                yaxis: {
                    title: {
                        text: displayCategory,
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

    const handleParamaterSelection = (event) => {
        setDisplayCategory(event.target.value)
    }
    
    return ( 
        <Grid container spacing={2}> 
            <Grid item xs={3}>
            <InputLabel sx={{marginTop:1}} id="Parameter-Selection-label">Chart Category&nbsp;</InputLabel>
            { showPlot && 

                <FormControl>
                <Select
                    labelId="Parameter-Selection-label"
                    id="Parameter-Selection"
                    value={displayCategory}
                    onChange={handleParamaterSelection}
                    size="small"
                    sx={{minWidth: 200}}
                    MenuProps={{
                        style: {
                            maxHeight: 400,
                                },
                        }}
                >
                {/* {Object.keys(historyData[0].data).map((k) => (
                    <MenuItem
                        key={`${k}`}
                        value={k}
                        >
                        {k}
                    </MenuItem>
                ))} */}
                {categoriesWithCharts.map((v, idx) => (
                    <MenuItem
                        key={`${v}_${idx}`}
                        value={v}
                        >
                        {v}
                    </MenuItem>
                ))}
                </Select>
                </FormControl>

            }
            
            </Grid>
            <Grid sx={{marginBottom:15, paddingBottom: 50}} item xs={9}>
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
 
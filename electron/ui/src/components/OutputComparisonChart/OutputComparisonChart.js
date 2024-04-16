  
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
            let displayUnits
            // x: the configuration names; will be the same for each trace
            // y: the values for each y variable
            for(let config of historyData) {
                x.push(config.name)
            }
            let yNames = []

            // this will store the data in an accurate, flexible manner, but will have to be reformatted after
            let barChartData = {}
            // this will store the net value for each optimization (all values added together)
            let netValues = {}

            for(let yVariable of yVariables) {
                let y = []

                // initialize empty dictionary (or array?) for this variable
                let variableData = {
                    positives: [],
                    negatives: [],
                }
                for(let config of historyData) {
                    let nextValue = round(config.raw.data[yVariable].value, 3)
                    y.push(nextValue)

                    // add key/value pairing for this section to the correct list
                    let nextPairing = {}
                    nextPairing["key"] = config.name
                    nextPairing["value"] = nextValue
                    // nextPairing[config.name] = nextValue
                    if (nextValue >= 0) variableData.positives.push(nextPairing)
                    else variableData.negatives.push(nextPairing)

                    // add y value to its net value stored in netValues
                    // if that key hasnt been set yet, store it there
                    if (Object.keys(netValues).includes(config.name)) {
                        netValues[config.name] += nextValue
                    } else {
                        netValues[config.name] = nextValue
                    }
                }
                yNames.push(`${historyData[0].raw.data[yVariable].name} (${historyData[0].raw.data[yVariable].display_units})`)
                displayUnits = historyData[0].raw.data[yVariable].display_units
                ys.push(y)

                // add variable data to barchartdata
                barChartData[`${historyData[0].raw.data[yVariable].name} (${historyData[0].raw.data[yVariable].display_units})`] = variableData
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

            let newTraces = []
            for (let variable of Object.keys(barChartData)) {
                let variableData = barChartData[variable]
                let positives = variableData.positives
                let negatives = variableData.negatives
                let x = []
                let y = []

                for (let positive of positives) {
                    x.push(positive.key + " cost")
                    y.push(positive.value)
                }
                for (let negative of negatives) {
                    x.push(negative.key + " revenue")
                    y.push(negative.value)
                }
                // console.log(nets)
                let trace = {
                    name: variable,
                    type: "bar",
                    x: x,
                    y: y,
                }
                newTraces.push(trace)
            }
            for (let netValueKey of Object.keys(netValues)) {
                let trace = {
                    name: netValueKey+ " Total cost ($/m^3)",
                    type: "bar",
                    x: [netValueKey],
                    // x: ["made up cost "],
                    y: [netValues[netValueKey]],
                }
                
                // console.log(trace)
                newTraces.push(trace)
                // break
            }
            // console.log(netValues)
            // console.log(traces)
            // console.log(newTraces)
            // console.log(barChartData)
            // newTraces.push(test_guy)
            let layout =  {
                xaxis: {
                    title: {
                        text: "Optimization Name",
                    },
                },
                yaxis: {
                    title: {
                        text: `${displayCategory} (${displayUnits})`,
                    },
                },
                width: 1000,
                height: 700,
                barmode: 'stack'
            };
            setPlotData({data: newTraces, layout:layout})
            setShowPlot(true)
        }
    }

    const handleParamaterSelection = (event) => {
        setDisplayCategory(event.target.value)
    }
    
    return ( 
        <Grid container spacing={2}> 
            <Grid item xs={1}>
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
            <Grid sx={{marginBottom:15, paddingBottom: 50}} item xs={11}>
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
 
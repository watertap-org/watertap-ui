  
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Select } from '@mui/material';
import { Grid, Typography, Button, InputLabel, MenuItem, FormControl, Tabs, Tab, Box } from '@mui/material';
import Plot from 'react-plotly.js';
import { round, roundList } from '../../assets/helperFunctions';

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
                // 'bar',
                historyData[0].data[displayCategory].chartType,
                barChartKeys
            )
        }
    }, [displayCategory])

    function makeAnnotation(text, xPos) {
        return {
          text: text,
          showarrow: false,
          xref: 'x',
          yref: 'paper',
          x: xPos,
          y: -0.1,
          yanchor: 'top'
        };
      }

    const unpackData = (plotType, yVariables) => {
        if (plotType === "stacked_bar_with_net") {
            let hovertemplate = //"<b>%{text}</b><br><br>" +
            "%{data.name}: %{y:,.3f}<br>" +
            //"%{xaxis.title.text}: %{x:.0%}<br>" +
            // "Number Employed: %{marker.size:,}" +
            "<extra></extra>"
            let displayUnits
            // x: the configuration names; will be the same for each trace
            // y: the values for each y variable
            let configMapping = {}
            let i = 0
            for(let config of historyData) {
                let mapping = ""
                for (let j = 0; j<i; j++) {
                    mapping += " "
                }
                configMapping[config.name] = mapping
                i++
            }

            // this will store the data in an accurate, flexible manner, but will have to be reformatted after
            let barChartData = {}
            // this will store the net value for each optimization (all values added together)
            let netValues = {}

            for(let yVariable of yVariables) {

                // initialize empty dictionary (or array?) for this variable
                let variableData = {
                    positives: [],
                    negatives: [],
                }
                for(let config of historyData) {
                    // let nextValue = round(config.raw.data[yVariable].value, 3)
                    let nextValue = config.raw.data[yVariable].value
                    // add key/value pairing for this section to the correct list
                    let nextPairing = {}
                    nextPairing["key"] = configMapping[config.name]
                    nextPairing["value"] = nextValue
                    if (nextValue >= 0) variableData.positives.push(nextPairing)
                    else variableData.negatives.push(nextPairing)

                    // add y value to its net value stored in netValues
                    // if that key hasnt been set yet, store it there
                    if (Object.keys(netValues).includes(configMapping[config.name])) {
                        netValues[configMapping[config.name]] += nextValue
                    } else {
                        netValues[configMapping[config.name]] = nextValue
                    }
                }
                displayUnits = historyData[0].raw.data[yVariable].display_units

                // add variable data to barchartdata
                barChartData[`${historyData[0].raw.data[yVariable].name} (${historyData[0].raw.data[yVariable].display_units})`] = variableData
            }

            //keep track of whether we found negative and positive values for each
            let configTracker = {}
            let categoryarray = []
            for(let config of historyData) {
                configTracker[configMapping[config.name]] = {
                    positive: false,
                    negative: false
                }
                categoryarray.push(configMapping[config.name] + " cost")
                categoryarray.push(configMapping[config.name] + " revenue")
                categoryarray.push(configMapping[config.name] + " net")
            }

            let traces = []
            for (let variable of Object.keys(barChartData)) {
                let variableData = barChartData[variable]
                let positives = variableData.positives
                let negatives = variableData.negatives
                let x = []
                let y = []

                for (let positive of positives) {
                    x.push(positive.key + " cost")
                    y.push(positive.value)
                    configTracker[positive.key].positive = true
                }
                for (let negative of negatives) {
                    x.push(negative.key + " revenue")
                    y.push(negative.value)
                    configTracker[negative.key].negative = true
                }
                // console.log(nets)
                let yTextLabels = roundList(y, 3)
                let trace = {
                    name: variable,
                    type: "bar",
                    x: x,
                    y: y,
                    text: yTextLabels.map(String),
                    hovertemplate: hovertemplate
                }
                traces.push(trace)
            }
            // add any unfound positives and negatives
            for (let config of Object.keys(configTracker)) {
                if (!configTracker[config].positive) {
                    let trace = {
                        name: "cost",
                        type: "bar",
                        x: [config + " cost"],
                        y: [0],
                        hovertemplate: hovertemplate
                    }
                    traces.push(trace)
                }
                if (!configTracker[config].negative) {
                    let trace = {
                        name: "revenue",
                        type: "bar",
                        x: [config + " revenue"],
                        y: [0],
                        hovertemplate: hovertemplate
                    }
                    traces.push(trace)
                }
            }
            // add net value for each config
            let netX = []
            let netY = []
            for (let netValueKey of Object.keys(netValues)) {
                netX.push(netValueKey+ " net")
                netY.push(netValues[netValueKey])
            }
            let netYTextLabels = roundList(netY, 3)
            let trace = {
                name: "net",
                type: "bar",
                x: netX,
                y: netY,
                text: netYTextLabels.map(String),
                hovertemplate: hovertemplate
            }
            traces.push(trace)

            //add annotations (categories ie config names)
            i = 1
            let annotations = []
            for (let config of Object.keys(configMapping)) {
                annotations.push(makeAnnotation(config, i))
                i+=3
            }


            let layout =  {
                xaxis: {
                    // title: {
                    //     text: "Optimization Name",
                    // },
                    categoryorder: "array",
                    categoryarray:  categoryarray//["A", "B", "C", "D", "E"]
                },
                yaxis: {
                    title: {
                        text: `${displayCategory} (${displayUnits})`,
                    },
                },
                width: 1000,
                height: 700,
                barmode: 'stack',
                annotations: annotations
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
 
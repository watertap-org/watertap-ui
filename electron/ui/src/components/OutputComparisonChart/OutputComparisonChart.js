  
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { FormGroup, FormControlLabel, Checkbox, Select } from '@mui/material';
import { Grid, InputLabel, MenuItem, FormControl } from '@mui/material';
import Plot from 'react-plotly.js';
import { round, roundList } from '../../assets/helperFunctions';

export default function OutputComparisonChart(props) {
    const { flowsheetData, historyData, categoriesWithCharts } = props;
    const [ plotData, setPlotData ] = useState({data: [], layout: []})
    const [ showPlot, setShowPlot ] = useState(false)
    const [ displayCategory, setDisplayCategory ] = useState(null)
    const [ selectedConfigs, setSelectedConfigs ] = useState([])
    const [ selectedConfigNames, setSelectedConfigNames ] = useState([])
    const brewer_colors =['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f','#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
    const styles = {

    }

    useEffect(() => {
        try {
            if (categoriesWithCharts.length > 0) setDisplayCategory(categoriesWithCharts[0])
        } catch (e) {
            console.error(e)
        }
        
    }, [historyData])

    useEffect(() => {
        let tempSelectedConfigs = Array(selectedConfigNames.length)
        for (let config of historyData) {
            // add configs to same index to ensure order is preserved
            let configIndex = selectedConfigNames.indexOf(config.name);
            if (configIndex > -1) { 
                tempSelectedConfigs[configIndex] = config
            } 
        }
        setSelectedConfigs(tempSelectedConfigs)
    }, [selectedConfigNames])

    useEffect(() => {
        if (selectedConfigs.length > 0) {
            let barChartKeys = []
            for (let each of selectedConfigs[0].data[displayCategory].variables) {
                barChartKeys.push(each.obj_key)
            }
            console.log("unpacking data, chart type is")
            console.log(selectedConfigs[0].data[displayCategory].chartType)
            unpackData(
                selectedConfigs[0].data[displayCategory].chartType,
                barChartKeys
            )
        } else {
            setShowPlot(false)
        }

    }, [selectedConfigs])

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

    function makeVerticalLine(xPos, y0, y1) {
        return {
            type: 'line',
            x0: xPos,
            y0: y0,
            x1: xPos,
            y1: y1,
            fillcolor: '#d3d3d3',
            opacity: 0.2,
            editable: true,
        };
    }

    const unpackData = (plotType, yVariables) => {
        if (plotType === "stacked_bar_with_net") {
            let hovertemplate = "%{data.name}: %{y:,.3f}<br>" + "<extra></extra>"
            let displayUnits
            // x: the configuration names; will be the same for each trace
            // y: the values for each y variable
            let configMapping = {}
            let i = 0
            for(let config of selectedConfigs) {
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
                for(let config of selectedConfigs) {
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
                displayUnits = selectedConfigs[0].raw.data[yVariable].display_units

                // add variable data to barchartdata
                barChartData[`${selectedConfigs[0].raw.data[yVariable].name} (${selectedConfigs[0].raw.data[yVariable].display_units})`] = variableData
            }

            //keep track of whether we found negative and positive values for each
            let configTracker = {}
            let categoryarray = []
            for(let config of selectedConfigs) {
                configTracker[configMapping[config.name]] = {
                    positive: false,
                    negative: false
                }
                categoryarray.push(configMapping[config.name] + " Cost")
                categoryarray.push(configMapping[config.name] + " Revenue")
                categoryarray.push(configMapping[config.name] + " Net")
            }

            // calculate max and min y values
            let mins = {}
            let maxes = {}

            let traces = []
            let color_idx=0
            for (let variable of Object.keys(barChartData)) {
                let variableData = barChartData[variable]
                let positives = variableData.positives
                let negatives = variableData.negatives
                let x = []
                let y = []

                for (let positive of positives) {
                    let key = positive.key + " Cost"
                    x.push(key)
                    y.push(positive.value)
                    configTracker[positive.key].positive = true

                    if (Object.keys(maxes).includes(key)) maxes[key] += positive.value
                    else maxes[key] = positive.value
                }
                for (let negative of negatives) {
                    let key = negative.key + " Revenue"
                    x.push(key)
                    y.push(negative.value)
                    configTracker[negative.key].negative = true

                    if (Object.keys(mins).includes(key)) mins[key] += negative.value
                    else mins[key] = negative.value
                }
                
                let yTextLabels = roundList(y, 2)
                let trace = {
                    name: variable,
                    type: "bar",
                    x: x,
                    y: y,
                    marker: {color:brewer_colors[color_idx], 
                    line: {
                        color: 'black',                  
                        width: 1,                  
                      }},
                    text: yTextLabels.map((x) => "$"+x),
                    hovertemplate: hovertemplate
                }
                color_idx++;
                traces.push(trace)
            }
            let maxY = 0
            let minY = 0
            for (let each of Object.keys(maxes)) {
                let tempMax = maxes[each]
                if (tempMax > maxY) maxY = tempMax
            }
            for (let each of Object.keys(mins)) {
                let tempMin = mins[each]
                if (tempMin < minY) minY = tempMin
            }
            // add any unfound positives and negatives
            for (let config of Object.keys(configTracker)) {
                if (!configTracker[config].positive) {
                    let trace = {
                        name: "Cost",
                        type: "bar",
                        x: [config + " Cost"],
                        y: [0],
                        marker: {color:brewer_colors[color_idx], 
                        line: {
                            color: 'black',                  
                            width: 1,                  
                          }},
                        hovertemplate: hovertemplate
                    }
                    color_idx++;
                    traces.push(trace)
                }
                if (!configTracker[config].negative) {
                    let trace = {
                        name: "Revenue",
                        type: "bar",
                        showlegend: false,
                        marker: {color:brewer_colors[color_idx], 
                        line: {
                            color: 'black',                  
                            width: 1,                  
                          }},
                        x: [config + " Revenue"],
                        y: [0],
                        hovertemplate: hovertemplate
                    }
                    color_idx++;
                    traces.push(trace)
                }
            }
            // add net value for each config
            let netX = []
            let netY = []
            for (let netValueKey of Object.keys(netValues)) {
                netX.push(netValueKey+ " Net")
                netY.push(netValues[netValueKey])
            }
            let netYTextLabels = roundList(netY, 2)
            let trace = {
                name: "Net",
                type: "bar",
                x: netX,
                y: netY,
                marker: {color:brewer_colors[color_idx], 
                line: {
                    color: 'black',                  
                    width: 1,                  
                  }},
                text: netYTextLabels.map((x) => "$"+x),
                hovertemplate: hovertemplate
            }
            color_idx++;
            traces.push(trace)

            // maxY = 1.368
            // minY = -0.705
            // add annotations (categories ie config names) and line dividers
            i = 1
            let annotations = []
            let verticalLines = []
            for (let config of Object.keys(configMapping)) {
                annotations.push(makeAnnotation(config, i))
                verticalLines.push(makeVerticalLine(i+1.5, minY, maxY))
                i+=3
            }

            let layout =  {
                xaxis: {
                    categoryorder: "array",
                    categoryarray:  categoryarray,
                    showline: true,
                },
                yaxis: {
                    title: {
                        text: `${displayCategory} (${displayUnits})`,
                    },
                    showline:true
                },
                width: 1000,
                height: 700,
                barmode: 'stack',
                annotations: annotations,
                shapes: verticalLines,
                // bargap: 0.2
            };
            setPlotData({data: traces, layout:layout})
            setShowPlot(true)
        }
        else if (plotType === "stacked_bar") {
            let hovertemplate = "%{data.name}: %{y:,.3f}<br>" + "<extra></extra>"
            let traces = []
            let x = []
            let ys = []
            let displayUnits
            // x: the configuration names; will be the same for each trace
            // y: the values for each y variable
            for(let config of selectedConfigs) {
                x.push(config.name)
            }
            let yNames = []
            for(let yVariable of yVariables) {
                let y = []
                for(let config of selectedConfigs) {
                    y.push(round(config.raw.data[yVariable].value, 3))
                }
                yNames.push(`${selectedConfigs[0].raw.data[yVariable].name} (${selectedConfigs[0].raw.data[yVariable].display_units})`)
                displayUnits = selectedConfigs[0].raw.data[yVariable].display_units
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
                    type: 'bar',
                    hovertemplate: hovertemplate
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
                        text: `${displayCategory} (${displayUnits})`,
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
            <Grid item xs={2}>
            
            { displayCategory && 
                <>
                    <InputLabel sx={{marginTop:10}} id="Parameter-Selection-label">Chart Category&nbsp;</InputLabel>
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
                    <ConfigSelect 
                        historyData={historyData}
                        selectedConfigNames={selectedConfigNames}
                        setSelectedConfigNames={setSelectedConfigNames}
                    />
                </>
            }
            
            </Grid>
            <Grid sx={{marginBottom:15, paddingBottom: 50}} item xs={10}>
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
 



export function ConfigSelect(props) {
    const { historyData, selectedConfigNames, setSelectedConfigNames } = props;

    const handleSelect = (event) => {
        // console.log(event.target.name)    
        let target = event.target.name
        let tempSelectedConfigs = [...selectedConfigNames]
        const index = tempSelectedConfigs.indexOf(target);
        if (index > -1) { 
            tempSelectedConfigs.splice(index, 1);
        } else {
            tempSelectedConfigs.push(target)
        }
        setSelectedConfigNames(tempSelectedConfigs)
    }

    return (
        <>
            <InputLabel sx={{marginTop:10}} id="Config-Selection-label">Config Selection&nbsp;</InputLabel>
            <FormGroup onChange={handleSelect}>
                {historyData.map((v, idx) => (
                    <FormControlLabel key={`${v}_${idx}`} name={v.name} control={<Checkbox checked={selectedConfigNames.includes(v.name)}/>} label={v.name} />
                ))}
            </FormGroup>
        </>
    );
}
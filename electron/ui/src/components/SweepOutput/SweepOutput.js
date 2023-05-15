 
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Select } from '@mui/material';
import { Grid, Typography, Button, InputLabel, MenuItem, FormControl, Tabs, Tab, Box } from '@mui/material';
import Plot from 'react-plotly.js';

export default function SweepOutput(props) {
    const { outputData, download } = props;
    const [ plotData, setPlotData ] = useState({})
    const [ showPlot, setShowPlot ] = useState(false)
    const [ indices, setIndices ] = useState([1, 0, 2])
    const [ tabValue, setTabValue ] = useState(0)

    const styles = {
        parameters: {
            border:"1px solid #71797E",
            backgroundColor: "#f4f0ec"
        },
        outputs: {
            border:"1px solid #71797E"
        }, 
        tableHeader: {
            border:"2px solid #71797E", 
            backgroundColor:"#E5E4E2",
            fontWeight: "bold"
        }
    }

    useEffect(() => {
        let num_parameters = outputData.outputData.sweep_results.num_parameters
        if (num_parameters === 1) {
            unpackData(1)
        } else if (num_parameters === 2) {
            unpackData(2, 1, 0, 2)
        } else {
            // show parrallel lines plot
            unpackData(3)
        }
    }, [props.outputData])

    const handleParamaterSelection = (event) => {
        console.log(event.target.value)
        let newIndex = event.target.value + outputData.outputData.sweep_results.num_parameters
        unpackData(2, indices[0], indices[1], newIndex)
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const unpackData = (plotType, xIndex, yIndex, zIndex) => {
        // console.log(outputData.outputData.sweep_results)
        let keys = outputData.outputData.sweep_results.keys
        if (plotType === 2) { //contour map
            console.log(keys)
            let x = []
            let y = []
            let z = []
            let currZ = []
            for (let each of outputData.outputData.sweep_results.values) {
                let tempX = Math.round(each[xIndex] * 1000) / 1000
                let tempY = Math.round(each[yIndex] * 1000) / 1000
                let tempZ = Math.round(each[zIndex] * 1000) / 1000
                currZ.push(tempZ)
                if(!x.includes(tempX)) {
                    x.push(tempX)
                }
                if(!y.includes(tempY)) {
                    y.push(tempY)
                }
                if (currZ.length === 5) {
                    z.push(currZ)
                    currZ = []
                }
            }

            let xLabel = `${outputData.outputData.sweep_results.headers[xIndex]} (${outputData.outputData.model_objects[keys[xIndex]].display_units})`
            let yLabel = `${outputData.outputData.sweep_results.headers[yIndex]} (${outputData.outputData.model_objects[keys[yIndex]].display_units})`
            let zLabel = `${outputData.outputData.sweep_results.headers[zIndex]} (${outputData.outputData.model_objects[keys[zIndex]].display_units})`

            let tempPlotData = [{
                z:z,
                x:x,
                y:y,
                type: 'contour',
                zsmooth:"best",
                hoverongaps: false,
                colorbar: {
                    title: {
                        text: zLabel,
                        side: "right"
                    },
                },
                // colorscale: [`[[0, 'rgb(248,252,202,255)'], [0.055, 'rgb(50,167,194,255)'], [0.11, 'rgb(7,30,88,255)']]`]
            }]

            let tempPlotLayout = {
                xaxis: {
                    title: {
                        text: xLabel,
                    }
                },
                yaxis: {
                    title: {
                        text: yLabel
                    }
                },
            }
            setPlotData({data: tempPlotData, layout: tempPlotLayout})
            setShowPlot(true)
            setIndices([xIndex, yIndex, zIndex])
        } else if (plotType===1){ // line plot
            let x = []
            let ys = []
            for (let i = 0; i < outputData.outputData.sweep_results.num_outputs; i++) {
                ys.push([])
            }
            for (let each of outputData.outputData.sweep_results.values) {
                x.push(each[0])
                for(let i = 1; i < each.length; i++) {
                    ys[i-1].push(each[i])
                }
            }
            let tempData = []
            let keyIdx = 1
            for (let each of ys) {
                let yName = `${outputData.outputData.sweep_results.headers[keyIdx]} (${outputData.outputData.model_objects[keys[keyIdx]].display_units})`
                let tempTrace = {x: x, y: each, type:"scatter", name: yName}
                tempData.push(tempTrace)
                keyIdx+=1
            }
            
            let xLabel = `${outputData.outputData.sweep_results.headers[0]} (${outputData.outputData.model_objects[keys[0]].display_units})`
            let tempLayout = {
                xaxis: {
                    title: {
                        text: xLabel,
                    },
                },
                yaxis: {
                    // range: [-1,0.8],
                    type: 'log',
                    autorange: true,
                    // domain: [0, 50],
                    // range: [5,10],
                },
                width: 1000,
                height: 500,
            };
            // console.log('lineplot data: ')
            // console.log(tempData)

            setPlotData({data: tempData, layout:tempLayout})
            setShowPlot(true)
        } else if (plotType ===3) { //parallel coordinates plot
            console.log('making parallel coordinates plot')
            let dimensions = []
            for (let each of outputData.outputData.sweep_results.headers) {
                dimensions.push({label: each, values: []})
            }
            for (let each of outputData.outputData.sweep_results.values) {
                for(let i = 0; i < each.length; i++) {
                    let tempDimension = dimensions[i]
                    tempDimension.values.push(each[i])
                }
            }
            for (let each of dimensions) {
                // let maxRange
                let max = Math.max(...each.values)
                let min = Math.min(...each.values)
                if (max > 0 && min > 0) {
                    // maxRange = Math.ceil(max) + Math.ceil(min)
                    each.range = [0, Math.ceil(max+min)]
                }
            }
            console.log(dimensions)
            let trace = {
                type: 'parcoords',
                line: {
                  color: 'blue'
                },
                dimensions: dimensions
              };
              let tempLayout = {
                width: 1000,
                height: 500,
            };
            setPlotData({data: [trace], layout:tempLayout})
            setShowPlot(true)
        }
    }
    
    return ( 
        <Grid container spacing={2}> 
            <Grid item xs={12}> 
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
                        <Tab label="Table View" />
                        <Tab label="Chart View" /> 
                    </Tabs>
                </Box>
                
            </Grid>
            
            {tabValue === 0 && 
            <>
                <Grid item xs={12}>
                <TableContainer sx={{maxHeight: "80vh", overflowX:'auto'}}>
                <Table style={{border:"1.5px solid #71797E"}} size={'small'}>
                    <TableHead>
                    <TableRow style={styles.tableHeader}>
                        <TableCell style={styles.tableHeader} colSpan={outputData.outputData.sweep_results.num_parameters} align="center">
                            Sweep Parameters
                        </TableCell>
                        <TableCell style={styles.tableHeader} colSpan={outputData.outputData.sweep_results.num_outputs} align="center">
                            Outputs
                        </TableCell>
                    </TableRow>
                    <TableRow key="tablehead"> 
                        {outputData.outputData.sweep_results.headers.map( (value, index)  => {
                            return <TableCell style={{border:"1px solid #71797E", backgroundColor:"#E5E4E2"}} key={`head_${index}`}> 
                            <Typography noWrap>{value}</Typography>
                            </TableCell>
                        })}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {outputData.outputData.sweep_results.values.map( (row, ridx)  => {
                            return (
                                <TableRow key={`row_${ridx}`}> 
                                {row.map( (cell, cidx) => {
                                    return (<TableCell 
                                                style={cidx < outputData.outputData.sweep_results.num_parameters ? styles.parameters : styles.outputs} key={`cell_${cidx}`} 
                                                align="right"
                                            > 
                                                {cell.toFixed(3)}
                                            </TableCell>
                                    )
                                })}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
                
                </Grid> 
                <Grid item xs={12}>
                    <Button variant="text" startIcon={<DownloadIcon />} onClick={download}>Download Results</Button>
                </Grid>
            </>
            }
            {tabValue === 1 && 
            <>
            {showPlot && outputData.outputData.sweep_results.num_parameters === 2 && 
                <Grid sx={{marginTop:15, height:"100px"}} item xs={2}>
                    {/* <Box sx={{display: 'flex', justifyContent: 'flex-end', width:"100%"}}> */}
                    <InputLabel sx={{marginTop:1}} id="previous-configs-label">Output Metric&nbsp;</InputLabel>
                    <FormControl>
                        <Select
                        labelId="Parameter Selection"
                        id="Parameter Selection"
                        value={indices[2]-outputData.outputData.sweep_results.num_parameters}
                        onChange={handleParamaterSelection}
                        size="small"
                        sx={{minWidth: 200}}
                        MenuProps={{
                            style: {
                               maxHeight: 400,
                                  },
                            }}
                        >
                        {outputData.outputData.sweep_results.headers.slice(outputData.outputData.sweep_results.num_parameters).map((name, index) => (
                            <MenuItem
                            key={`${name}_${index}`}
                            value={index}
                            // style={getStyles(name, personName, theme)}
                            >
                            {name}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
            }
                
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
                
            </>
            }
            
        </Grid>
    );
}
 

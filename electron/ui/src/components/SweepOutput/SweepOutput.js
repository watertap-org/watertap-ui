 
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Select } from '@mui/material';
import { Grid, Typography, Button, InputLabel, MenuItem, FormControl, Tabs, Tab, Box } from '@mui/material';
import Plot from 'react-plotly.js';

export default function SweepOutput(props) {
    const { outputData, download } = props;
    const [ plotType, setPlotType ] = useState(0)
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
            setPlotType(1)
            unpackData(1, 0, 1)
        } else if (num_parameters === 2) {
            setPlotType(2)
            unpackData(2, 1, 0, 2)
        } else {
            // show parrallel lines plot
            setPlotType(3)
            unpackData(3)
        }
    }, [props.outputData])

    const handleParamaterSelection = (event) => {
        // console.log("handle parameter selection")
        let newIndex = event.target.value + outputData.outputData.sweep_results.num_parameters
        if(plotType === 2) {
            unpackData(2, indices[0], indices[1], newIndex)
        }
        else if(plotType === 1) {
            unpackData(1, indices[0], newIndex)
        }
        
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const unpackData = (plotType, xIndex, yIndex, zIndex) => {
        // console.log(outputData.outputData.sweep_results)
        let keys = outputData.outputData.sweep_results.keys
        if (plotType === 2) { //contour map
            let x = []
            let y = []
            let z = []
            let currZ = []
            for (let each of outputData.outputData.sweep_results.values) {
                let tempX = Math.round(each[xIndex] * 1000) / 1000
                let tempY = Math.round(each[yIndex] * 1000) / 1000
                let tempZ = null
                if (each[zIndex]!==null){
                tempZ = Math.round(each[zIndex] * 1000) / 1000}
           

                if(!x.includes(tempX)) {
                    x.push(tempX)
                }
                if(!y.includes(tempY)) {
                    y.push(tempY)
                }
            }

            for (let each of outputData.outputData.sweep_results.values) {
                let tempZ = null
                if (each[zIndex]!==null){
                tempZ = Math.round(each[zIndex] * 1000) / 1000}
                currZ.push(tempZ)
                if (currZ.length === x.length) {
                    z.push(currZ)
                    currZ = []
                }
            }

            let xLabel = `${outputData.outputData.sweep_results.headers[xIndex]} (${outputData.outputData.exports[keys[xIndex]].display_units})`
            let yLabel = `${outputData.outputData.sweep_results.headers[yIndex]} (${outputData.outputData.exports[keys[yIndex]].display_units})`
            let zLabel = `${outputData.outputData.sweep_results.headers[zIndex]} (${outputData.outputData.exports[keys[zIndex]].display_units})`

            let tempPlotData = [{
                z:z,
                x:x,
                y:y,
                type: 'heatmap',
                zsmooth:false,
                hoverongaps: false,
                colorscale: 'Viridis',
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
        } else if (plotType===1){ // line plot
            let x = []
            let ys = []
            for (let i = 0; i < outputData.outputData.sweep_results.num_outputs; i++) {
                ys.push([])
            }
            for (let each of outputData.outputData.sweep_results.values) {
                x.push(Math.round(each[0] * 1000) / 1000)
                
                for(let i = 1; i < each.length; i++) {
                    let out=null
                    if (each[i]!==null){
                        out = Math.round(each[i] * 1000) / 1000}
                    ys[i-1].push(out)
                }
            }
            let tempData = []
            let keyIdx = 1
            for (let each of ys) {
                if( keyIdx === yIndex){
                    let yName = `${outputData.outputData.sweep_results.headers[keyIdx]} (${outputData.outputData.exports[keys[keyIdx]].display_units})`
                    let tempTrace = {x: x, y: each, type:"scatter", name: yName}
                    tempData.push(tempTrace)
                    
                }
                keyIdx+=1
                
            }
            
            let xLabel = `${outputData.outputData.sweep_results.headers[0]} (${outputData.outputData.exports[keys[0]].display_units})`
            let yLabel = `${outputData.outputData.sweep_results.headers[yIndex]} (${outputData.outputData.exports[keys[yIndex]].display_units})`
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

            setPlotData({data: tempData, layout:tempLayout})
            setShowPlot(true)
        } else if (plotType ===3) { //parallel coordinates plot
            // console.log('making parallel coordinates plot')
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
            // console.log(dimensions)
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
        setIndices([xIndex, yIndex, zIndex])
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
                            Variables
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
                                                {cell && cell.toFixed(3)}
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
            {showPlot && (outputData.outputData.sweep_results.num_parameters === 1 || outputData.outputData.sweep_results.num_parameters === 2) && 
                <Grid sx={{marginTop:15, height:"100px"}} item xs={2}>
                    {/* <Box sx={{display: 'flex', justifyContent: 'flex-end', width:"100%"}}> */}
                    <InputLabel sx={{marginTop:1}} id="previous-configs-label">Y Variable&nbsp;</InputLabel>
                    <FormControl>
                        <Select
                        labelId="Parameter Selection"
                        id="Parameter Selection"
                        value={plotType === 2 ? indices[2]-outputData.outputData.sweep_results.num_parameters : plotType === 1 && indices[1]-outputData.outputData.sweep_results.num_parameters}
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
 
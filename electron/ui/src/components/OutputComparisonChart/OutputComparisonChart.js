  
import React from 'react'; 
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Select } from '@mui/material';
import { Grid, Typography, Button, InputLabel, MenuItem, FormControl, Tabs, Tab, Box } from '@mui/material';
import Plot from 'react-plotly.js';

export default function OutputComparisonChart(props) {
    const { outputData } = props;
    const [ plotData, setPlotData ] = useState({data: [], layout: []})
    const [ showPlot, setShowPlot ] = useState(false)

    const styles = {

    }

    useEffect(() => {
        unpackData("line")
    }, [outputData])

    const unpackData = (plotType) => {
        // console.log(outputData.outputData)
        let keys = outputData.outputData.sweep_results.keys
        if (plotType==="line"){ // line plot
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
            // for (let each of ys) {
            //     if( keyIdx === yIndex){
            //         let yName = `${outputData.outputData.sweep_results.headers[keyIdx]} (${outputData.outputData.model_objects[keys[keyIdx]].display_units})`
            //         let tempTrace = {x: x, y: each, type:"scatter", name: yName}
            //         tempData.push(tempTrace)
                    
            //     }
            //     keyIdx+=1
            // }
            
            // let xLabel = `${outputData.outputData.sweep_results.headers[0]} (${outputData.outputData.model_objects[keys[0]].display_units})`
            // let yLabel = `${outputData.outputData.sweep_results.headers[yIndex]} (${outputData.outputData.model_objects[keys[yIndex]].display_units})`
            let xLabel, yLabel
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
 
import React, { Fragment, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';


// const sample = [
//   { name: "System Metrics", metric: ["Recovery", "Specific energy consumption", "Levelized cost of water"], 
//     output: ["40%", "2.53 kWh/m3", "0.59 $/m3"], pastConfig: ["60%", "2.74 kWh/m3", "0.52 $/m3"], 
//     difference: ["-20%", "-0.21 kWh/m3", "0.07 $/m3"]  },
//   { name: "Feed", metric: ["Volumetric Flowrate", "Salinity", "Temperature", "Pressure"], 
//   output: ["3.6 m3/h", "35000 ppm", "298 k", "1 bar"], pastConfig: ["3.4 m3/h", "35000 ppm", "298 k", "1 bar"], 
//   difference: ["0.2 m3/h", "0 ppm", "0 k", "0 bar"] },
//   { name: "Product", metric: ["Volumetric Flowrate", "Salinity", "Temperature", "Pressure"], 
//   output: ["1.44 m3/h", "500 ppm", "298 k", "1 bar"], pastConfig: ["1.46 m3/h", "400 ppm", "298 k", "1 bar"], 
//   difference: ["-0.2 m3/h", "100 ppm", "0 k", "0 bar"] },
//   { name: "Disposal", metric: ["Volumetric Flowrate", "Salinity", "Temperature", "Pressure"], 
//   output: ["2.16 m3/h", "57032 ppm", "298 k", "1 bar"], pastConfig: ["3.06 m3/h", "56000 ppm", "298 k", "1 bar"], 
//   difference: ["0.9 m3/h", "1032 ppm", "0 k", "0 bar"] },
//   { name: "Decision variables", metric: ["Operating pressure", "Membrane area", "Inlet crossflow velocity"], 
//   output: ["47.7 bar", "111.5 m2", "16.8 cm/2"], pastConfig: ["46.7 bar", "111.5 m2", "17.0 cm/2"], 
//   difference: ["1.0 bar", "0 m2", "-0.2 cm/2"] },
//   { name: "System Variables", metric: ["Pump power", "ERD Power", "Average water flux", "Pressure drop", "Max interfacial salinity"], 
//   output: ["5.8 kW", "2.2 kW", "12.9 L/(m2-h)", "1.19 bar", "58720 ppm"], pastConfig: ["5.8 kW", "2.2 kW", "12.9 L/(m2-h)", "1.0 bar", "58720 ppm"], 
//   difference: ["0 kW", "0 kW", "0 L/(m2-h)", "0.19 bar", "0 ppm"] }
// ];

export default function OutputComparisonTable(props) {
    const { currData, historyData } = props;
    const [leftConfigIndex, setLeftConfigIndex]  = React.useState(historyData.length-1)
    const [rightConfigIndex, setRightConfigIndex]  = React.useState(0)
    const [dense, setDense] = React.useState(true);

    useEffect(()=>{   
      // console.log("history data: ")
      // console.log(historyData)
    }, [historyData]);

    const handleLeftConfigSelection = (event) => {
      setLeftConfigIndex(event.target.value)
    }

    const handleRightConfigSelection = (event) => {
      setRightConfigIndex(event.target.value)
    }

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const renderConfigurationSelect = (index) => {
        return <FormControl >
            <InputLabel id="demo-simple-select-label"></InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={index===0 ? leftConfigIndex : rightConfigIndex}
                label="Past Configurations"
                onChange={index===0 ? handleLeftConfigSelection : handleRightConfigSelection}
                variant='standard'
            >
                {historyData.map((value, index) => {
                    return <MenuItem value={index}>{index===historyData.length-1 ? 'Most recent result' : 'Configuration #'+(index+1)}</MenuItem>
                })}
            </Select>
        </FormControl>
    }

    const downloadSheet = () => {
      console.log('clicked download')
    }

    const renderComparisonTable = () => {
      return <Box>
      <Paper>
        <Table style={{border:"1px solid #ddd"}} size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Metric</TableCell>
              <TableCell>{renderConfigurationSelect(0)}</TableCell>
              <TableCell>{renderConfigurationSelect(1)}</TableCell>
              <TableCell>Value Difference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(historyData[leftConfigIndex].output).map((category,index)=>{ return ( <Fragment>
            <TableRow>
              <TableCell rowSpan={Object.keys(historyData[0].output[category]).length + 1}>
                <b>{category}</b>
              </TableCell>
            </TableRow>
            {Object.keys(historyData[leftConfigIndex].output[category]).map((metric, index) => { return <TableRow key={index}>
                <TableCell>{metric}</TableCell>
                <TableCell>{historyData[leftConfigIndex].output[category][metric][0]+historyData[leftConfigIndex].output[category][metric][1]}</TableCell>
                <TableCell>{historyData[rightConfigIndex].output[category][metric][0]+historyData[rightConfigIndex].output[category][metric][1]}</TableCell>
                <TableCell>{Math.round((historyData[leftConfigIndex].output[category][metric][0]-historyData[rightConfigIndex].output[category][metric][0]) * 100) / 100}</TableCell>
              </TableRow>
            })}
          </Fragment>
            )
        })}
          </TableBody>
        </Table>
      </Paper>
      <Grid item xs={12}>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
      <Button variant="text" startIcon={<DownloadIcon />} onClick={downloadSheet}>Download Results</Button>
      </Grid>
      </Box>
    }

  return (

        <Grid container spacing={0} alignItems="flex-start"> 
            {   
                renderComparisonTable()
            }
        </Grid>
      
  );
}

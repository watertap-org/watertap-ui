import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadCSV }  from '../../../services/output.service.js'

export default function OutputComparisonTable(props) {
    let params = useParams(); 
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

    // const handleChangeDense = (event) => {
    //     setDense(event.target.checked);
    // };

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
                    return <MenuItem key={value+index} value={index}>{index===historyData.length-1 ? 'Most recent result' : 'Configuration #'+(index+1)}</MenuItem>
                })}
            </Select>
        </FormControl>
    }

    const downloadSheet = () => {
      downloadCSV(params.id, [historyData[leftConfigIndex],historyData[rightConfigIndex]])
      .then(response => response.blob())
      .then((data)=>{
        const href = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'comparison_results.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    const renderComparisonTable = () => {
      return <Box>
      <Paper>
        <Table style={{border:"1px solid #ddd"}} size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow key="tablehead">
              <TableCell></TableCell>
              <TableCell>Metric</TableCell>
              <TableCell>{renderConfigurationSelect(0)}</TableCell>
              <TableCell>{renderConfigurationSelect(1)}</TableCell>
              <TableCell>Value Difference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(historyData[leftConfigIndex].output).map((category,index)=>{ return ( <Fragment>
            <TableRow key={category+index}>
              <TableCell rowSpan={Object.keys(historyData[0].output[category]).length + 1}>
                <b>{category}</b>
              </TableCell>
            </TableRow>
            {Object.keys(historyData[leftConfigIndex].output[category]).map((metric, index) => { return <TableRow key={metric+index}>
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

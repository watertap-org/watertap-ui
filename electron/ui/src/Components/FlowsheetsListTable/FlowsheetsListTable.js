
import {useEffect, useState} from 'react';   
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings'; 

 
export default function FlowsheetsListTable(props) {

    

  
    return (
        <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Treatment Train</TableCell>
                <TableCell>Last Run</TableCell> 
                <TableCell>Created</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.rows.map((row) => (
                <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell>
                    <a href={"/flowsheet/" + row.id + "/config"}>{row.name}</a>
                </TableCell>
                <TableCell>{row.train}</TableCell>
                <TableCell>{row.lastRun}</TableCell>
                <TableCell>{row.created}</TableCell>
                <TableCell>
                    <IconButton color="primary" aria-label="Edit project">
                        <SettingsIcon />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
            </Table>
        </TableContainer>
    );

}
 

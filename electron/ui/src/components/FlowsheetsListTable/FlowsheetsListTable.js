import { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Icon, Button } from '@mui/material'
import { useNavigate } from "react-router-dom";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

 
export default function FlowsheetsListTable(props) {
    let navigate = useNavigate();
    const [ sortKey, setSortKey ] = useState("name")
    const [ sortDirection, setSortDirection ] = useState("ascending")
    const handleFlowsheetClick = (id) => {
        navigate("/flowsheet/" + id + "/config", {replace: true})
    }
    const styles = {
        listRow: {
            cursor:"pointer",
            '&:hover': {
                background: "#efefef",
            },
            '&:last-child td, &:last-child th': { border: 0 }
            
        },
        listHeaderRow: {
        }
    }

    const formatLastRun = (time) => {
        try {
            if (time && time.length >= 11) {
                let full_date = new Date(parseFloat(time) * 1000)
                return full_date.toLocaleString().split(',')[0];
            }
                return time
        } catch(e) {
            return time
        } 
        
    }

    const handleSort = (key) => {
        if(sortKey === key) {
            if(sortDirection === 'ascending') setSortDirection('descending')
            else if(sortDirection === 'descending') setSortDirection('ascending')
        }
        else {
            setSortKey(key)
            if (key === "name") setSortDirection('ascending')
            else setSortDirection('descending')
        }
    }

    const sortRows = (rows) => {
        if (sortKey) return (rows.sort(compare)) 
        else return rows
        
    }

    function compare( a, b ) {
        if ( a[sortKey] < b[sortKey] ){
            if(sortDirection === "ascending") return -1;
            else return 1;
        }
        if ( a[sortKey] > b[sortKey] ){
            if(sortDirection === "ascending") return 1;
            else return -1;
        }
        return 0;
    }
      

    return (
        <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label="simple table">
            <TableHead sx={{margin: "50px"}}>
            <TableRow>
                <TableCell >
                    <span onClick={()=>handleSort('name')} style={{ cursor: "pointer"}}>
                        Flowsheet Name
                        <IconButton>{sortKey==="name" && (sortDirection === "ascending" ? <KeyboardArrowDownIcon/> : sortDirection === "descending" &&  <KeyboardArrowUpIcon/>)}</IconButton>
                    </span>
                </TableCell>
                <TableCell align="right"> 
                    <span onClick={()=>handleSort('last_run')} style={{ cursor: "pointer" }}>
                        Last Run
                        {sortKey==="name" && <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                        <IconButton>{sortKey==="last_run" && (sortDirection === "ascending" ? <KeyboardArrowDownIcon/> : sortDirection === "descending" &&  <KeyboardArrowUpIcon/>)}</IconButton>
                    </span>
                </TableCell> 
                <TableCell align="right" sx={{width: "20%"}}><Button variant="contained" onClick={props.handleNewFlowsheetDialogClickOpen}>New Flowsheet +</Button></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {sortRows(props.rows).map((row) => (
                <TableRow
                    key={row.name}
                    sx={styles.listRow}
                    onClick={()=>handleFlowsheetClick(row.id_)}
                >
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">{formatLastRun(row.last_run)}</TableCell>
                <TableCell></TableCell>
                </TableRow>
            ))}
            </TableBody>
            </Table>
        </TableContainer>
    );

}
 

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useNavigate } from "react-router-dom";

 
export default function FlowsheetsListTable(props) {
    let navigate = useNavigate();
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

    return (
        <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Flowsheet Name</TableCell>
                <TableCell align="right">Last Run</TableCell> 
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {props.rows.map((row) => (
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
 

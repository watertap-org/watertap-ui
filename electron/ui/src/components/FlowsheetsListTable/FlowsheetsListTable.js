import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
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
                key={row.blocks.fs.display_name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell>
                    <a href={"/flowsheet/" + row.id + "/config"}>{row.blocks.fs.display_name}</a>
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
 

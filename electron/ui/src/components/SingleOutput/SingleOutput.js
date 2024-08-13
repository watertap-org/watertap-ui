import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
// MUI imports
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import SaveIcon from '@mui/icons-material/Save';
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

export default function SingleOutput(props) {
    let params = useParams();
    const {outputData, downloadOutput, saveConfig} = props;
    const [configName, setConfigName] = useState(outputData.name)
    const [openSaveConfig, setOpenSaveConfig] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [outputTableData, setOutputTableData] = useState({})

    const handleOpenSaveConfig = () => setOpenSaveConfig(true);
    const handleCloseSaveConfig = () => setOpenSaveConfig(false);

    useEffect(()=> {
        let export_variables = {...outputData.outputData.exports}
        let rows = {}
        for (let key of Object.keys(export_variables)) {
            let export_variable = export_variables[key]
            let category = export_variable.output_category
            if (!category) category = export_variable.input_category
            let category_rows
            if (Object.keys(rows).includes(category)) category_rows = rows[category]
            else {
                category_rows = []
                rows[category] = category_rows
            } 
            category_rows.push({
                key: key,
                name: export_variable.name,
                value: export_variable.value,
                units: export_variable.display_units
            })
        }
        setOutputTableData(rows)
    }, [outputData])

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    const handleChangeConfigName = (event) => {
        setConfigName(event.target.value)
    }

    const handleSaveConfig = () => {
        saveConfig(params.id, {
            inputData: outputData.inputData,
            outputData: outputData.outputData
        }, configName, outputData.inputData.version)
            .then(response => response.json())
            .then((data) => {
                console.log('successfully saved config')
                let tempFlowsheetData = {...outputData}
                tempFlowsheetData.name = configName
                props.updateFlowsheetData(tempFlowsheetData, "UPDATE_CONFIG")
                handleCloseSaveConfig()
                setSaved(true)
            })
            .catch((e) => {
                console.log('error saving config', e)
                handleCloseSaveConfig()
            });
    }


    const handleDownloadOutput = () => {
        let headers = ['category', 'metric', 'units', 'value']
        let values = []
        for (let key of Object.keys(outputData.outputData.exports)) {
            let each = outputData.outputData.exports[key]
            if (each.is_output) {
                values.push([each.output_category, each.name, each.display_units, each.value])
            }
        }
        let body = {headers: headers, values: values}
        downloadOutput(params.id, body)
            .then(response => response.blob())
            .then((data) => {
                const href = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `${outputData.inputData.name}_output.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    const renderRows = () => {
        try {
            return (
                <TableBody>
                    {Object.entries(outputTableData).map(([category, rows]) => (
                        <>
                        <TableRow>
                            <TableCell rowSpan={rows.length+1}>{category}</TableCell>
                        </TableRow>
                            {rows.map((row, idx) => (
                                
                            <TableRow>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                    <TableCell>
                                    {row.units}
                                </TableCell>
                                    <TableCell>
                                    {row.value}
                                </TableCell>
                            </TableRow>
                            ))}
                        
                        </>
                    ))}
    
                </TableBody>
            )
        } catch(e) {
            console.log("unable to render rows: ")
            console.log(e)
        }
        
    }

    return (
        <>
            <Grid item xs={12}>
                <Toolbar spacing={2}>
                    <Box sx={{flexGrow: 1}}></Box>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" startIcon={<DownloadIcon/>}
                                onClick={handleDownloadOutput}>
                            Download Result
                        </Button>
                        <Button disabled={saved} variant="outlined"
                                startIcon={<SaveIcon/>}
                                onClick={handleOpenSaveConfig}>
                            Save Configuration
                        </Button>
                    </Stack>
                </Toolbar>
                <Modal
                    open={openSaveConfig}
                    onClose={handleCloseSaveConfig}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Grid container sx={modalStyle} spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                variant="standard"
                                id="margin-none"
                                label="Config Name"
                                value={configName}
                                onChange={handleChangeConfigName}
                                fullWidth
                                className="modal-save-config"
                            />
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                            <Button onClick={handleSaveConfig}
                                    variant="contained">Save</Button>
                        </Grid>
                    </Grid>
                </Modal>
            </Grid>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Variable</TableCell>
                        <TableCell>Units</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                {renderRows()}
            </Table>
        </>
    );
}
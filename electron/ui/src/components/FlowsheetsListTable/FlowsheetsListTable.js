// import { useState } from 'react'
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Icon,  } from '@mui/material'
import * as React from 'react';
import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Button } from '@mui/material'
import { useNavigate } from "react-router-dom";
import { deleteFlowsheet } from "../../services/flowsheetsList.service";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';
import PopupModal from '../PopupModal/PopupModal';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const CATEGORIES = {
    "Custom Flowsheets": [

    ],
    // "Wastewater Recovery": [
    //   "amo 1690",
    //   "biomembrane filtration",
    //   "dye desalination",
    //   "electrochemical nutrient removal",
    //   "glsd anaerobic digestion",
    //   "groundwater treatment",
    //   "hrcs",
    //   "magprex",
    //   "metab",
    //   "photothermal membrane cando_p",
    //   "peracetic acid disinfection",
    //   "suboxic asm",
    //   "supercritical sludge to gas",
    //   "swine wastewater treatment",
    //   "nf-dspm-de",
    //   "nf-dspm-de with bypass"
    // ]
  }
  

 
export default function FlowsheetsListTable(props) {
    let navigate = useNavigate();
    const [ sortKey, setSortKey ] = useState("name")
    const [ sortDirection, setSortDirection ] = useState("ascending")
    const [ showModal, setShowModal ] = useState(false)
    const [ removeFlowsheetId, setRemoveFlowsheetId ] = useState(null)
    const [ tableRows, setTableRows ] = useState([])
    const [ category, setCategory ] = useState("all")

    useEffect(() => {
        if (category === "All Flowsheets" || category === "") setTableRows([...props.rows])
        else if (category === "Custom Flowsheets") {
            try {
                let tempRows = []
                for (let fs of props.rows) {
                    
                    if (fs.custom) {
                        console.log(fs.name+" is custom: "+fs.custom)
                        tempRows.push(fs)
                    }
                }
                console.log('setting table rows: ')
                console.log(tempRows)
                setTableRows(tempRows)
            } catch(e) {
                setTableRows([...props.rows])
            }
        }
        else {
            try {
                let tempRows = []
                for (let fs of props.rows) {
                    if (CATEGORIES[category].includes(fs.name)) tempRows.push(fs)
                }
                setTableRows(tempRows)
            } catch(e) {
                setTableRows([...props.rows])
            }
        }
    }, [props.rows, category])

    const handleFlowsheetClick = (id, built, options) => {
        let hasOptions = false
        if(Object.keys(options).length > 0) hasOptions = true
        navigate("/flowsheet/" + id + "/config", {replace: true, state:{built: built, hasOptions: hasOptions}})
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

    const handleRemoveCustomFlowsheet = () => {
        deleteFlowsheet(removeFlowsheetId)
        .then(response => {
        if (response.status === 200) {
            response.json()
            .then((data)=>{
                console.log('delete successful: ',data)
                window.location.reload()

            }).catch((err)=>{
                console.error("error on flowshete deletion: ",err)
            })
        }
        else if (response.status === 400) {
            console.error("error on flowshete deletion: ",response.statusText)
        }
        })
        setRemoveFlowsheetId(null)
        setShowModal(false)
    }

    const handleShowModal = (e, id) => {
        e.stopPropagation()
        setShowModal(true)
        setRemoveFlowsheetId(id)
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
      
    const checkForCustomFlowsheets = () => {
        // console.log('checking for custom flowsheets')
        for (let each of tableRows) {
            if (each.custom) {
                return true
            }
            
        }
        return false
    }

    return (
        <TableContainer sx={{p: 3}}>
            { 

              category === "" ? 
            
              <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{margin: "50px"}}>
              <TableRow>
                  <TableCell >
                      <span onClick={()=>handleSort('name')} style={{ cursor: "pointer"}}>
                        Category
                      </span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right"><Button variant="contained" onClick={props.handleNewFlowsheetDialogClickOpen}>New Flowsheet +</Button></TableCell> 
              </TableRow>
              </TableHead>
              <TableBody>
              {Object.keys(CATEGORIES).map((key) => {
                if ((key === 'Custom Flowsheets' && checkForCustomFlowsheets()) || CATEGORIES[key].length > 0) return (
                  <TableRow
                      key={key}
                      sx={styles.listRow}
                      onClick={()=>setCategory(key)}
                  >
                  <TableCell>{key}</TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right" sx={{paddingRight: 5}}>
                    <span>
                      <IconButton><ArrowRightAltIcon/></IconButton>
                    </span>
                  </TableCell>
                  </TableRow>
                )})}
              <TableRow sx={styles.listRow} onClick={()=>setCategory("All Flowsheets")}>
                  <TableCell>All Flowsheets</TableCell>
                  <TableCell></TableCell> 
                <TableCell align="right" sx={{paddingRight: 5}}>
                    <span>
                      <IconButton><ArrowRightAltIcon/></IconButton>
                    </span>
                </TableCell>
            </TableRow>
            </TableBody>
            </Table>

              :

              <Table sx={{ minWidth: 700 }}>                
                <TableHead sx={{margin: "50px"}}>
                <TableRow>
                    <TableCell >
                      <IconButton sx={{marginLeft: -5, marginRight: 1 }} onClick={() => setCategory("")}><KeyboardBackspaceIcon/></IconButton>
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
                    <TableCell align="right" sx={{width: "20%"}}>
                        <Button variant="contained" onClick={props.handleNewFlowsheetDialogClickOpen}>New Flowsheet +</Button>
                    </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {sortRows(tableRows).map((row) => (
                    <TableRow
                        key={row.name}
                        sx={styles.listRow}
                        onClick={()=>handleFlowsheetClick(row.id_, row.built, row.build_options)}
                    >
                    <TableCell>{row.description}</TableCell>
                    <TableCell align="right">{formatLastRun(row.last_run)}</TableCell>
                    <TableCell>
                        {row.custom && 
                            // <IconButton size="small" onClick={(e) => handleRemoveCustomFlowsheet(e, row.id_)}>
                            //     <ClearIcon sx={{fontSize: "15px"}}/>
                            // </IconButton>
                            <IconButton size="small" onClick={(e) => handleShowModal(e, row.id_)}>
                                <ClearIcon sx={{fontSize: "15px"}}/>
                            </IconButton>
                        }
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
              </Table>

              
              
            }
            
            <PopupModal
                open={showModal}
                handleClose={() => setShowModal(false)}
                text="Are you sure you want to remove this flowsheet?"
                handleSave={handleRemoveCustomFlowsheet}
                buttonText='Remove'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
        </TableContainer>
    );

}


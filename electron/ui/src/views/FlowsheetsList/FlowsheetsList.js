import './FlowsheetsList.css';
import {useEffect, useState} from 'react';   
import FlowsheetsListTable from "../../components/FlowsheetsListTable/FlowsheetsListTable";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { getFlowsheetsList } from "../../services/flowsheetsList.service"; 
import NewFlowsheetDialog from "../../components/NewFlowsheetDialog/NewFlowsheetDialog";

export default function FlowsheetsList() {

  const [rows, setRows] = useState([]); 
  const [newFlowsheetDialogOpen, setNewFlowsheetDialogOpen] = useState(false);

  useEffect(()=>{
      getFlowsheetsList()
      .then((data)=>{
          setRows(data);
      });
  }, []);

  const handleNewFlowsheetDialogClickOpen = () => {
    setNewFlowsheetDialogOpen(true);
  };

  const handleReloadData = (shouldReload) => {
    setNewFlowsheetDialogOpen(false);
    if(shouldReload)
      console.log("reload table data....");
    else
      console.log("close....");
  };
  
  return ( 
    <Container>
      <h2 style={{textAlign:"left"}}>Flowsheets</h2>  
        
      <Toolbar>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewFlowsheetDialogClickOpen}>
          New
        </Button>
      </Toolbar> 

      <FlowsheetsListTable rows={rows}></FlowsheetsListTable> 
      
      <NewFlowsheetDialog open={newFlowsheetDialogOpen} onClose={handleReloadData}></NewFlowsheetDialog>
    </Container> 
  );

}



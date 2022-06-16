import './FlowsheetsList.css';
import {useEffect, useState} from 'react';   
import FlowsheetsListTable from "../../components/FlowsheetsListTable/FlowsheetsListTable";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { getFlowsheetsList } from "../../services/flowsheetsList.service"; 
import NewProjectDialog from "../../components/NewProjectDialog/NewProjectDialog";

export default function FlowsheetsList() {

  const [rows, setRows] = useState([]); 
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  useEffect(()=>{
      getFlowsheetsList()
      .then((data)=>{
          setRows(data);
      });
  }, []);

  const handleNewProjectDialogClickOpen = () => {
    setNewProjectDialogOpen(true);
  };

  const handleReloadData = (shouldReload) => {
    setNewProjectDialogOpen(false);
    if(shouldReload)
      console.log("reload table data....");
    else
      console.log("close....");
  };
  
  return ( 
    <Container>
      <h2 style={{textAlign:"left"}}>Flowsheets</h2>  
        
      <Toolbar>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewProjectDialogClickOpen}>
          New
        </Button>
      </Toolbar> 

      <FlowsheetsListTable rows={rows}></FlowsheetsListTable> 
      
      <NewProjectDialog open={newProjectDialogOpen} onClose={handleReloadData}></NewProjectDialog>
    </Container> 
  );

}



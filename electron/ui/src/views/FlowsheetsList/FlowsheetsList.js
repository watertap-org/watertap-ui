import './FlowsheetsList.css';
import {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import FlowsheetsListTable from "../../components/FlowsheetsListTable/FlowsheetsListTable";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { getFlowsheetsList } from "../../services/flowsheetsList.service"; 
import NewFlowsheetDialog from "../../components/NewFlowsheetDialog/NewFlowsheetDialog";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function FlowsheetsList() {

  const [rows, setRows] = useState([]); 
  const [errorMessage, setErrorMessage] = useState(false); 
  const [newFlowsheetDialogOpen, setNewFlowsheetDialogOpen] = useState(false);
  let location = useLocation();
  
  useEffect(()=>{
      if(location.state) {
        setErrorMessage(true)
      }
      getFlowsheetsList()
      .then(response => response.json())
      .then((data)=>{
        console.log("f list:",data);
          setRows(data);
      }).catch(e => {
        console.log("error getting flowsheets list: "+e)
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
        
      {/* <Toolbar>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewFlowsheetDialogClickOpen}>
          New
        </Button>
      </Toolbar>  */}

      <FlowsheetsListTable rows={rows}></FlowsheetsListTable> 
      
      <NewFlowsheetDialog open={newFlowsheetDialogOpen} onClose={handleReloadData}></NewFlowsheetDialog>
      {location.state && 
      <Snackbar open={errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage(false)}>
        <Alert severity="error">
          error building flowsheet
        </Alert>
      </Snackbar> 
      }
      
    </Container> 
  );

}



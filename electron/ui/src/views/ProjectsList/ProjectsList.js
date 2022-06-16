import './ProjectList.css';
import {useEffect, useState} from 'react';   
import ProjectsListTable from "../../components/ProjectsListTable/ProjectsListTable";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { getProjectsList } from "../../services/projectsList.service"; 
import NewProjectDialog from "../../components/NewProjectDialog/NewProjectDialog";

export default function ProjectsList() {

  const [rows, setRows] = useState([]); 
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  useEffect(()=>{
      getProjectsList()
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
      <h2 style={{textAlign:"left"}}>Projects</h2>  
        
      <Toolbar>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewProjectDialogClickOpen}>
          New
        </Button>
      </Toolbar> 

      <ProjectsListTable rows={rows}></ProjectsListTable> 
      
      <NewProjectDialog open={newProjectDialogOpen} onClose={handleReloadData}></NewProjectDialog>
    </Container> 
  );

}



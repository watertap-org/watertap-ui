 
import './App.css';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Routes, Route, Link } from "react-router-dom";
import Header from 'components/Boilerplate/Header/Header'; 
import ProjectsList from 'views/ProjectsList/ProjectsList';
import ProjectConfig from 'views/ProjectConfig/ProjectConfig';

function App() {
  
  return (
    <div className="App">  
      <Header/>
      <Routes>
        <Route path="/" element={<ProjectsList />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="project/:projectId/config" element={<ProjectConfig />} />
      </Routes> 
    </div> 
  );
  
}

export default App;

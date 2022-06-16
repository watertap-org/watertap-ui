 
import './App.css';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Routes, Route, Link } from "react-router-dom";
import Header from 'components/Boilerplate/Header/Header'; 
import FlowsheetsList from 'views/FlowsheetsList/FlowsheetsList';
import FlowsheetConfig from 'views/FlowsheetConfig/FlowsheetConfig';

function App() {
  
  return (
    <div className="App">  
      <Header/>
      <Routes>
        <Route path="/" element={<FlowsheetsList />} />
        <Route path="flowsheets" element={<FlowsheetsList />} />
        <Route path="flowsheet/:id/config" element={<FlowsheetConfig />} />
      </Routes> 
    </div> 
  );
  
}

export default App;

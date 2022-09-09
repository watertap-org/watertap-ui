 
import './App.css';
import React, { useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Header from './components/Boilerplate/Header/Header'; 
import FlowsheetsList from './views/FlowsheetsList/FlowsheetsList';
import FlowsheetConfig from './views/FlowsheetConfig/FlowsheetConfig';

function App() {
  let location = useLocation()

  useEffect(
    () => {
      // console.log('location : ',location)
    },
    [location]
  )
  return (
    <div className="App">  
      <Header/>
      <Routes> 
        <Route path="flowsheet/:id/config" element={<FlowsheetConfig />} /> 
        <Route path="flowsheets" element={<FlowsheetsList />} />
        <Route path="/" element={<FlowsheetsList />} />
        <Route path="*" element={<Navigate replace to="/" />}/>
      </Routes> 
    </div> 
  );
  
}

export default App;

import './Header.css';
import React from 'react';
import logo from "../../../assets/nawi-logo-color.png";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
 
export default function Header(props) {
  let navigate = useNavigate();
  const handleNavigateHome = () => {
      navigate("/flowsheets", {replace: true})
  }
    return (
      props.show && 
      <div id="Header">
        
         <div  className="titlebar" > 
          <div id="nawi_logo" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
            <img src={logo} alt="NAWI logo"/>
          </div>
        <div id="titlebar-name">
          WaterTAP
        </div>
        <div  className="right" > 
        <Button style={{ color:"white" }} onClick={handleNavigateHome}>Return to list page</Button>
        </div>
      </div> 
       
      </div>
    );
}


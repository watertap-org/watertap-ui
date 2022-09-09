import './Header.css';
import React from 'react';
import logo from "../../../assets/nawi-logo-color.png";
import { useNavigate } from "react-router-dom";
 
export default function Header() {
  let navigate = useNavigate();
  const handleNavigateHome = () => {
      navigate("/", {replace: true})
  }
    return (
      <div id="Header">
        <div  className="titlebar" > 
            <div id="nawi_logo" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
              <img src={logo} alt="NAWI logo"/>
            </div>
          <div id="titlebar-name">
            WaterTAP
          </div>
        </div> 
      </div>
    );
}


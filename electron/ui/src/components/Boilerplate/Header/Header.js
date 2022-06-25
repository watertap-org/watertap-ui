import './Header.css';
import React from 'react';
import logo from "../../../assets/nawi-logo-color.png";
 
class Header extends React.Component {
  render() {
    return (
      <div id="Header">
        <div className="titlebar">
          <a href="/">
            <div id="nawi_logo">
              <img src={logo} alt="NAWI logo"/>
            </div>
          </a>
           
          <div id="titlebar-name">
            WaterTAP
          </div>
        </div> 
      </div>
    );
  }
}

export default Header;

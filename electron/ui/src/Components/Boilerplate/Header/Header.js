import './Header.css';
import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <div id="Header">
        <div className="idaes-titlebar">
          <div id="idaes_logo"><img src="https://idaes.org/wp-content/uploads/sites/10/2020/02/idaes-logo-300x138.png"
          alt="IDAES logo"/></div>
          <div id="idaes-titlebar-right"></div>
        </div>
        <hr></hr> 
      </div>
    );
  }
}

export default Header;

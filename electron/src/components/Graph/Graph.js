import './Graph.css';
import React from 'react';
import demoImage from "../../assets/simple_RO_diagram.png";

class Graph extends React.Component {
  render() {
    return (
      <div id="Graph">
          <img src={demoImage} alt="flowsheet"/>
      </div>
    );
  }
}

export default Graph;

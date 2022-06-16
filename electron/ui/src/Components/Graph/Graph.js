import './Graph.css';
import React from 'react';
import demoImage from "../../assets/jointjs_idaes_img.png";

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

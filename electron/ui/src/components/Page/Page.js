import './Page.css';
import React from 'react';
//import Header from 'Components/Boilerplate/Header/Header';
import Graph from 'components/Graph/Graph';   
 
class Page extends React.Component {
  render() {
    return (
      <div id="Page"> 
        
        <Graph/>
      </div>
    );
  }
}

export default Page;

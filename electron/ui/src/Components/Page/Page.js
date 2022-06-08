import './Page.css';
import React from 'react';
import Header from 'Components/Boilerplate/Header/Header';
import Graph from 'Components/Graph/Graph';

class Page extends React.Component {
  render() {
    return (
      <div id="Page">
        <Header/>
        <Graph/>
      </div>
    );
  }
}

export default Page;

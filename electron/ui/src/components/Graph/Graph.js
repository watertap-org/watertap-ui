import './Graph.css';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import demoImage from "../../assets/simple_RO_diagram.png";
import { getDiagram } from "../../services/graph.service"; 

export default function Graph() {
  const [ graphImage, setGraphImage ] = useState(null)
  let params = useParams();
    useEffect(() => {
      
      getDiagram(params.id)
      .then(response => response.blob())
      .then((data)=>{
        if(data.size > 0) {
          setGraphImage(URL.createObjectURL(data))
        }
        }).catch((e) => {
          console.error('error fetching diagram: ',e)
      }); 
    },[])

    const noImage = () => {
      return <h1 style={{marginTop:'50px'}}>No Diagram Found</h1>
    }
    return (
      <div id="Graph">
        {graphImage ? 
        <img src={graphImage} alt="flowsheet"/>
         : 
        noImage()}
      </div>
    );

}

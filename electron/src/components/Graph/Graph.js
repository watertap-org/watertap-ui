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
          console.log('found diagram: ',data)
          setGraphImage(URL.createObjectURL(data))
        } else {
          console.log('diagram size 0')
        }
        }).catch((e) => {
          console.error('error fetching diagram: ',e)
      }); 
    },[])
    return (
      <div id="Graph">
          <img src={graphImage ? graphImage : demoImage} alt="flowsheet"/>
      </div>
    );

}

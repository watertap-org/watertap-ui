export const getDiagram = (id) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/diagram', {mode: 'cors'});
}; 
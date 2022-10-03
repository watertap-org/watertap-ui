export const deleteConfig = (id, name) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/delete?name='+name, {mode: 'cors'});
}; 
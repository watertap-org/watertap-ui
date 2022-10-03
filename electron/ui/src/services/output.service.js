
export const solve = (id) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/solve', {mode: 'cors'});
}; 

export const downloadCSV = (id,data) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/download', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}

export const saveConfig = (id,data,name, version) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/save?name='+name+'&version='+version, {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}

export const listConfigNames = (id, version) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/list?version='+version, {mode: 'cors'});
}; 

export const loadConfig = (id, name) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/load?name='+name, {mode: 'cors'});
}; 
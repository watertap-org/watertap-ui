

export const getFlowsheet = (id, build) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/config?build='+build, {mode: 'cors'});
    /*return new Promise((resolve, reject) => { 
        resolve(data3);
    });*/
    
}; 

export const saveFlowsheet = (id, data) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/update', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 

export const resetFlowsheet = (id) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/reset', {
        method: 'GET', 
        mode: 'cors'
    });
}; 

export const unbuildFlowsheet = (id) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/unbuild', {
        method: 'GET', 
        mode: 'cors'
    });
}; 

export const selectOption = (id, data) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/select_option', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 

export const getLogs = () => {
    return fetch('http://localhost:8001/flowsheets/get_logs', {
        method: 'GET', 
        mode: 'cors'
    });
}

export const downloadLogs = () => {
    return fetch('http://localhost:8001/flowsheets/download_logs', {
        method: 'POST', 
        mode: 'cors'
    });
}
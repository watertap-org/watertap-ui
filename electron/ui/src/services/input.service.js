export const deleteConfig = (id, name) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/delete?name='+name, {mode: 'cors'});
}; 

export const updateNumberOfSubprocesses = (data) => {
    return fetch('http://localhost:8001/flowsheets/update_number_of_subprocesses', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data)
    });
} 
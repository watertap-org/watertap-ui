export const getFlowsheetsList = () => {
    return fetch('http://localhost:8001/flowsheets/',{mode: 'cors'});
//        .then((response) => response.json())
};

export const uploadFlowsheet = (data) => {
    return fetch('http://localhost:8001/flowsheets/upload_flowsheet', {
        method: 'POST', 
        mode: 'cors',
        body: data
    });
}; 

export const deleteFlowsheet = (id) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/remove_flowsheet', {
        method: 'POST',
        mode: 'cors'
    });
}; 
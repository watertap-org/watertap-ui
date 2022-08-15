export const getFlowsheetsList = () => {
    return fetch('http://localhost:8001/flowsheets/',{mode: 'cors'});

    /*return new Promise((resolve, reject) => { 
        resolve(rows);
    });
    */
}; 
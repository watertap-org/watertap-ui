



const randomDate = () => {
    return new Date(+(new Date()) - Math.floor(Math.random()*10000000000)).toISOString().split('T')[0]
};

const rows = [
    {id:1, name:'Flowsheet C', train:"Seawater Desalination", lastRun:randomDate(), created:randomDate()},
    {id:2, name:'Flowsheet B', train:"Municipal Potable Water Reuse", lastRun:randomDate(), created:randomDate()},
    {id:3, name:'Flowsheet E', train:"Custom", lastRun:randomDate(), created:randomDate()},
    {id:4, name:'Flowsheet D', train:"Custom", lastRun:randomDate(), created:randomDate()},
    {id:5, name:'Flowsheet A', train:"Municipal Potable Water Reuse", lastRun:randomDate(), created:randomDate()},
    {id:6, name:'Flowsheet F', train:"Municipal Potable Water Reuse", lastRun:randomDate(), created:randomDate()},
];


export const getFlowsheetsList = () => {
    return fetch('http://localhost:8001/flowsheets/',{mode: 'cors'});

    /*return new Promise((resolve, reject) => { 
        resolve(rows);
    });
    */
}; 
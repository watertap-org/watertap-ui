



const randomDate = () => {
    return new Date(+(new Date()) - Math.floor(Math.random()*10000000000)).toISOString().split('T')[0]
};

const rows = [
    {id:1, name:'C Model', train:"Seawater Desalination", lastRun:randomDate(), created:randomDate()},
    {id:2, name:'B Model', train:"Municipal Potable Water Reuse", lastRun:randomDate(), created:randomDate()},
    {id:3, name:'E Model', train:"Custom", lastRun:randomDate(), created:randomDate()},
    {id:4, name:'D Model', train:"Custom", lastRun:randomDate(), created:randomDate()},
    {id:5, name:'A Model', train:"Municipal Potable Water Reuse", lastRun:randomDate(), created:randomDate()},
    {id:6, name:'F Model', train:"Municipal Potable Water Reuse", lastRun:randomDate(), created:randomDate()},
];


export const getProjectsList = () => {
    return new Promise((resolve, reject) => { 
        resolve(rows);
    });
}; 
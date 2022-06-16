



 

const data = {
    id:1,
    projectName:"Flowsheet A",
    na:0.011222,
    ci:0.02031688,
    so4:0.002121,
    ca:0.00122222,
    mg:0.0011223,
    h2o:0.964666
};


export const getFlowsheet = (id) => {
    return new Promise((resolve, reject) => { 
        resolve(data);
    });
}; 
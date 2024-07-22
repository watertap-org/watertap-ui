export const flowsheets = [
    {
        name: 'NF-DSPM-DE flowsheet',
        buildRequired: true,
        sweepVariable: 'Volumetricflowrate',
        sweepValues: []
    },
    {
        name: 'BSM2 flowsheet',
        buildRequired: false,
        sweepVariable: 'Watermassflowrate',
        sweepValues: [],
    },
    {
        name: 'BSM2_P_extension flowsheet',
        buildRequired: false,
        sweepVariable: 'Feedvolumetricflowrate',
        sweepValues: ['20000', '21000'],
    },
    {
        name: 'Dye Desalination flowsheet',
        buildRequired: false,
        sweepVariable: 'Volumetricflowrate',
        sweepValues: ['270', '290'],
    },
    {
        name: 'Mechanical vapor compression flowsheet',
        buildRequired: false,
        sweepVariable: 'Feedmassflow',
        sweepValues: ['35','45'],
    },
    {
        name: 'RO with energy recovery flowsheet',
        buildRequired: false,
        sweepVariable: 'Watermassflowrate',
        sweepValues: ['0.7','0.8'],
    },
    {
        name: 'OARO flowsheet',
        buildRequired: true,
        sweepVariable: 'Watermassflowrate',
        sweepValues: ['5','6'],
    },
    {
        name: 'Granular Activated Carbon (GAC) flowsheet',
        buildRequired: true,
        sweepVariable: 'MW',
        sweepValues: ['75','85'],
    },
    {
        name: 'Electrodialysis with concentrate recirculation flowsheet',
        buildRequired: false,
        sweepVariable: 'Feedsolutionvolumeflowrate',
        sweepValues: ['0.001,0.002'],
    },
    {
        name: 'LSRRO flowsheet',
        buildRequired: true,
        sweepVariable: 'Pump1outletpressure',
        sweepValues: ['80','90'],
    },
    {
        name: 'Generic treatment train flowsheet',
        buildRequired: false,
        sweepVariable: 'Desal1waterrecovery',
        sweepValues: ['80','90'],
    },
]
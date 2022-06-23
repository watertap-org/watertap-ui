



 

const data = {
    id:1, 
    
    "blocks": {
        "fs": {
            "variables": {},
            "blocks": {
                "feed": {
                    "variables": {
                        "flow_vol": {
                        "value": {
                            "index": [
                                [
                                    0.0
                                ]
                            ],
                            "value": [
                                0.0003286
                            ],
                            "bounds": [
                                [
                                    null,
                                    null
                                ]
                            ]
                        },
                        "display_name": "flow_vol",
                        "description": "Volumetric flowrate in feed",
                        "units": "m**3/s",
                        "readonly": false
                        },
                        "conc_mass_comp": {
                        "value": {
                            "index": [
                                [
                                    0.0,
                                    "cod"
                                ],
                                [
                                    0.0,
                                    "hydrogen"
                                ],
                                [
                                    0.0,
                                    "methane"
                                ]
                            ],
                            "value": [
                                6.76,
                                3.0432136335974136e-05,
                                3.0432136335967197e-05
                            ],
                            "bounds": [
                                [
                                    null,
                                    null
                                ],
                                [
                                    null,
                                    null
                                ],
                                [
                                    null,
                                    null
                                ]
                            ]
                        },
                        "display_name": "conc_mass_comp",
                        "description": "Component mass concentrations",
                        "units": "kg/m**3",
                        "readonly": false
                        }
                    },
                    "blocks": {},
                    "meta": {
                        "parameters": {}
                    },
                    "display_name": "conc_mass_comp",
                    "description": "Zero-Order feed block",
                    "category": ""
                },
                "metab_hydrogen": {
                    "variables": {
                        "volume": {
                            "value": {
                                "value": 1.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "volume",
                            "description": "Reactor volume",
                            "units": "m**3",
                            "readonly": false
                        },
                        "hydraulic_retention_time": {
                            "value": {
                                "value": 6.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "hydraulic_retention_time",
                            "description": "Hydraulic residence time",
                            "units": "hr",
                            "readonly": false
                        },
                        "electricity": {
                            "value": {
                                "index": [
                                    [
                                        0.0
                                    ]
                                ],
                                "value": [
                                    1.0
                                ],
                                "bounds": [
                                    [
                                        0.0,
                                        null
                                    ]
                                ]
                            },
                            "display_name": "electricity",
                            "description": "Electricity demand of unit",
                            "units": "kW",
                            "readonly": false
                        },
                        "heat": {
                            "value": {
                                "index": [
                                    [
                                        0.0
                                    ]
                                ],
                                "value": [
                                    1.0
                                ],
                                "bounds": [
                                    [
                                        0.0,
                                        null
                                    ]
                                ]
                            },
                            "display_name": "heat",
                            "description": "Thermal demand of unit",
                            "units": "kW",
                            "readonly": false
                        },
                        "energy_electric_mixer_vol": {
                            "value": {
                                "value": 0.049875,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "energy_electric_mixer_vol",
                            "description": "Electricity intensity of mixer with respect to reactor volume",
                            "units": "kW/m**3",
                            "readonly": false
                        },
                        "energy_electric_vacuum_flow_vol_byproduct": {
                            "value": {
                                "value": 9.19,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "energy_electric_vacuum_flow_vol_byproduct",
                            "description": "Electricity intensity of vacuum pump with respect to product gas flow",
                            "units": "hr*kW/kg",
                            "readonly": false
                        },
                        "energy_thermal_flow_vol_inlet": {
                            "value": {
                                "value": 7875.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "energy_thermal_flow_vol_inlet",
                            "description": "Thermal energy intensity of reactor with respect to inlet volumetric flowrate",
                            "units": "kJ/m**3",
                            "readonly": false
                        }
                    },
                    "blocks": {
                        "costing": {
                        "variables": {
                            "DCC_bead": {
                            "value": {
                                "value": 1.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "DCC_bead",
                            "description": "Direct capital cost of beads",
                            "units": "USD_2020",
                            "readonly": false
                            },
                            "DCC_reactor": {
                            "value": {
                                "value": 1.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "DCC_reactor",
                            "description": "Direct capital cost of reactor",
                            "units": "USD_2020",
                            "readonly": false
                            },
                            "DCC_mixer": {
                            "value": {
                                "value": 1.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "DCC_mixer",
                            "description": "Direct capital cost of mixer",
                            "units": "USD_2020",
                            "readonly": false
                            },
                            "DCC_vacuum": {
                            "value": {
                                "value": 1.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "DCC_vacuum",
                            "description": "Direct capital cost of vacuum pump",
                            "units": "USD_2020",
                            "readonly": false
                            },
                            "DCC_membrane": {
                            "value": {
                                "value": 1.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "DCC_membrane",
                            "description": "Direct capital cost of membrane",
                            "units": "USD_2020",
                            "readonly": false
                            }
                        },
                        "blocks": {},
                        "meta": {
                            "parameters": {}
                        },
                        "display_name": "DCC_membrane",
                        "description": "none",
                        "category": "costing"
                        }
                    },
                    "meta": {
                        "parameters": {}
                    },
                    "display_name": "energy_thermal_flow_vol_inlet",
                    "description": "Zero-Order model for a METAB bioreactor",
                    "category": ""
                },
                "metab_methane": {
                    "variables": {
                        "volume": {
                            "value": {
                                "value": 1.0,
                                "bounds": [
                                0.0,
                                null
                                ]
                            },
                            "display_name": "volume",
                            "description": "Reactor volume",
                            "units": "m**3",
                            "readonly": false
                        },
                        "hydraulic_retention_time": {
                            "value": {
                                "value": 15.0,
                                "bounds": [
                                    0.0,
                                    null
                                ]
                            },
                            "display_name": "hydraulic_retention_time",
                            "description": "Hydraulic residence time",
                            "units": "hr",
                            "readonly": false
                        },
                        "electricity": {
                            "value": {
                                "index": [
                                    [
                                        0.0
                                    ]
                                ],
                                "value": [
                                    1.0
                                ],
                                "bounds": [
                                    [
                                        0.0,
                                        null
                                    ]
                                ]
                            },
                            "display_name": "electricity",
                            "description": "Electricity demand of unit",
                            "units": "kW",
                            "readonly": false
                        },
                        "heat": {
                            "value": {
                                "index": [
                                    [
                                        0.0
                                    ]
                                ],
                                "value": [
                                    1.0
                                ],
                                "bounds": [
                                    [
                                        0.0,
                                        null
                                    ]
                                ]
                            },
                            "display_name": "heat",
                            "description": "Thermal demand of unit",
                            "units": "kW",
                            "readonly": false
                        },
                        "energy_electric_mixer_vol": {
                        "value": {
                            "value": 0.049875,
                            "bounds": [
                                0.0,
                                null
                            ]
                        },
                        "display_name": "energy_electric_mixer_vol",
                        "description": "Electricity intensity of mixer with respect to reactor volume",
                        "units": "kW/m**3",
                        "readonly": false
                        },
                        "energy_electric_vacuum_flow_vol_byproduct": {
                        "value": {
                            "value": 1.53,
                            "bounds": [
                            0.0,
                            null
                            ]
                        },
                        "display_name": "energy_electric_vacuum_flow_vol_byproduct",
                        "description": "Electricity intensity of vacuum pump with respect to product gas flow",
                        "units": "hr*kW/kg",
                        "readonly": false
                        },
                        "energy_thermal_flow_vol_inlet": {
                        "value": {
                            "value": 0.0,
                            "bounds": [
                            0.0,
                            null
                            ]
                        },
                        "display_name": "energy_thermal_flow_vol_inlet",
                        "description": "Thermal energy intensity of reactor with respect to inlet volumetric flowrate",
                        "units": "kJ/m**3",
                        "readonly": false
                        }
                    },
                "blocks": {},
                "meta": {
                    "parameters": {}
                },
                "display_name": "energy_thermal_flow_vol_inlet",
                "description": "Zero-Order model for a METAB bioreactor",
                "category": ""
                },
                "costing": {
                    "variables": {
                        "utilization_factor": {
                        "value": {
                            "value": 0.85,
                            "bounds": [
                            null,
                            null
                            ]
                        },
                        "display_name": "utilization_factor",
                        "description": "Plant capacity utilization [%]",
                        "units": "",
                        "readonly": false
                        },
                        "TIC": {
                        "value": {
                            "value": 2.0,
                            "bounds": [
                            null,
                            null
                            ]
                        },
                        "display_name": "TIC",
                        "description": "Total Installed Cost (TIC)",
                        "units": "",
                        "readonly": false
                        },
                        "maintenance_costs_percent_FCI": {
                        "value": {
                            "value": 0.03,
                            "bounds": [
                            null,
                            null
                            ]
                        },
                        "display_name": "maintenance_costs_percent_FCI",
                        "description": "Maintenance and contingency costs as % FCI",
                        "units": "1/a",
                        "readonly": false
                        }
                    },
                    "blocks": {},
                    "meta": {
                        "parameters": {}
                    },
                    "display_name": "maintenance_costs_percent_FCI",
                    "description": "Costing block for METAB model",
                    "category": "costing"
                }
            },
            "meta": {
                "parameters": {}
            },
            "display_name": "METAB treatment train",
            "description": "Modular Encapsulated Two-stage Anaerobic Biological model",
            "category": "default"
        }
    },
    "meta": {
        "parameters": {}
    }
      
};


export const getFlowsheet = (id) => {
    return new Promise((resolve, reject) => { 
        resolve(data);
    });
}; 
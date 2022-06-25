



 

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

const data2 = {
    "Feed": {
        "Volumetric flowrate": [0.002341,"m3/h"],
        "Salinity": [0.12323,"ppm"],
        "Temperature": [0.23423,"K"],
        "Pressure": [0.345346,"bar"]
    },
    "Treatment specification": {
        "Recovery": [3.45345,"%"],
        "Maximum product salinity": [43.34534,"ppm"],
        "Maximum allowable pressure": [2.35345,"bar"]
    },
    "Performance parameters": {
        "Pump efficiency": [2.435355,"%"],
        "ERD efficiency": [2.2300122,"%"],
        "Water permeability coeff": [0.23435,"L/(m2-h-bar)"],
        "Salt permeability coeff": [2.456456456,"L/(m2-h)"],
        "RO channel height": [0.234234,"mm"],
        "RO spacer porosity": [1.234234,"%"]
    },
    "Cost parameters": {
        "Electricity cost": [0.345345,"$/kWh"],
        "Membrane cost": [0.56767,"$/m2"],
        "Pump cost": [0.45435,"$/kW"],
        "ERD cost": [0.546456,"$/(m3/h)"],
        "Load factor": [0.3432424,"%"],
        "Capital annualization factor": [234.3434,"%/year"],
        "Membrane replacement factor": [0.2342,"%/year"]
    }
};


const data3 = {
    "id": 1,
    "blocks": {
        "fs": {
            "variables": {
                "max_product_salinity": {
                    "value": {
                        "value": 500.0,
                        "bounds": [null, null]
                    },
                    "display_name": "Maximum product salinity",
                    "description": "",
                    "display_units": "ppm",
                    "indices": [],
                    "scale_factor": 1000000,
                    "to_units": "",
                    "readonly": false,
                    "category": "Treatment specification"
                },
                "max_pressure": {
                    "value": {
                        "value": 85.0, 
                        "bounds": [null, null]
                    },
                    "display_name": "Maximum allowable pressure",
                    "description": "",
                    "display_units": "bar",
                    "indices": [],
                    "scale_factor": 0,
                    "to_units": "bar",
                    "readonly": false,
                    "category": "Treatment specification"
                }
            },
            "blocks": {
                "costing": {
                    "variables": {
                        "electricity_base_cost": {
                            "value": {"value": 0.07,
                                        "bounds": [null, null]
                            },
                            "display_name": "Electricity cost",
                            "description": "Electricity cost",
                            "display_units": "$/kWh",
                            "indices": [],
                            "scale_factor": 0,
                            "to_units": "",
                            "readonly": false,
                            "category": "Cost parameters"
                        },
                        "reverse_osmosis_membrane_cost": {
                            "value": {"value": 30.0,
                                        "bounds": [null, null]
                            },
                            "display_name": "Membrane cost",
                            "description": "Membrane cost",
                            "display_units": "$/m**2",
                            "indices": [],
                            "scale_factor": 0,
                            "to_units": "",
                            "readonly": false,
                            "category": "Cost parameters"
                        },
                        "high_pressure_pump_cost": {
                            "value": {"value": 1908.0000000000002,
                                        "bounds": [null, null]
                            },
                            "display_name": "Pump cost",
                            "description": "High pressure pump cost",
                            "display_units": "USD_2018/kW",
                            "indices": [],
                            "scale_factor": 0,
                            "to_units": "{USD_2018} / kW",
                            "readonly": false,
                            "category": "Cost parameters"
                        },
                        "erd_pressure_exchanger_cost": {
                            "value": {"value": 535.0,
                                    "bounds": [null, null]
                            },
                            "display_name": "ERD cost",
                            "description": "Pressure exchanger cost",
                            "display_units": "$/(m3/h)",
                            "indices": [],
                            "scale_factor": 0,
                            "to_units": "{USD_2018} / (m**3 / hr)",
                            "readonly": false,
                            "category": "Cost parameters"
                        },
                        "load_factor": {
                            "value": {
                                "value": 90.0, 
                                "bounds": [null, null]
                            },
                            "display_name": "Load factor",
                            "description": "Load factor [fraction of uptime]",
                            "display_units": "%",
                            "indices": [],
                            "scale_factor": 100,
                            "to_units": "",
                            "readonly": false,
                            "category": "Cost parameters"
                        },
                        "factor_capital_annualization": {
                            "value": {"value": 10.0,
                                "bounds": [null, null]
                            },
                            "display_name": "Capital annualization factor",
                            "description": "Capital annualization factor [fraction of investment cost/year]",
                            "display_units": "%/year",
                            "indices": [],
                            "scale_factor": 100,
                            "to_units": "",
                            "readonly": false,
                            "category": "Cost parameters"
                        },
                        "factor_membrane_replacement": {
                            "value": {"value": 20.0,
                                "bounds": [null, null]
                            },
                            "display_name": "Membrane replacement factor",
                            "description": "Membrane replacement factor [fraction of membrane replaced/year]",
                            "display_units": "%/year",
                            "indices": [],
                            "scale_factor": 100,
                            "to_units": "",
                            "readonly": false,
                            "category": "Cost parameters"
                        }
                    },
                    "blocks": {},
                    "meta": {"parameters": {}
                    },
                    "display_name": "factor_membrane_replacement",
                    "description": "none"
                },
                "pump": {
                    "variables": {
                        "efficiency_pump": {"value": {"value": 80.0,
                                            "bounds": [null, null]
                                },
                            "display_name": "Pump efficiency",
                            "description": "Pump efficiency",
                            "display_units": "%",
                            "indices": [
                                    0
                                ],
                            "scale_factor": 100,
                            "to_units": "",
                            "readonly": false,
                            "category": ""
                            }
                        },
                    "blocks": {},
                    "meta": {"parameters": {}
                        },
                    "display_name": "efficiency_pump",
                    "description": "none"
                    },
                "RO": {
                    "variables": {
                        "recovery_vol_phase": {
                            "value": {"value": 25.0,
                                    "bounds": [1.0,99.9999]
                                },
                            "display_name": "Recovery",
                            "description": "Volumetric recovery rate",
                            "display_units": "%",
                            "indices": [
                                    0, "Liq"
                                ],
                            "scale_factor": 100,
                            "to_units": "",
                            "readonly": false,
                            "category": "Treatment specification"
                            },
                        "A_comp": {
                            "value": {"value": 1.5120000000000005,
                                    "bounds": [1e-18,1e-06]
                                },
                            "display_name": "Water permeability coeff",
                            "description": "Solvent permeability coeff.",
                            "display_units": "mm/(bar h)",
                            "indices": [
                                    0, "H2O"
                                ],
                            "scale_factor": 0,
                            "to_units": "mm / hr / bar",
                            "readonly": false,
                            "category": "Performance parameters"
                            },
                        "B_comp": {"value": {"value": 0.126, "bounds": [1e-11,
                                    1e-05]
                                },
                            "display_name": "Salt permeability coeff",
                            "description": "Solute permeability coeff.",
                            "display_units": "mm/h",
                            "indices": [
                                    0, "TDS"
                                ],
                            "scale_factor": 0,
                            "to_units": "mm / hr",
                            "readonly": false,
                            "category": "Performance parameters"
                            },
                        "channel_height": {"value": {"value": 1.0, "bounds": [0.0001,
                                    0.005]
                                },
                            "display_name": "RO channel height",
                            "description": "Feed-channel height",
                            "display_units": "mm",
                            "indices": [],
                            "scale_factor": 0,
                            "to_units": "mm",
                            "readonly": false,
                            "category": "Performance parameters"
                            },
                        "spacer_porosity": {"value": {"value": 97.0, "bounds": [10.0,
                                    99.0]
                                },
                            "display_name": "RO spacer porosity",
                            "description": "Feed-channel spacer porosity",
                            "display_units": "%",
                            "indices": [],
                            "scale_factor": 100,
                            "to_units": "",
                            "readonly": false,
                                "category": "Performance parameters"
                            }
                        },
                "blocks": {},
                "meta": {"parameters": {}
                        },
                "display_name": "spacer_porosity",
                "description": "none"
                    },
                "erd": {
                    "variables": {
                            "efficiency_pump": {
                                "value": {"value": 80.0,
                                    "bounds": [null, null]
                                },
                                "display_name": "ERD efficiency",
                                "description": "Pump efficiency",
                                "display_units": "%",
                                "indices": [
                                                    0
                                                ],
                                "scale_factor": 100,
                                "to_units": "",
                                "readonly": false,
                                "category": ""
                            }
                        },
                    "blocks": {},
                    "meta": {"parameters": {}
                          },
                    "display_name": "efficiency_pump",
                    "description": "none"
                }
            },
            "meta": {"parameters": {}
            },
            "display_name": "max_pressure",
            "description": "none"
        }
    },
    "meta": {"parameters": {}
    }
};



export const getFlowsheet = (id) => {
    return fetch('http://localhost:8001/flowsheets/'+id+'/config', {mode: 'cors'});
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
        method: 'POST', 
        mode: 'cors'
    });
}; 
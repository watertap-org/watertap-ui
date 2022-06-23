



 

const data = `
<p>
Performance results<br/>
-------------------<br/>
<br/>
====================================================================================<br/>
Unit : fs.feed                                                             Time: 0.0<br/>
------------------------------------------------------------------------------------<br/>
    Stream Table<br/>
                                        Units            Outlet<br/>
    Volumetric Flowrate            meter ** 3 / second 0.00032860<br/>
    Mass Concentration H2O       kilogram / meter ** 3     993.24<br/>
    Mass Concentration cod       kilogram / meter ** 3     6.7600<br/>
    Mass Concentration hydrogen  kilogram / meter ** 3 3.0432e-05<br/>
    Mass Concentration methane   kilogram / meter ** 3 3.0432e-05<br/>
====================================================================================<br/>
<br/>
====================================================================================<br/>
Unit : fs.metab_hydrogen                                                   Time: 0.0<br/>
------------------------------------------------------------------------------------<br/>
    Unit Performance<br/>
    <br/>
    Variables:<br/>
    <br/>
    Key                               : Value      : Units             : Fixed : Bounds<br/>
                   Electricity Demand :     1162.7 :              watt : False : (0, None)<br/>
    Reaction Extent [cod_to_hydrogen] : 0.00048869 : kilogram / second : False : (None, None)<br/>
                 Solute Removal [cod] :     0.0000 :     dimensionless :  True : (0, None)<br/>
            Solute Removal [hydrogen] :     1.0000 :     dimensionless :  True : (0, None)<br/>
             Solute Removal [methane] :     0.0000 :     dimensionless :  True : (0, None)<br/>
                Thermal Energy Demand :     2587.7 :              watt : False : (0, None)<br/>
                       Water Recovery :     1.0000 :     dimensionless :  True : (1e-08, 1.0000001)<br/>
                       <br/>
------------------------------------------------------------------------------------<br/>
    Stream Table<br/>
                                        Units             Inlet     Treated   Byproduct<br/>
    Volumetric Flowrate            meter ** 3 / second 0.00032860 0.00032811 2.4445e-08<br/>
    Mass Concentration H2O       kilogram / meter ** 3     993.24     994.72 1.3741e-13<br/>
    Mass Concentration cod       kilogram / meter ** 3     6.7600     5.2807 1.3741e-13<br/>
    Mass Concentration hydrogen  kilogram / meter ** 3 3.0432e-05 1.3538e-17     1000.0<br/>
    Mass Concentration methane   kilogram / meter ** 3 3.0432e-05 3.0477e-05 1.3741e-13<br/>
====================================================================================<br/>
<br/>
====================================================================================<br/>
Unit : fs.metab_methane                                                    Time: 0.0<br/>
------------------------------------------------------------------------------------<br/>
    Unit Performance<br/>
    <br/>
    Variables:<br/>
    <br/>
    Key                              : Value      : Units             : Fixed : Bounds<br/>
                  Electricity Demand :     1452.4 :              watt : False : (0, None)<br/>
    Reaction Extent [cod_to_methane] :  0.0010223 : kilogram / second : False : (None, None)<br/>
                Solute Removal [cod] :     0.0000 :     dimensionless :  True : (0, None)<br/>
           Solute Removal [hydrogen] :     0.0000 :     dimensionless :  True : (0, None)<br/>
            Solute Removal [methane] :     1.0000 :     dimensionless :  True : (0, None)<br/>
               Thermal Energy Demand : 3.3589e-13 :              watt : False : (0, None)<br/>
                      Water Recovery :     1.0000 :     dimensionless :  True : (1e-08, 1.0000001)<br/>
                      <br/>
------------------------------------------------------------------------------------<br/>
    Stream Table<br/>
                                        Units             Inlet     Treated   Byproduct<br/>
    Volumetric Flowrate            meter ** 3 / second 0.00032811 0.00032709 1.0326e-07<br/>
    Mass Concentration H2O       kilogram / meter ** 3     994.72     997.83 3.2529e-14<br/>
    Mass Concentration cod       kilogram / meter ** 3     5.2807     2.1718 3.2529e-14<br/>
    Mass Concentration hydrogen  kilogram / meter ** 3 1.3538e-17 1.3580e-17 3.2529e-14<br/>
    Mass Concentration methane   kilogram / meter ** 3 3.0477e-05 8.4845e-20     1000.0<br/>
====================================================================================<br/>
Costing results<br/>
---------------<br/>
total_capital_cost : Total capital cost of process<br/>
    Size=1, Index=None, Units=USD_2020<br/>
    Key  : Lower : Value              : Upper : Fixed : Stale : Domain<br/>
    None :  None : 11823.499661517928 :  None : False : False :  Reals<br/>
total_operating_cost : Size=1<br/>
    Key  : Value<br/>
    None : 2712.285569717763<br/>
LCOW : Size=1<br/>
    Key  : Value<br/>
    None : 0.39679637906195503<br/>
    <br/>
Unit Capital Costs<br/>
<br/>
fs.metab_hydrogen.costing  :    4485.977310142091<br/>
fs.metab_methane.costing  :    7474.359231054592<br/>
<br/>
Utility Costs<br/>
<br/>
electricity  :    1855.184855203363<br/>
heat  :    503.90571098154373<br/>
hydrogen_product  :    -1560.6875315073473<br/>
methane_product  :    -1005.3689485532468<br/>
<br/>
Total Capital Costs: 0.0120 M$<br/>
Total Operating Costs: 0.0027 M$/year<br/>
Electricity Intensity: 2.2209 kWh/m^3<br/>
Levelized Cost of Water: 0.3968 $/m^3<br/>
Levelized Cost of COD Removal: 0.0859 $/kg<br/>
Levelized Cost of Hydrogen: 3.4632 $/kg<br/>
Levelized Cost of Methane: 1.2266 $/kg<br/>
</p>
`;


export const solve = (flowsheetData) => {
    return new Promise((resolve, reject) => { 
        resolve(data);
    });
}; 
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Box, Paper, Stack, Toolbar, Tabs, Tab } from '@mui/material';
import OutputComparisonTable from "../../../components/OutputComparisonTable/OutputComparisonTable.js";
import OutputComparisonChart from "../../../components/OutputComparisonChart/OutputComparisonChart.js";
import { loadConfig, listConfigNames }  from '../../../services/output.service.js'

export default function OutputComparison(props) {
    let params = useParams(); 
    const { outputData } = props;
    const [ pastConfigs, setPastConfigs ] = useState([])
    const [ historyData, setHistoryData ] = useState([])
    const [ historyDataOrganized, setHistoryDataOrganized ] = useState([])
    const [ categoriesWithCharts, setCategoriesWithCharts ] = useState([])
    const [ chartData, setChartData ] = useState([])
    const [ disableChartView, setDisableChartView ] = useState(true)
    const [ tabValue, setTabValue ] = useState(0)

    useEffect(() => {
      if (historyData.length > 1) {
        try{
          organizeVariables()
        } catch (e){
          console.error("unable to organize variables")
        }
      }
    }, [historyData])

    useEffect(() => {
      if (historyData.length > 1) {
        try{
          organizeChartData()
        } catch (e){
          console.error("unable to organize chart data")
          console.log(e)
        }
      }
    }, [historyData])

    useEffect(()=>{
      listConfigNames(params.id, outputData.inputData.version)
      .then(response => response.json())
      .then((data)=>{
        setPastConfigs(data)
        var tempHistory = []
        for (const config of data) {
          loadConfig(params.id, config)
          .then(response => response.json())
          .then((data2)=>{
            tempHistory.push({name: config.replaceAll('"',''), data:data2})
            setHistoryData([...tempHistory])
          }).catch((err)=>{
              console.error("unable to get load config: ",err)
          });
      }
      }).catch((err)=>{
          console.error("unable to get list of config names: ",err)
      })
      
    }, []);

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue)
    }

    const organizeVariables = () => {
      var tempHistory = []
      for (const bvars of historyData) {
        let raw_inputs = {}
        let raw_outputs = {}
        let raw_variables = {}
        let var_sections = {}
        let tempVariables = {}
        let tempName = bvars.name
        for (const [key, v] of Object.entries(bvars.data.outputData.exports)) {
            let catg
            let is_input = v.is_input
            let is_output = v.is_output
            raw_variables[key] = v
            if (is_input) { 
              raw_inputs[key] = v
              catg = v.input_category
            }
            if (is_output) { 
              raw_outputs[key] = v
              catg = v.output_category
            }
            if (catg === null) {
                catg = ""
            }
            if (!Object.hasOwn(var_sections, catg)) {
                var_sections[catg] = {display_name: catg, variables: [], input_variables:[], output_variables:[]}
            }
            if (!Object.hasOwn(tempVariables, catg)) {
              tempVariables[catg] = {variables: [], input_variables:[], output_variables:[]}
          }
          tempVariables[catg].variables.push(v)
          var_sections[catg]["variables"] = [...tempVariables[catg].variables];
            if(is_output) {
              tempVariables[catg].output_variables.push(v)
              var_sections[catg]["output_variables"] = [...tempVariables[catg].output_variables];
            }
        }
        tempHistory.push({name: tempName, data: var_sections, raw: {data: raw_variables, inputs: raw_inputs, outputs: raw_outputs}})
        // setHistoryDataOrganized([...tempHistory])

        let tempHistoryDataOrganized = [...tempHistory]
        let tempCategoriesWithCharts = []
        for (let optimization of tempHistoryDataOrganized) {
            // let optimization = tempHistoryDataOrganized[optimizationKey]
            let optimizationData = optimization.data
            for (let categoryKey of Object.keys(optimizationData)) {
                let categoryData = optimizationData[categoryKey]
                let categoryVariables = categoryData.output_variables
                if (categoryVariables.length > 0) {
                    let displayUnits = categoryVariables[0].display_units
                    categoryData.hasChart = true
                    for(let output_variable of categoryVariables) {
                        // check if display units match
                        if (output_variable.display_units !== displayUnits) {
                            categoryData.hasChart = false
                        }
                    }
                    if(categoryData.hasChart && !tempCategoriesWithCharts.includes(categoryKey)) tempCategoriesWithCharts.push(categoryKey)
                } else {
                    categoryData.hasChart = false
                }
            }
        }
        setHistoryDataOrganized(tempHistoryDataOrganized)
      }
      
    }

    const organizeChartData = () => {
      // return
      var tempChartData = []
      let tempDisableChartView = true
      for (const bvars of historyData) {
        let raw_inputs = {}
        let raw_outputs = {}
        let raw_variables = {}
        let var_sections = {}
        let tempVariables = {}
        let tempName = bvars.name
        for (const [key, v] of Object.entries(bvars.data.outputData.exports)) {
            let catg = v.chart_group
            let chartType = v.chart_type
            if (catg) {
              tempDisableChartView = false
              let is_input = v.is_input
              let is_output = v.is_output
              
              raw_variables[key] = v
              if (is_input) { 
                raw_inputs[key] = v
                catg = v.input_category
              }
              if (is_output) { 
                raw_outputs[key] = v
                catg = v.output_category
              }
              if (catg === null) {
                  catg = ""
              }
              if (!Object.hasOwn(var_sections, catg)) {
                  var_sections[catg] = {display_name: catg, variables: [], input_variables:[], output_variables:[], chartType: chartType}
              }
              if (!Object.hasOwn(tempVariables, catg)) {
                tempVariables[catg] = {variables: [], input_variables:[], output_variables:[], chartType: chartType}
              }
              tempVariables[catg].variables.push(v)
              var_sections[catg]["variables"] = [...tempVariables[catg].variables];
              if(is_output) {
                tempVariables[catg].output_variables.push(v)
                var_sections[catg]["output_variables"] = [...tempVariables[catg].output_variables];
              }
          }
          
        }
        tempChartData.push({name: tempName, data: var_sections, raw: {data: raw_variables, inputs: raw_inputs, outputs: raw_outputs}})

        let tempChartDataOrganized = [...tempChartData]
        let tempCategoriesWithCharts = []
        for (let optimization of tempChartDataOrganized) {
            let optimizationData = optimization.data
            for (let categoryKey of Object.keys(optimizationData)) {
                let categoryData = optimizationData[categoryKey]
                let categoryVariables = categoryData.output_variables
                if (categoryVariables.length > 0) {
                    let displayUnits = categoryVariables[0].display_units
                    categoryData.hasChart = true
                    for(let output_variable of categoryVariables) {
                        // check if display units match
                        if (output_variable.display_units !== displayUnits) {
                            categoryData.hasChart = false
                        }
                    }
                    if(categoryData.hasChart && !tempCategoriesWithCharts.includes(categoryKey)) tempCategoriesWithCharts.push(categoryKey)
                } else {
                    categoryData.hasChart = false
                }
            }
        }
        setChartData(tempChartDataOrganized)
        setCategoriesWithCharts(tempCategoriesWithCharts)
      }
      setDisableChartView(tempDisableChartView)
    }

  return (

        <Box> 
            <Grid item xs={12}> 
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
                        <Tab label="Table View" />
                        <Tab label="Chart View" disabled={disableChartView}/> 
                    </Tabs>
                </Box>
                
            </Grid>
            {  tabValue === 0 &&
                <OutputComparisonTable
                  historyData={historyDataOrganized}
                />
            }
            {  tabValue === 1 &&
                <OutputComparisonChart 
                  flowsheetData={outputData}
                  historyData={chartData}
                  categoriesWithCharts={categoriesWithCharts}
                />
            }
        </Box>
      
  );
}

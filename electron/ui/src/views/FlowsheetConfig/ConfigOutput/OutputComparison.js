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
    const [ tabValue, setTabValue ] = useState(0)

    useEffect(() => {
      if (historyData.length > 1) {
        try{
          organizeVariables()
        } catch {
          console.error("unable to organize variables")
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
        let var_sections = {}
        let tempVariables = {}
        let tempName = bvars.name
        for (const [key, v] of Object.entries(bvars.data.outputData.model_objects)) {
            
            let catg
            let is_input = v.is_input
            let is_output = v.is_output
            if (is_input) catg = v.input_category
            if (is_output) catg = v.output_category
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
        tempHistory.push({name: tempName, data: var_sections})
        setHistoryDataOrganized([...tempHistory])
      }
      
    }

  return (

        <Box> 
            <Grid item xs={12}> 
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
                        <Tab label="Table View" />
                        <Tab label="Chart View" /> 
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
                  outputData={outputData}
                  historyData={historyDataOrganized}  
                />
            }
        </Box>
      
  );
}

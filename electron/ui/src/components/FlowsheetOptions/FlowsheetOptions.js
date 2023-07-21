// React base
import React from 'react';
import {useEffect, useState} from 'react';
// MUI components
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
/* import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; */

/**
 * FlowsheetOptions component.
 *
 * Create a box showing the flowsheet options, which users can edit to set
 * new values.
 *
 * Assume that there actually *are* options to display in the component.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function FlowsheetOptions({data}) {
    console.info("All data =>", data);
    let options = data.options;
    console.info("Option data =>", options);
    // Whether the values have changed
    const [changed, setChanged] = useState(false);

    // XXX: For accordion open/close
    const [expanded, setExpanded] = useState(false);
    // XXX: For accordion open/close
    const handleAccordionChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded);
    };

    /**
     * Convert input value to type specified in 't', which may be one of:
     *   's' - string (no conversion)
     *   'i' - integer
     *   'f' - float
     *
     *   @returns {String|Number}
     */
    const convertValue = (v, t) => {
        let cv = null;
        switch (t) {
            case 's':
                cv = v;
                break;
            case 'i':
                cv = parseInt(v);
                break;
            case 'f':
                cv = parseFloat(v);
                break;
            default:
                console.warning('Unknown type code: "' + t + '": not converting value:',v)
                cv = v;
        }
        return cv;
    }

    /**
     * Render all the flowsheet options for inclusion in an Accordion parent component.
     * This is the main work of this component.
     *
     * @returns {JSX.Element}
     */
    const renderOptionItems = () => {
        let optionItems = Array();
        for (const [key, opt] of Object.entries(options)) {
            // create setOption function for this option
            const setOption = (value) =>  {
                if (value != opt.value) {
                    opt.value = value;
                    setChanged(true);
                }
            }
            // create and add a new TextField to the list
            optionItems.push(
                <Tooltip
                    title={
                      <React.Fragment>
                        <Typography variant="body1">{opt.description}</Typography>
                        <Typography variant="body2">{opt.long_description}</Typography>
                      </React.Fragment>
                }>
                    <TextField
                        id={key}
                        label={opt.display_name}
                        variant="outlined"
                        value={opt.value}
                        onChange={(event) => {
                            setOption(event.target.value);
                        }} />
                </Tooltip>
            );
        }
        // Put a Box around all the TextField components
        return <Box>{optionItems}</Box>
    }

    // Create and return an Accordion component with the option items inside it
    return (
        <Accordion defaultExpanded="{true}">
            <AccordionSummary>Flowsheet options</AccordionSummary>
            {renderOptionItems()}
        </Accordion>
    )

}
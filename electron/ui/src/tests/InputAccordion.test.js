import { render, screen } from '@testing-library/react';
import InputAccordion from "../components/InputAccordion/InputAccordion"

//mock props
const key = ""

const mockSections = {
    "": {
      "display_name": "",
      "variables": {
        "flow_vol": {
          "value": {
            "index": [
              [
                0
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
          "display_units": "m<sup>3</sup>/s",
          "indices": [],
          "scale_factor": 0,
          "to_units": "",
          "readonly": false,
          "category": ""
        },
      }
    }
  }

test('test input accordion', () => {

    render( <InputAccordion dataKey={key} data={mockSections[key]}></InputAccordion> )

    //test for component elements
    screen.getByRole('button', {  name: ""});
    screen.getByRole('region', {  name: ""});
    screen.getByRole('textbox', {  name: /flow_vol/i});

})
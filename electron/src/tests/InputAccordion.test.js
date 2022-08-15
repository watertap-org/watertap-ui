import { render, screen } from '@testing-library/react';
import InputAccordion from "../components/InputAccordion/InputAccordion"
import * as React from 'react'
import mockSections from './data/InputAccordion.json'

//mock props
const key = ""


test('test input accordion', () => {

    render( <InputAccordion dataKey={key} data={mockSections[key]}></InputAccordion> )

    //test for component elements
    screen.getByRole('button', {  name: ""});
    screen.getByRole('region', {  name: ""});
    screen.getByRole('textbox', {  name: /flow_vol/i});

})
import { render, screen } from '@testing-library/react';
import InputAccordion from "../components/InputAccordion/InputAccordion"
import * as React from 'react'
import mockData from './data/InputAccordion.json'


test('test input accordion', () => {

    render( <InputAccordion data={mockData}></InputAccordion> )

    //test for component elements
    screen.getByRole('button', {  name: /uncategorized/i});
    screen.getByRole('region', {  name: ""});
    screen.getByRole('textbox', {  name: /Tank 1 inlet flowrate/i});

})
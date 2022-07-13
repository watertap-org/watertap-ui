import { render, screen } from '@testing-library/react';
import SolveDialog from "../components/SolveDialog/SolveDialog"
import * as React from 'react'
import flowsheetData from './data/SolveDialog.json'

//mock props
const solveDialogOpen = true
const mockhandleSolved = (data) => {
    console.log("handle solved.....",data);
};

const id = 1;

test('test input accordion', () => {

    render( <SolveDialog open={solveDialogOpen} handleSolved={mockhandleSolved} flowsheetData={flowsheetData} id={id}></SolveDialog> )

    //test for component elements
    screen.getAllByRole('presentation', {  name: ""});
    screen.getByRole('dialog', {  name: ""});
    screen.getByRole('heading', {  name: ""});
    screen.getByRole('progressbar', {  name: ""});

})
import { render, screen } from '@testing-library/react';
import NewFlowsheetDialog from "../components/NewFlowsheetDialog/NewFlowsheetDialog"
import * as React from 'react'

//mock props
const open = true
const mockClose = () => {
    console.log("close");
};

test('test new flowsheet dialog', () => {
    render( <NewFlowsheetDialog open={open} onClose={mockClose}></NewFlowsheetDialog> )

    screen.getByRole('heading', {  name: /Upload a new flowsheet/i});
    screen.getByRole('heading', {  name: /Drag and drop Model File or Browse.../i});
    screen.getByRole('heading', {  name: /Drag and drop Export File or Browse.../i});
    screen.getByRole('heading', {  name: /Drag and drop Diagram File or Browse.../i});
    screen.getByRole('heading', {  name: /Drag and drop Data Files or Browse.../i});
    screen.getByRole('button', {  name: /upload flowsheet/i})

    //screen.debug();
})
import { render, screen } from '@testing-library/react';
import FlowsheetsListTable from "../components/FlowsheetsListTable/FlowsheetsListTable"
// import test_data from '../../../../backend/data/flowsheets/fake/data.json'
import * as React from 'react'

let test_data = [{
    name: "METAB treatment train",
    train: "Modular Encapsulated Two-stage Anaerobic Biological model",
    id: 0
}]

test('test flowsheets list table', () => {
    render( <FlowsheetsListTable rows={test_data}/> )

    // These find the same <td> element with the name and link to the treatment train
    expect(screen.getByRole('cell', {  name: /METAB treatment train/i}))
    expect(screen.getByRole('link', {  name: /METAB treatment train/i}))
    // This finds the description ('train') <td> element
    expect(screen.getByRole('cell', { name: /anaerobic/i}))
    // This finds the button
    expect(screen.getByRole('button', { name: /edit project/i }))

})
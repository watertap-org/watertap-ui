import { render, screen } from '@testing-library/react';
import FlowsheetsListTable from "../components/FlowsheetsListTable/FlowsheetsListTable"
import mockData from './data/FlowsheetsListTable.json'
import * as React from 'react'

test('test flowsheets list table', () => {
    render( <FlowsheetsListTable rows={[mockData]}/> )

    expect(screen.getByRole('cell', {  name: /METAB treatment train/i}))
    expect(screen.getByRole('link', {  name: /METAB treatment train/i}))
    expect(screen.getByRole('button', { name: /edit project/i }))

})
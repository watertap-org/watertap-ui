import { render, screen } from '@testing-library/react';
import FlowsheetsListTable from "../components/FlowsheetsListTable/FlowsheetsListTable"
import mockData from './data/FlowsheetsListTable.json'
import * as React from 'react'

test('test flowsheets list table', () => {
    render( <FlowsheetsListTable rows={[mockData]}/> )

    expect(screen.getByRole('table', {  name: /simple table/i}))
    expect(screen.getByRole('columnheader', {  name: /name/i}))
    expect(screen.getByRole('columnheader', {  name: /Last Run/i}))
    expect(screen.getByRole('button', { name: /edit project/i }))

})
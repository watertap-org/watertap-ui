import { render, screen } from '@testing-library/react';
import FlowsheetsListTable from "../components/FlowsheetsListTable/FlowsheetsListTable"
import mockData from './data/FlowsheetsListTable.json'
import * as React from 'react'
import { HashRouter } from "react-router-dom";

test('test flowsheets list table', () => {
    render( <HashRouter><FlowsheetsListTable rows={[mockData]}/></HashRouter> )

    expect(screen.getByRole('table', {  name: /simple table/i}))
    expect(screen.getByRole('columnheader', {  name: /flowsheet name/i}))
    expect(screen.getByRole('columnheader', {  name: /last run/i}))

})
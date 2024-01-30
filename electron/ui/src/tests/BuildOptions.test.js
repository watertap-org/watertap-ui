import { render, screen } from '@testing-library/react';
import BuildOptions from "../components/BuildOptions/BuildOptions"
import * as React from 'react'
import flowsheetData from './data/BuildOptionsData.json'

//mock props
const setFlowsheetData = () => {
    console.log('set flowsheet data')
}
const setShowBuildOptions = () => {
    console.log('set build options')
}
const runBuildFlowsheet = () => {
    console.log('run build flowsheet')
}

test('test build options', () => {

    render( 
        <BuildOptions
            flowsheetData={flowsheetData} 
            tabValue={0} 
            isBuilt={true} 
            showBuildOptions={true}
            setShowBuildOptions={setShowBuildOptions} 
            runBuildFlowsheet={runBuildFlowsheet}
            setFlowsheetData={setFlowsheetData}
        />
    )

    //test for component elements
    screen.getByRole('textbox', {  name: /String Option/i});
    screen.getByRole('textbox', {  name: /Int Option/i});
    screen.getByRole('textbox', {  name: /Float Option/i});

    screen.getByRole('button', {  name: /Re-build Flowsheet/i});
    screen.getByRole('button', {  name: /List Option valid option a/i});
    screen.getByRole('heading', {  name: /Model Options/i});
})

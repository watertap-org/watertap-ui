import { render, screen } from '@testing-library/react';
import InputWrapper from "../components/InputWrapper/InputWrapper"
import * as React from 'react'
import fieldData from './data/InputWrapper.json'

//mock props
const key = "flow_vol"

test('test input wrapper', () => {

    render( <InputWrapper key={key} fieldData={fieldData}></InputWrapper> )

    //test for component elements
    screen.getByRole('textbox', {  name: /flow_vol/i});


})
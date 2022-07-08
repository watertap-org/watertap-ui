import { render, screen } from '@testing-library/react';
import Header from "../components/Boilerplate/Header/Header"
import * as React from 'react'

//mock props

test('test input accordion', () => {

    render( <Header></Header> )

    //test for component elements
    screen.getByRole('link', {  name: /NAWI logo/i});
    screen.getByRole('img', {  name: /NAWI logo/i});
})
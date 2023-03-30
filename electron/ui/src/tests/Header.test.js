import { render, screen } from '@testing-library/react';
import Header from "../components/Boilerplate/Header/Header"
import * as React from 'react'
import { HashRouter } from "react-router-dom";

//mock props

test('test input accordion', () => {

    render( <HashRouter><Header show={true}></Header></HashRouter> )

    //test for component elements
    screen.getByRole('img', {  name: /NAWI logo/i});
})
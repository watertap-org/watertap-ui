import { render, screen } from '@testing-library/react';
import Graph from "../components/Graph/Graph"
import * as React from 'react'
//mock props

test('test input accordion', () => {

    render( <Graph></Graph> )

    //test for component elements
    screen.getByRole('heading', {  name: /no diagram found/i});
})
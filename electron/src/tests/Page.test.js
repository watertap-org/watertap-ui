import { render, screen } from '@testing-library/react';
import Page from "../components/Page/Page"
import * as React from 'react'

//mock props

test('test input accordion', () => {

    render( <Page></Page> )

    //test for component elements
    screen.getByRole('heading', {  name: /no diagram found/i});
})
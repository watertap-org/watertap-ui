import { render, screen } from '@testing-library/react';
import Page from "Components/Page/Page"

//mock props

test('test input accordion', () => {

    render( <Page></Page> )

    //test for component elements
    screen.getByRole('img', {  name: /flowsheet/i});
})
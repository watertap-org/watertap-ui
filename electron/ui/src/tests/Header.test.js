import { render, screen } from '@testing-library/react';
import Header from "Components/Boilerplate/Header/Header"

//mock props

test('test input accordion', () => {

    render( <Header></Header> )

    //test for component elements
    screen.getByRole('link', {  name: /NAWI logo/i});
    screen.getByRole('img', {  name: /NAWI logo/i});
})
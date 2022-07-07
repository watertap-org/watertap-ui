import { render, screen } from '@testing-library/react';
import NewFlowsheetDialog from "Components/NewFlowsheetDialog/NewFlowsheetDialog"


//mock props
const open = true
const mockClose = () => {
    console.log("close");
};

test('test new flowsheet dialog', () => {
    render( <NewFlowsheetDialog open={open} onClose={mockClose}></NewFlowsheetDialog> )

    //test that all textboxes are present
    screen.getByRole('textbox', {  name: /flowsheet name/i});
    screen.getByRole('textbox', {  name: /has bypass/i});
    screen.getByRole('textbox', {  name: /has desal feed/i});
    screen.getByRole('textbox', {  name: /is twostage/i});
    screen.getByRole('textbox', {  name: /has erd/i});
    screen.getByRole('textbox', {  name: /nf type/i});
    screen.getByRole('textbox', {  name: /nf base/i});
    screen.getByRole('textbox', {  name: /ro type/i});
    screen.getByRole('textbox', {  name: /ro base/i});
    screen.getByRole('textbox', {  name: /ro level/i});

    //test that cancel and create buttons are present
    screen.getByRole('button', {  name: /cancel/i})
    screen.getByRole('button', {  name: /create/i})

    //screen.debug();
})
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import Header from '../components/Boilerplate/Header/Header';
import {theme} from '../theme';

// Test the header
test('page header', () => {
    render( <HashRouter><Header show={true}></Header></HashRouter> );
    // Test that project name is in the 'alt=' text for the logo image
    const projectName = new RegExp(`${theme.project}.*`);
    expect(screen.getByAltText(projectName)).toBeDefined();
    // Test that there is a menu button
    expect(screen.getByRole('button')).toBeDefined();
})
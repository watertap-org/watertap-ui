import { render, screen, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import Header from '../components/Boilerplate/Header/Header';
import {themes} from '../theme';

// Test the header
test('page header', () => {
    const theme = themes['watertap'];
    render( <HashRouter><Header theme={theme}></Header></HashRouter> );

    // Wait for menu button
    waitFor(() => expect(screen.getByRole('button')).toBeDefined());

    // Test that project name is in the 'alt=' text for the logo image
    const projectName = new RegExp(`${theme.project}.*`);
    expect(screen.getByTestId("project-logo").getAttribute("alt")).toMatch(projectName);


})
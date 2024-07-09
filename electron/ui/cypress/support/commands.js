/**
 * Commands for use across the end-to-end tests.
 */
import '@testing-library/cypress/add-commands';

/**
 * Go to home page of the app
 *
 * From page: any
 */
Cypress.Commands.add('load_flowsheets_list', () => {
    cy.visit('/')
    cy.screenshot('loaded flowsheet list page')
})

/**
 * Load the RO with energy recovery flowsheet
 *
 * From page: flowsheet list
 */
Cypress.Commands.add('load_ro_flowsheet', () => {
    const flowsheet_name = 'RO with energy recovery flowsheet';
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:8001/flowsheets/**',
    }).as('loadFlowsheet');
    cy.findByText(flowsheet_name).click();
    cy.wait('@loadFlowsheet');
    cy.screenshot('loaded flowsheet');
})

/**
 * Set the water mass flowrate [input] to the given value
 *
 * From page: Inputs
 */
Cypress.Commands.add('set_ro_flowrate', (value) => {
    let input_textbox_name = 'Water mass flowrate';
    let input_textbox = cy.findByRole('textbox', {name: input_textbox_name});
    input_textbox.click({force:true});
    input_textbox = cy.findByRole('textbox', {name: input_textbox_name});
    input_textbox.type('{backspace}{backspace}{backspace}{backspace}' + value);
    cy.wait(500);
})

/**
 * Solve the flowsheet
 *
 * From page: Inputs
 */
Cypress.Commands.add('solve_flowsheet', () => {
    cy.intercept({
        method: 'POST',
        url: 'http://localhost:8001/flowsheets/**',
    }).as('run');
    cy.findAllByRole('button', {name: /run/i}).eq(0).click();
    cy.wait('@run');
})

/**
 * Open logging panel
 *
 * From page: Any
 */
Cypress.Commands.add('open_logging_panel', () => {
    cy.get('.header-actions').click();
    cy.wait(500);
    cy.get('.view-logs').click();
    cy.wait(500);
})


/**
 * Commands for use across the end-to-end tests.
 */
import '@testing-library/cypress/add-commands';
require('cypress-downloadfile/lib/downloadFileCommand');

/**
 * Go to home page of the app
 *
 * From page: any
 */
Cypress.Commands.add('load_flowsheets_list', () => {
    cy.visit('/')
})

/**
 * Load flowsheet
 *
 * From page: flowsheet list
 */
Cypress.Commands.add('load_flowsheet', (flowsheet_name) => {
    // const flowsheet_name = 'RO with energy recovery flowsheet';
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:8001/flowsheets/**',
    }).as('loadFlowsheet');
    cy.findByText(flowsheet_name).click();
    cy.wait('@loadFlowsheet', {timeout: 90000});
})

/**
 * Build flowsheet
 *
 * From page: flowsheet
 */
Cypress.Commands.add('build_flowsheet', () => {
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:8001/flowsheets/**',
    }).as('buildFlowsheet');
    cy.get('#build-flowsheet-button').click()
    cy.wait('@buildFlowsheet', {timeout: 90000});
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
    cy.wait('@run', {timeout: 90000});
})

/**
 * Save configuration
 *
 * From page: Output
 */
Cypress.Commands.add('save_configuration', () => {
    cy.intercept({
        method: "POST",
        url: "http://localhost:8001/flowsheets/**",
    }).as("saveConfig");
    cy.findByRole('button', {name: /save/i}).click()
    cy.wait("@saveConfig");
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

/**
 * Enter text into element based on role and name
 *
 * From page: Inputs
 */
Cypress.Commands.add('enter_text', (identifier, role_or_class, value, name ) => {
    let input_textbox
    if (identifier === "role") {
        input_textbox = cy.findByRole(role_or_class, {name: name});
    }
    else if (identifier === "class") {
        input_textbox = cy.get('.'+role_or_class);
    }
    input_textbox.click({force:true});
    if (identifier === "role") {
        input_textbox = cy.findByRole(role_or_class, {name: name});
    }
    else if (identifier === "class") {
        input_textbox = cy.get('.'+role_or_class);
    }
    input_textbox.type('{backspace}{backspace}{backspace}{backspace}' + value);
    cy.wait(500);
})

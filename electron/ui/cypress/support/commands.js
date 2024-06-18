import '@testing-library/cypress/add-commands';

Cypress.Commands.add('load_homepage', () => {
    cy.visit('/')
    cy.screenshot('loaded homepage')
})

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

Cypress.Commands.add('set_ro_flowrate', (value) => {
    let input_textbox_name = 'Water mass flowrate';
    let input_textbox = cy.findByRole('textbox', {name: input_textbox_name});
    input_textbox.click({force:true});
    input_textbox = cy.findByRole('textbox', {name: input_textbox_name});
    input_textbox.type('{backspace}{backspace}{backspace}{backspace}' + value);
    cy.wait(500);
})

Cypress.Commands.add('solve_flowsheet', () => {
    cy.intercept({
        method: 'POST',
        url: 'http://localhost:8001/flowsheets/**',
    }).as('run');
    cy.findAllByRole('button', {name: /run/i}).eq(0).click();
    cy.wait('@run');
})
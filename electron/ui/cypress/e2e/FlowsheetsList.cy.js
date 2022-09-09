describe('flowsheetslist', () => {
    it('test flowsheetslist page', () => {
        //load webpage
        cy.visit('/')

        //locate new flowsheet button
        cy.findByRole('button', { name: /new/i })

        //locate heading
        cy.findByRole('heading', {  name: /flowsheets/i})

        //locate table headers
        cy.findByRole('columnheader', {  name: /name/i})
        cy.findByRole('columnheader', {  name: /last run/i})
        
        cy.screenshot('end-test1')
    })

    it('test new flowsheet button', () => {
        //load webpage
        cy.visit('/')

        //click on new flowsheet button
        cy.findByRole('button', { name: /new/i }).click()

        //verify that all textboxes are present and empty; enter values for each
        cy.findByRole('textbox', {  name: /flowsheet name/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /has bypass/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /has desal feed/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /is twostage/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /has erd/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /nf type/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /nf base/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /ro type/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /ro base/i}).should('have.value', '');
        cy.findByRole('textbox', {  name: /ro level/i}).should('have.value', '');

        // enter text into textboxes
        cy.findByRole('textbox', { name: /flowsheet name/i }).type('flowsheet z');
        cy.findByRole('textbox', {  name: /has bypass/i}).type('yes');
        cy.findByRole('textbox', {  name: /has desal feed/i}).type('no');
        cy.findByRole('textbox', {  name: /is twostage/i}).type('maybe');
        cy.findByRole('textbox', {  name: /has erd/i}).type('yes');
        cy.findByRole('textbox', {  name: /nf type/i}).type('a');
        cy.findByRole('textbox', {  name: /nf base/i}).type('milk');
        cy.findByRole('textbox', {  name: /ro type/i}).type('b');
        cy.findByRole('textbox', {  name: /ro base/i}).type('yogurt');
        cy.findByRole('textbox', {  name: /ro level/i}).type('42');

        // click cancel button
        cy.findByRole('button', {  name: /cancel/i})

        cy.screenshot('end-test2')
    })
})
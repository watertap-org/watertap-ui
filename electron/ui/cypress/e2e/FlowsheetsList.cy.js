describe('flowsheetslist', () => {
    it('test flowsheetslist page', () => {
        //load webpage
        cy.visit('/')

        //locate heading
        cy.findByRole('heading', {  name: /flowsheets/i})

        //locate table headers
        cy.findByRole('columnheader', {  name: /flowsheet name/i})
        cy.findByRole('columnheader', {  name: /last run/i})
        
        cy.screenshot('end-test1')
    })
})
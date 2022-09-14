describe('flowsheetslist', () => {
    it('test flowsheetslist page', () => {
        //load webpage
        cy.visit('/')

        //locate heading
        cy.findByRole('heading', {  name: /flowsheets/i})

        //locate table headers
        cy.findByRole('columnheader', {  name: /name/i})
        cy.findByRole('columnheader', {  name: /description/i})
        
        cy.screenshot('end-test1')
    })
})
describe('flowsheetslist', () => {
    it('test flowsheets-list page', () => {
        cy.load_flowsheets_list()

        //locate heading
        cy.findByRole('heading', {  name: /flowsheets/i})

        //locate table headers
        cy.findByRole('columnheader', {  name: /flowsheet name/i})
        cy.findByRole('columnheader', {  name: /last run/i})
        
        cy.screenshot('end-test1')
    })
})
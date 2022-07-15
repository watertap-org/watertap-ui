describe('Invalid Input Test', () => {
    it('test negative input for recovery rate', () => {
        //load webpage
        cy.visit('/')
        cy.screenshot('loaded homepage')
        
        //click example ro flowsheet
        cy.findByRole('link', {  name: /example ro flowsheet/i}).click()

        //enter negative value for recovery rate
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}-10')
        cy.screenshot('entered negative, invalid input')

        //click on save
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()

        //click on solve
        cy.findAllByRole('button', {  name: /solve/i}).eq(0).click()

        //find error message
        cy.findByRole('alert')

        cy.screenshot('end-test')
    })

})
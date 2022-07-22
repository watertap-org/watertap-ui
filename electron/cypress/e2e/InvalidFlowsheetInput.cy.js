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
        recovery_textbox.clear()
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}-10',{force:true})

        //click on save
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        cy.wait(500)

        // for some reason it only works when I do this twice
        //enter negative value for recovery rate
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.clear()
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}-10',{force:true})
        cy.screenshot('negative, invalid input')

        //click on save
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        cy.wait(500)
        cy.screenshot('saved')

        //click on solve
        cy.findAllByRole('button', {  name: /solve/i}).eq(0).click()

        //wait .5 seconds to ensure alert pops up
        cy.wait(500)

        //find error message
        cy.findByRole('alert')

        cy.screenshot('end-test')
    })

})
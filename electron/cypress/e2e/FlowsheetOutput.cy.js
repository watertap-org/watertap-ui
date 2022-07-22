describe('Flowsheet Output Test', () => {
    it('test output page when valid input is solved', () => {
        //load webpage
        cy.visit('/')
        cy.screenshot('loaded homepage')

        //click example ro flowsheet
        cy.findByRole('link', {  name: /example ro flowsheet/i}).click()

        //enter negative value for recovery rate
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}25')

        //click on save
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        cy.wait(500)

        //need to do it twice to ensure changes are saved
        //enter negative value for recovery rate
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}25',{force:true})
        cy.screenshot('input')

        //click on save
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()

        //click on solve
        cy.findAllByRole('button', {  name: /solve/i}).eq(0).click()

        //wait .5 seconds to ensure alert pops up
        cy.wait(500)

        //find output categories
        cy.findByRole('button', {name: /system metrics/i})
        cy.findByRole('button', {name: /feed/i})
        cy.findByRole('button', {name: /product/i})
        cy.findByRole('button', {name: /decision variables/i})
        cy.findByRole('button', {name: /system variables/i})
        cy.findByRole('button', {name: /disposal/i})

        //click save configuration button
        cy.findByRole('button', {name: /save configuration/i}).click()
        cy.wait(1000)
        cy.screenshot('pre saveConfig')
        
        // var saveConfigTextbox = cy.findByRole('textbox', {name: /config name/i})
        // saveConfigTextbox.click({force:true})
        // saveConfigTextbox = cy.findByRole('textbox', {name: /config name/i})
        // var genArr = Array.from({length:18},(v,k)=>k+1)
        // cy.wrap(genArr).each((index) => {
        //     saveConfigTextbox.type('{backspace}')
        // })
        // saveConfigTextbox.type('new_test_configuration')

        //clear preset name and enter new name
        cy.wait(1000)
        cy.get('.MuiInput-input').should('be.visible')
        cy.get('.MuiInput-input', { timeout: 10000 }).clear({ force: true })
        cy.get('.MuiInput-input', { timeout: 10000 }).type('new_test_configuration', { force: true })
        cy.screenshot('saveConfig')

        //save config and click compare tab
        cy.findByRole('button', {name: /save/i}).click()
        cy.findByRole('tab', {name: /compare/i}).click()

        //verify that new name is shown in comparison table
        cy.findAllByRole('button', {name: /new_test_configuration/i})

        cy.screenshot('end-test')
    })

})
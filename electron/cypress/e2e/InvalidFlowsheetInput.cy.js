describe('Invalid Input Test', () => {
    it('test negative input for recovery rate', () => {
        let sc_count = 0

        //load webpage
        cy.visit('/')
        cy.screenshot(sc_count+'_loaded homepage')
        sc_count+=1

        //click example ro flowsheet and wait for api response
        cy.intercept({
            method: "GET",
            url: "http://localhost:8001/flowsheets/**",
        }).as("loadFlowsheet");
        cy.findByRole('link', {  name: /example ro flowsheet/i}).click()
        cy.wait("@loadFlowsheet");
        cy.screenshot(sc_count+'_loaded flowsheet')
        sc_count+=1

        //enter negative value for recovery rate twice to ensure it is entered
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.clear()
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}-10',{force:true})
        cy.wait(500)
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.clear()
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}-10',{force:true})
        cy.screenshot(sc_count+'_negative, invalid input1')
        sc_count+=1

        //click on save and wait for api response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("saveChanges");
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        cy.wait("@saveChanges");
        cy.screenshot(sc_count+'_saved1')
        sc_count+=1

        // do it all twice to ensure it goes through
        //enter negative value for recovery rate
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.clear()
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}-10',{force:true})
        cy.wait(500)
        var recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.click({force:true})
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.clear()
        recovery_textbox = cy.get('#outlined-basicRecovery')
        recovery_textbox.type('{backspace}{backspace}{backspace}-10',{force:true})
        cy.screenshot(sc_count+'_negative, invalid input2')
        sc_count+=1

        //click on save and wait for api response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("saveChanges");
        cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        cy.wait("@saveChanges");
        cy.screenshot(sc_count+'_saved2')
        sc_count+=1

        //click on solve and wait for api response
        cy.intercept({
            method: "GET",
            url: "http://localhost:8001/flowsheets/**",
        }).as("solve");
        cy.findAllByRole('button', {  name: /solve/i}).eq(0).click()
        cy.wait("@solve");
        cy.screenshot(sc_count+'_solved')
        sc_count+=1
        
        //find error message
        cy.findByRole('alert')

        cy.screenshot(sc_count+'_end-test')
        sc_count+=1
    })

})
describe('Invalid Input Test', () => {
    it('test negative input for recovery rate', () => {
        let sc_count = 0

         //load webpage
         cy.visit('/')
         cy.screenshot(sc_count+'_loaded homepage')
         sc_count+=1
 
         //click flowsheet and wait for api response
         var flowsheet_name = "Metab flowsheet"
         cy.intercept({
             method: "GET",
             url: "http://localhost:8001/flowsheets/**",
         }).as("loadFlowsheet");
        //  cy.findByRole('link', {  name: flowsheet_name}).click()
         cy.findByText(flowsheet_name).click()
         cy.wait("@loadFlowsheet");
         cy.screenshot(sc_count+'_loaded flowsheet')
         sc_count+=1

        //enter negative value for recovery rate twice to ensure it is entered
        var input_textbox_name = "Volumetric flow rate"
        var input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.click({force:true})
        input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.type('1{backspace}{backspace}{backspace}{backspace}dfas')
        cy.wait(500)
        var input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.click({force:true})
        input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.type('1{backspace}{backspace}{backspace}{backspace}dfas')
        cy.screenshot(sc_count+'_input1')
        sc_count+=1

        //click on save and wait for api response
        // cy.intercept({
        //     method: "POST",
        //     url: "http://localhost:8001/flowsheets/**",
        // }).as("saveChanges");
        // cy.findAllByRole('button', {  name: /save/i}).eq(0).click()
        // cy.wait("@saveChanges");
        // cy.screenshot(sc_count+'_saved1')
        // sc_count+=1

        // do it all twice to ensure it goes through
        //enter negative value for recovery rate
        var input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.click({force:true})
        input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.type('1{backspace}{backspace}{backspace}{backspace}dfas')
        cy.wait(500)
        var input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.click({force:true})
        input_textbox = cy.findByRole('textbox', {  name: input_textbox_name})
        input_textbox.type('1{backspace}{backspace}{backspace}{backspace}dfas')
        cy.screenshot(sc_count+'_negative, invalid input2')
        sc_count+=1

        //click on save and wait for api response
        // cy.intercept({
        //     method: "POST",
        //     url: "http://localhost:8001/flowsheets/**",
        // }).as("saveChanges");
        // cy.findAllByRole('button', {  name: /update flowsheet/i}).eq(0).click()
        // cy.wait("@saveChanges").its('response.statusCode').should('eq', 400)
        // cy.screenshot(sc_count+'_saved1')
        // sc_count+=1

        // //click on solve and wait for api response
        // cy.intercept({
        //     method: "GET",
        //     url: "http://localhost:8001/flowsheets/**",
        // }).as("solve");
        // cy.findAllByRole('button', {  name: /solve/i}).eq(0).click()
        // cy.wait("@solve");
        // cy.screenshot(sc_count+'_solved')
        // sc_count+=1
        
        // //find error message
        // cy.findByRole('alert')

        cy.screenshot(sc_count+'_end-test')
        sc_count+=1
    })

})
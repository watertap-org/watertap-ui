describe('Display Data Rounding', () => {
    it('test that values rounded to and displayed as 0 retain their original value', () => {
        let sc_count = 0

        //load webpage
        cy.visit('/')
        cy.screenshot(sc_count+'_loaded homepage')
        sc_count+=1
        cy.wait (5000)

        //click on all flowsheets  
        // cy.findByText("All Flowsheets").click()
        // cy.screenshot(sc_count+'_clicked all flowsheets')
        // sc_count+=1

        const set_flowrate = () => {
            let input_textbox_name = "Water mass flowrate";
            let input_textbox = cy.findByRole('textbox', {  name: input_textbox_name});
            input_textbox.click({force:true});
            input_textbox = cy.findByRole('textbox', {  name: input_textbox_name});
            input_textbox.type('1{backspace}{backspace}{backspace}{backspace}0.96');
            cy.wait(500);
        }

        //click flowsheet and wait for api response
        var flowsheet_name = "RO with energy recovery flowsheet"
        cy.intercept({
            method: "GET",
            url: "http://localhost:8001/flowsheets/**",
        }).as("loadFlowsheet");
    //  cy.findByRole('link', {  name: flowsheet_name}).click()
        cy.findByText(flowsheet_name).click()
        cy.wait("@loadFlowsheet");
        cy.screenshot(sc_count+'_loaded flowsheet')
        sc_count+=1
        cy.wait (5000)
        //click on update and wait for api response
        // cy.intercept({
        //     method: "POST",
        //     url: "http://localhost:8001/flowsheets/**",
        // }).as("saveChanges");
        // cy.findAllByRole('button', {  name: /update flowsheet/i}).eq(0).click()
        // cy.wait("@saveChanges")
        // cy.screenshot(sc_count+'_updated')
        // sc_count+=1

        set_flowrate();
        
        //click on solve and wait for api response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("run");
        cy.findAllByRole('button', {  name: /run/i}).eq(0).click()
        cy.wait("@run").its('response.statusCode').should('eq', 200);
        cy.screenshot(sc_count+'_solved')
        sc_count+=1

        cy.screenshot(sc_count+'_end-test')
        sc_count+=1
    })

})
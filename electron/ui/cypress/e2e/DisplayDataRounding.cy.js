describe('Display Data Rounding', () => {
    it('test that values rounded to and displayed as 0 retain their original value', () => {
        // XXX: This doesn't really test anything different
        // XXX: because the flowsheet was changed.

        let sc_count = 0

        // Load webpage
        cy.visit('/')
        cy.screenshot(sc_count+'_loaded homepage')
        sc_count+=1
        cy.wait (5000)

        // Click flowsheet and wait for response
        var flowsheet_name = "RO with energy recovery flowsheet"
        cy.intercept({
            method: "GET",
            url: "http://localhost:8001/flowsheets/**",
        }).as("loadFlowsheet");
        cy.findByText(flowsheet_name).click()
        cy.wait("@loadFlowsheet");
        cy.screenshot(sc_count+'_loaded flowsheet')
        sc_count+=1
        cy.wait (5000)

        // Click on solve and wait for response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("run");
        cy.findAllByRole('button', {name: /run/i}).eq(0).click()
        cy.wait("@run").its('response.statusCode').should('eq', 200);
        cy.screenshot(sc_count+'_solved')
        sc_count+=1

        // XXX: Test something??

        cy.screenshot(sc_count+'_end-test')
        sc_count+=1
    })

})
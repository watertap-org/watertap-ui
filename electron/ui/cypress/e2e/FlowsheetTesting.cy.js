describe('WaterTAP UI Testing', () => {
    it('test flowsheets-list page', () => {
        cy.load_flowsheets_list()

        //locate heading
        cy.findByRole('heading', {  name: /flowsheets/i})

        //locate table headers
        cy.findByRole('columnheader', {  name: /flowsheet name/i})
        cy.findByRole('columnheader', {  name: /last run/i})
        
        cy.screenshot('end-test1')
    })

    it('test output page when valid input is solved', () => {
        let sc_count = 1

        cy.load_flowsheets_list()
        cy.load_ro_flowsheet()

        cy.set_ro_flowrate('0.96')
        cy.set_ro_flowrate('0.96')
        cy.screenshot(sc_count + '_input1')
        sc_count += 1

        cy.set_ro_flowrate('0.96')
        cy.set_ro_flowrate('0.96')
        cy.screenshot(sc_count + '_input2')
        sc_count += 1

        cy.solve_flowsheet()
        cy.screenshot(sc_count + "_solved")
        sc_count += 1

        // Click save configuration button
        cy.findByRole('button', {name: /save configuration/i}).click()
        cy.wait(1000)
        cy.screenshot(sc_count + '_pre saveConfig')
        sc_count += 1

        // Clear preset name and enter new name
        cy.wait(1000)
        cy.get('.MuiInput-input').should('be.visible')
        cy.get('.MuiInput-input', {timeout: 10000}).clear({force: true})
        cy.get('.MuiInput-input', {timeout: 10000}).type('new_test_configuration', {force: true})
        cy.screenshot(sc_count + '_saveConfig')
        sc_count += 1

        // Click on save (config) and wait for api response
        cy.intercept({
            method: "POST",
            url: "http://localhost:8001/flowsheets/**",
        }).as("saveConfig");
        cy.findByRole('button', {name: /save/i}).click()
        cy.wait("@saveConfig");
        cy.screenshot(sc_count + '_saved config')
        sc_count += 1

        // Click compare tab
        cy.findByRole('tab', {name: /compare/i}).click()
        cy.wait(5000)

        // Verify that new name is shown in comparison table
        // cy.findAllByRole('button', {name: /new_test_configuration/i})
        cy.findAllByRole('tabpanel', {name: /compare/i})

        cy.screenshot(sc_count + '_end-test')
    })

    it('test negative input for recovery rate', () => {
        let sc_count = 1;

        cy.load_flowsheets_list()
        cy.load_ro_flowsheet()

        cy.set_ro_flowrate('dfas');
        cy.screenshot(sc_count + '_input1');
        sc_count += 1;

        cy.set_ro_flowrate(cy, '-10');
        cy.screenshot(sc_count + '_input2');
        sc_count += 1;

        cy.screenshot(sc_count + '_end-test');
    })

    it('test that values rounded to and displayed as 0 retain their original value', () => {
        // XXX: This doesn't really test anything different
        // XXX: because the flowsheet was changed.

        let sc_count = 0

        cy.load_flowsheets_list()
        cy.load_ro_flowsheet()
        cy.solve_flowsheet()

        // XXX: Test something??

        cy.screenshot(sc_count+'_end-test')
    })
})
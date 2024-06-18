describe('Invalid Input Test', () => {
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

})
describe('Display Data Rounding', () => {
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
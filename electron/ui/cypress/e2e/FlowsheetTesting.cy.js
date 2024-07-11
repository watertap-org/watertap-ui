
describe('WaterTAP UI Testing', () => {
    it('tests flowsheets-list page', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')

        //locate heading
        cy.findByRole('heading', {  name: /flowsheets/i})

        //locate table headers
        cy.findByRole('columnheader', {  name: /flowsheet name/i})
        cy.findByRole('columnheader', {  name: /last run/i})
        cy.screenshot('end-list-page-test')
        
    })

    it('tests individual optimization', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')
        
        cy.load_ro_flowsheet()
        cy.screenshot('loaded RO flowsheet');

        cy.set_ro_flowrate('0.96')
        cy.set_ro_flowrate('0.96')
        cy.screenshot('set flowrate to 0.96')
        

        cy.set_ro_flowrate('0.96')
        cy.set_ro_flowrate('0.96')
        cy.screenshot('set flowrate to 0.96')
        

        cy.solve_flowsheet()
        cy.screenshot("solved flowshet")
        

        // Click save configuration button
        cy.findByRole('button', {name: /save configuration/i}).click()
        cy.wait(1000)
        cy.screenshot('pre saveConfig')
        

        // Clear preset name and enter new name
        cy.wait(1000)
        cy.get('.MuiInput-input').should('be.visible')
        cy.get('.MuiInput-input', {timeout: 10000}).clear({force: true})
        cy.get('.MuiInput-input', {timeout: 10000}).type('new_test_configuration', {force: true})
        cy.screenshot('saveConfig')
        

        // Click on save (config) and wait for api response
        cy.save_configuration()
        cy.screenshot('saved config')
        

        // Click compare tab
        cy.findByRole('tab', {name: /compare/i}).click()
        cy.wait(5000)

        // Verify that new name is shown in comparison table
        cy.findAllByRole('tabpanel', {name: /compare/i})

        cy.screenshot('end-solve-test')
    })

    it('tests invalid inputs', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')
        
        cy.load_ro_flowsheet()
        cy.screenshot('loaded RO flowsheet');

        cy.set_ro_flowrate('dfas');
        cy.screenshot('invalid-text-input');

        cy.solve_flowsheet()
        cy.screenshot('error-message');
        cy.get('.error-message').should('be.visible')

        cy.set_ro_flowrate('-10');
        cy.screenshot('invalid-negative-input');

        cy.solve_flowsheet()
        cy.screenshot('error-message');

        cy.get('.error-message').should('be.visible')

        cy.screenshot('end-invalid-input-test');

    })

    it('tests logging panel', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')
        
        cy.open_logging_panel()
        cy.screenshot('opened_logs')

        // check that a log line of type info, warning, are present
        cy.get('.log-line').contains('INFO')
        cy.get('.log-line').contains('WARNING')

        cy.screenshot('end-logging-test')
    })

    it('tests new flowsheet', () => {
        let modelFile = "https://drive.google.com/uc?export=download&id=1XdjuWNpYT9teZxaF8TuwDz0XS2XyXKeT"
        let exportFile = "https://drive.google.com/uc?export=download&id=1-jWQmI4wO2OlyUi32fqobFEmPn3zm9Q9"
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')

        // download model and export files
        cy.downloadFile(modelFile,'cypress/downloads','testModelFile.py')
        cy.downloadFile(exportFile,'cypress/downloads','testModelFile_ui.py')
        
        cy.findByRole('button', {name: /new flowsheet +/i}).click()
        cy.wait(500)

        cy.screenshot("clicked new flowsheet")
        
        // select both files
        cy.get('.ModelFile').selectFile('./cypress/downloads/testModelFile.py', {
            action: 'drag-drop',
            force: true
        })
        cy.get('.ExportFile').selectFile('./cypress/downloads/testModelFile_ui.py', {
            action: 'drag-drop',
            force: true
        })

        cy.wait(500)
        cy.screenshot("dragged and dropped files")

        cy.get('.upload-flowsheet-button').click()
        
        cy.wait(1000)
        cy.screenshot("uploaded files")

        cy.get('.flowsheet-name').contains(/test custom flowsheet/i)
        cy.screenshot('end-new-flowsheet-test')

    })

    it('tests parameter sweep', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')
        
        cy.load_ro_flowsheet()
        cy.screenshot('loaded RO flowsheet')

        // set solve type to sweep
        cy.get('#solve-sweep-select').click()
        cy.wait(100)
        cy.get('#sweep-option').click()
        cy.wait(1000)

        // set sweep variable
        cy.get('.Watermassflowrate_fixed-free-select').click()
        cy.wait(100)
        cy.findByRole('option', { name: /sweep/i }).click()
        cy.wait(100)

        // enter lower and upper bounds
        cy.enter_text('class', 'Watermassflowrate_lower_input', '0.7')
        cy.enter_text('class', 'Watermassflowrate_upper_input', '0.8')

        // run sweep
        cy.solve_flowsheet()
        cy.wait(5000)
        cy.screenshot("ran parameter sweep")

        //test that sweep was successful
        cy.get('.parameter-sweep-output-table').should('be.visible')

    })
})
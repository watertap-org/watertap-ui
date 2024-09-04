import { flowsheets } from "./Flowsheets"
describe('WaterTAP UI Testing', () => {
    it('tests flowsheets-list page', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')

        // verify that heading and table headers are present
        cy.findByRole('heading', {  name: /flowsheets/i})
        cy.findByRole('columnheader', {  name: /flowsheet name/i})
        cy.findByRole('columnheader', {  name: /last run/i})
        cy.screenshot('end-list-page-test')  
    })

    it('tests invalid inputs', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')
        
        // load flowsheet
        cy.load_flowsheet("RO with energy recovery flowsheet")
        cy.screenshot('loaded RO flowsheet');

        // set invalid text input. do it twice to ensure it registers in slow windows runner
        cy.set_ro_flowrate('dfas');
        cy.wait(1000)
        cy.set_ro_flowrate('dfas');
        cy.wait(1000)
        cy.screenshot('invalid-text-input');

        // solve flowsheet
        cy.solve_flowsheet()

        // verify that error message is there
        cy.screenshot('error-message');
        cy.get('.error-message').should('be.visible')

        // reset flowsheet
        cy.reset_flowsheet()
        cy.screenshot('end-invalid-input-test');
    })

    it('tests logging panel', () => {
        cy.load_flowsheets_list()
        cy.wait(2000)
        cy.screenshot('loaded flowsheet list page')
        
        // open logging panel
        cy.open_logging_panel()
        cy.screenshot('opened_logs')

        // verify that a log line of type info and warning are present
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
        
        // click new flowsheet button
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

        // click upload
        cy.get('.upload-flowsheet-button').click()
        cy.wait(1000)
        cy.screenshot("uploaded files")

        // verify that flowsheet is now in list
        cy.get('.flowsheet-name').contains(/test custom flowsheet/i)
        cy.screenshot('end-new-flowsheet-test')

    })

    flowsheets.forEach((flowsheet) => {
        it('tests optimization for '+flowsheet.name, () => {
            cy.load_flowsheets_list()
            cy.wait(2000)
            cy.screenshot('loaded flowsheet list page')
            
            // load flowsheet
            cy.load_flowsheet(flowsheet.name)
            cy.screenshot('loaded '+flowsheet.name);
            
            // if model has build options, it must be manually built
            if (flowsheet.buildRequired) {
                cy.build_flowsheet()
                cy.screenshot("built "+flowsheet.name)
            }

            // solve flowsheet
            cy.solve_flowsheet()
            cy.screenshot("solved "+flowsheet.name)
    
            // Click save configuration button
            cy.findByRole('button', {name: /save configuration/i}).click()
            cy.wait(1000)
            cy.screenshot('pre saveConfig for '+flowsheet.name)
            
            // Clear preset name and enter new name
            cy.wait(1000)
            cy.get('.MuiInput-input').should('be.visible')
            cy.get('.MuiInput-input', {timeout: 10000}).clear({force: true})
            cy.get('.MuiInput-input', {timeout: 10000}).type('new_test_configuration', {force: true})
            cy.screenshot('saveConfig')
    
            // Click on save (config) and wait for api response
            cy.save_configuration()
            cy.screenshot('saved config for '+flowsheet.name)
    
            // Click compare tab
            cy.findByRole('tab', {name: /compare/i}).click()
            cy.wait(5000)
    
            // Verify that new name is shown in comparison table
            cy.findAllByRole('tabpanel', {name: /compare/i})
            cy.screenshot('end-solve-'+flowsheet.name)
        })
    })

    flowsheets.forEach((flowsheet) => {
        it('tests parameter sweep '+flowsheet.name, () => {
            cy.load_flowsheets_list()
            cy.screenshot('loaded flowsheet list page')
            
            // load flowsheet
            cy.load_flowsheet(flowsheet.name)
            cy.screenshot('loaded '+flowsheet.name)

            // set solve type to sweep
            cy.get('#solve-sweep-select').click()
            cy.wait(100)
            cy.get('#sweep-option').click()
            cy.wait(1000)

            // set sweep variable
            cy.get('.'+flowsheet.sweepVariable+'_fixed-free-select').click()
            cy.wait(100)
            cy.findByRole('option', { name: /sweep/i }).click()
            cy.wait(100)

            // enter lower and upper bounds
            cy.enter_text('class', flowsheet.sweepVariable+'_lower_input', flowsheet.sweepValues[0])
            cy.enter_text('class', flowsheet.sweepVariable+'_upper_input', flowsheet.sweepValues[1])

            // run sweep
            cy.solve_flowsheet()
            cy.wait(5000)
            cy.screenshot('ran parameter sweep '+flowsheet.name)

            // verify that sweep was successful
            cy.get('.parameter-sweep-output-table').should('be.visible')

        })
    })

    // RO is most kikely the most canonical 
    // Exclusively run on 'RO with energy recovery flowsheet'
    it('input change flag for RO with energy recovery- value change', () => {
        cy.load_flowsheets_list()
        cy.screenshot('loaded flowsheet list page')
        
        const flowsheet_name = 'RO with energy recovery flowsheet'

        // load flowsheet
        cy.load_flowsheet(flowsheet_name)
        cy.screenshot('loaded '+ flowsheet_name)

        // solve flowsheet
        cy.solve_flowsheet()
        cy.screenshot("solved "+flowsheet_name)

        // check no flag
        cy.get('#inputChangeFlag').should('not.exist');
        cy.screenshot('value: no-input-change-no-flag-'+flowsheet_name)

        // go to inputs
        cy.findByRole('tab', {name: /input/i}).click();
        cy.screenshot('value: input-tab-click-' + flowsheet_name);

        cy.findByRole('textbox', {name: 'Water mass flowrate'}).invoke('val').then((val) => {
            const changed_val = val * 1.02

            // change input 
            cy.enter_text('role' ,'textbox', changed_val, 'Water mass flowrate')

            // Take the screenshot after the input has v has been logged
            cy.screenshot('value: input-change-' + flowsheet_name);
            
        });

        // go to outputs
        cy.findByRole('tab', {name: /output/i}).click()

        // check for flag 
        cy.get('#inputChangeFlag').should('exist');
        cy.screenshot('value: output-flag-after-input-change-flag' + flowsheet_name);

        // return to inputs 
        cy.findByRole('tab', {name: /input/i}).click();

        // solve flowsheet
        cy.solve_flowsheet()

        // check no flag after solving again
        cy.get('#inputChangeFlag').should('not.exist');
        cy.screenshot("value: re-solved-after-input-change-no-flag "+flowsheet_name)
    })

    it('input change flag for RO with energy recovery value change- fixed/free change', () => {
        cy.load_flowsheets_list()
        cy.screenshot('fixed/free: loaded flowsheet list page')
        
        const flowsheet_name = 'RO with energy recovery flowsheet'
        
        const flowsheet = flowsheets.find(flowsheet => flowsheet.name === flowsheet_name);
        
        // load flowsheet
        cy.load_flowsheet(flowsheet.name)
        cy.screenshot('fixed/free: loaded '+flowsheet.name)

        // solve flowsheet
        cy.solve_flowsheet()
        cy.screenshot("fixed/free: solved "+flowsheet.name)


        cy.findByRole('tab', {name: /output/i}).click();

        // check no flag
        cy.get('#inputChangeFlag').should('not.exist');
        cy.screenshot('fixed/free: no-input-change-no-flag-'+flowsheet.name)

        cy.findByRole('tab', {name: /input/i}).click();


        // set free variable
        cy.get('.'+flowsheet.sweepVariable+'_fixed-free-select').click()
        cy.wait(100)
        cy.findByRole('option', { name: /free/i }).click()
        cy.get('.'+flowsheet.sweepVariable+'_fixed-free-select').click()
        cy.wait(100)

        cy.findByRole('option', { name: /fixed/i }).click()

        cy.wait(100)
        cy.screenshot('fixed/free: change-option-free '+flowsheet.name)

        // go to outputs
        cy.findByRole('tab', {name: /output/i}).click()
        cy.screenshot('fixed/free: LOOK' + flowsheet.name);

        cy.wait(500)

        // // check for flag 
        cy.get('#inputChangeFlag').should('exist');
        cy.screenshot('fixed/free: output-flag-after-input-change-flag ' + flowsheet.name);

    })

    it('input change flag for RO with energy recovery value change- bounds change', () => {
        cy.load_flowsheets_list()
        cy.screenshot('bounds: loaded flowsheet list page')
        
        const flowsheet_name = 'RO with energy recovery flowsheet'
        
        const flowsheet = flowsheets.find(flowsheet => flowsheet.name === flowsheet_name);
        
        // load flowsheet
        cy.load_flowsheet(flowsheet.name)
        cy.screenshot('bounds: loaded '+flowsheet.name)

        // solve flowsheet
        cy.solve_flowsheet()
        cy.screenshot("bounds: solved "+flowsheet.name)


        cy.findByRole('tab', {name: /output/i}).click();

        // check no flag
        cy.get('#inputChangeFlag').should('not.exist');
        cy.screenshot('bounds: no-input-change-no-flag-'+flowsheet.name)

        cy.findByRole('tab', {name: /input/i}).click();


        // set free variable
        cy.get('.'+flowsheet.sweepVariable+'_fixed-free-select').click()
        cy.wait(100)
        cy.findByRole('option', { name: /free/i }).click()
        cy.wait(100)
        cy.screenshot('bounds: change-option-free '+flowsheet.name)

        // enter lower and upper bounds
        cy.enter_text('class', flowsheet.sweepVariable+'_lower_input', flowsheet.sweepValues[0])
        cy.enter_text('class', flowsheet.sweepVariable+'_upper_input', flowsheet.sweepValues[1])


        // go to outputs
        cy.findByRole('tab', {name: /output/i}).click()

        // check for flag 
        cy.get('#inputChangeFlag').should('exist');
        cy.screenshot('bounds: output-flag-after-input-change-flag ' + flowsheet.name);
        
        // return to inputs 
        cy.findByRole('tab', {name: /input/i}).click();

        // solve flowsheet
        cy.solve_flowsheet()

        // check no flag after solving again
        cy.get('#inputChangeFlag').should('not.exist');
        cy.screenshot("bounds: re-solved-after-input-change-no-flag "+flowsheet_name)
    })
})
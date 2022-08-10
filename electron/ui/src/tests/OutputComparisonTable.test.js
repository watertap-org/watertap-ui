import { render, screen } from '@testing-library/react';
import OutputComparisonTable from "../views/FlowsheetConfig/ConfigOutput/OutputComparisonTable"
import mockData from './data/OutputComparisonTable.json'

test('test comparison table', () => {
    render( <OutputComparisonTable historyData={mockData}/> )

    expect(screen.getByRole('row', {  name: /Metric Configuration #4 Value Difference/i}))
    expect(screen.getByRole('row', {  name: /Recovery 8% 51% -43.00/i}))
    expect(screen.getByRole('row', {  name: /System metrics/i}))
    expect(screen.getByRole('row', {  name: /Feed/i}))
    expect(screen.getByRole('row', {  name: /Product/i}))
    expect(screen.getByRole('row', {  name: /Disposal/i}))
    expect(screen.getByRole('row', {  name: /System variables/i}))
    
    expect(screen.getByRole('button', {  name: /Download Results/i}))

})
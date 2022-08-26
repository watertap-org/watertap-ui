import { render, screen } from '@testing-library/react';
import OutputComparisonTable from "../views/FlowsheetConfig/ConfigOutput/OutputComparisonTable"
import mockData from './data/OutputComparisonTable.json'

test('test comparison table', () => {
    render( <OutputComparisonTable outputData={mockData}/> )

    // no accessible elements - elements dont populate until after API call

})
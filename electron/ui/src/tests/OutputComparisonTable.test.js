import { render, screen } from '@testing-library/react';
import OutputComparisonTable from '../components/OutputComparisonTable/OutputComparisonTable';
import mockData from './data/OutputComparisonTable.json'


test('test comparison table', () => {
    render( <OutputComparisonTable historyData={mockData}/> )

    // no accessible elements - elements dont populate until after API call

})
import { render, screen } from '@testing-library/react';
import FlowsheetsListTable from "../components/FlowsheetsListTable/FlowsheetsListTable"
import test_data from '../../../../backend/data/flowsheets/fake/data.json'


test('test flowsheets list table', () => {
    render( <FlowsheetsListTable rows={[test_data]}/> )

    expect(screen.getByRole('cell', {  name: /METAB treatment train/i}))
    expect(screen.getByRole('link', {  name: /METAB treatment train/i}))
    expect(screen.getByRole('button', { name: /edit project/i }))

    screen.debug();

})
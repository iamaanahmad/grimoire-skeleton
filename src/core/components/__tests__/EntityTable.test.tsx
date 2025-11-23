import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EntityTable, Column } from '../EntityTable';

// Mock data type
interface TestItem {
    $id: string;
    name: string;
    value: number;
}

const columns: Column<TestItem>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'value', label: 'Value', sortable: true },
];

describe('EntityTable', () => {
    it('renders empty state when no data', () => {
        render(<EntityTable data={[]} columns={columns} emptyMessage="No data found" />);
        expect(screen.getByText('No data found')).toBeInTheDocument();
    });

    it('renders data correctly', () => {
        const data: TestItem[] = [
            { $id: '1', name: 'Item 1', value: 10 },
            { $id: '2', name: 'Item 2', value: 20 },
        ];
        render(<EntityTable data={data} columns={columns} />);

        // Check for text presence, allowing hidden elements (since desktop view might be hidden)
        expect(screen.getAllByText('Item 1', { hidden: true })[0]).toBeInTheDocument();
        expect(screen.getAllByText('Item 2', { hidden: true })[0]).toBeInTheDocument();
    });

    it('handles sorting', () => {
        const data: TestItem[] = [
            { $id: '1', name: 'B', value: 10 },
            { $id: '2', name: 'A', value: 20 },
        ];
        render(<EntityTable data={data} columns={columns} />);

        // Find the header in the desktop table (even if hidden)
        const desktopTable = screen.getByTestId('desktop-table', { hidden: true });
        const nameHeader = within(desktopTable).getByText('Name', { hidden: true });

        // Click sort
        fireEvent.click(nameHeader);

        // Get all rows from desktop table
        const rows = within(desktopTable).getAllByRole('row', { hidden: true });
        // Row 0 is header, Row 1 is first data row

        // Check content of first data row
        expect(within(rows[1]).getByText('A', { hidden: true })).toBeInTheDocument();
        // Check content of second data row
        expect(within(rows[2]).getByText('B', { hidden: true })).toBeInTheDocument();
    });

    it('handles pagination with large dataset', () => {
        const data: TestItem[] = Array.from({ length: 25 }, (_, i) => ({
            $id: `${i}`,
            name: `Item ${i + 1}`,
            value: i,
        }));

        render(<EntityTable data={data} columns={columns} />);

        // Should show first 10 items
        expect(screen.getAllByText('Item 1', { hidden: true })[0]).toBeInTheDocument();
        expect(screen.getAllByText('Item 10', { hidden: true })[0]).toBeInTheDocument();
        expect(screen.queryByText('Item 11', { hidden: true })).not.toBeInTheDocument();

        // Go to next page
        const nextButton = screen.getByLabelText('Next page', { hidden: true });
        fireEvent.click(nextButton);

        // Should show 11-20
        expect(screen.getAllByText('Item 11', { hidden: true })[0]).toBeInTheDocument();
        expect(screen.getAllByText('Item 20', { hidden: true })[0]).toBeInTheDocument();
        expect(screen.queryByText('Item 1', { hidden: true })).not.toBeInTheDocument();
    });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareholderList } from '@/components/ShareholderList';
import { Shareholder } from '@/types';

describe('ShareholderList', () => {
  const mockOnDeleteShareholder = jest.fn();
  
  const mockShareholders: Shareholder[] = [
    { id: 'shareholder-1', name: 'John Doe', shares: 1000 },
    { id: 'shareholder-2', name: 'Jane Smith', shares: 800 },
    { id: 'shareholder-3', name: 'Bob Johnson', shares: 600 },
  ];

  const mockSingleShareholder: Shareholder[] = [
    { id: 'shareholder-1', name: 'Solo Owner', shares: 500 },
  ];

  const mockLargeSharesShareholders: Shareholder[] = [
    { id: 'shareholder-1', name: 'Major Investor', shares: 1000000 },
    { id: 'shareholder-2', name: 'Minor Investor', shares: 500000 },
  ];

  beforeEach(() => {
    mockOnDeleteShareholder.mockClear();
  });

  it('should render empty state when no shareholders', () => {
    render(<ShareholderList shareholders={[]} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('Shareholders')).toBeInTheDocument();
    expect(screen.getByText('No shareholders yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first shareholder using the form above')).toBeInTheDocument();
    
    // Should display empty state icon
    const emptyIcon = screen.getByRole('img', { hidden: true });
    expect(emptyIcon).toBeInTheDocument();
  });

  it('should render shareholders list with correct information', () => {
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('Shareholders')).toBeInTheDocument();
    expect(screen.getByText('3 shareholders • 2,400 shares')).toBeInTheDocument();
    
    // Should display all shareholders
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    
    // Should display shares
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
    expect(screen.getByText('600')).toBeInTheDocument();
  });

  it('should sort shareholders by shares in descending order', () => {
    const unsortedShareholders: Shareholder[] = [
      { id: 'shareholder-1', name: 'Small Investor', shares: 100 },
      { id: 'shareholder-2', name: 'Large Investor', shares: 1000 },
      { id: 'shareholder-3', name: 'Medium Investor', shares: 500 },
    ];

    render(<ShareholderList shareholders={unsortedShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    const shareholderRows = screen.getAllByRole('row');
    // First row is header, so shareholders start from index 1
    expect(shareholderRows[1]).toHaveTextContent('Large Investor');
    expect(shareholderRows[2]).toHaveTextContent('Medium Investor');
    expect(shareholderRows[3]).toHaveTextContent('Small Investor');
  });

  it('should calculate and display ownership percentages', () => {
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    // John Doe: 1000/2400 = 41.67%
    expect(screen.getByText('41.67%')).toBeInTheDocument();
    
    // Jane Smith: 800/2400 = 33.33%
    expect(screen.getByText('33.33%')).toBeInTheDocument();
    
    // Bob Johnson: 600/2400 = 25%
    expect(screen.getByText('25.00%')).toBeInTheDocument();
  });

  it('should handle single shareholder with 100% ownership', () => {
    render(<ShareholderList shareholders={mockSingleShareholder} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('1 shareholders • 500 shares')).toBeInTheDocument();
    expect(screen.getByText('Solo Owner')).toBeInTheDocument();
    expect(screen.getByText('100.00%')).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(<ShareholderList shareholders={mockLargeSharesShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('2 shareholders • 1,500,000 shares')).toBeInTheDocument();
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
    expect(screen.getByText('500,000')).toBeInTheDocument();
  });

  it('should call onDeleteShareholder when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);
    
    expect(mockOnDeleteShareholder).toHaveBeenCalledWith('shareholder-1');
  });

  it('should show loading state when isLoading is true', () => {
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} isLoading={true} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    deleteButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should not call onDeleteShareholder when button is disabled', async () => {
    const user = userEvent.setup();
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} isLoading={true} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);
    
    expect(mockOnDeleteShareholder).not.toHaveBeenCalled();
  });

  it('should handle zero shares correctly', () => {
    const zeroSharesShareholders: Shareholder[] = [
      { id: 'shareholder-1', name: 'Zero Owner', shares: 0 },
      { id: 'shareholder-2', name: 'Regular Owner', shares: 100 },
    ];

    render(<ShareholderList shareholders={zeroSharesShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('2 shareholders • 100 shares')).toBeInTheDocument();
    expect(screen.getByText('Zero Owner')).toBeInTheDocument();
    expect(screen.getByText('0.00%')).toBeInTheDocument();
    expect(screen.getByText('100.00%')).toBeInTheDocument();
  });

  it('should handle long shareholder names properly', () => {
    const longNameShareholders: Shareholder[] = [
      { id: 'shareholder-1', name: 'This is a very long shareholder name that should be handled properly', shares: 1000 },
    ];

    render(<ShareholderList shareholders={longNameShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('This is a very long shareholder name that should be handled properly')).toBeInTheDocument();
  });

  it('should handle special characters in shareholder names', () => {
    const specialCharShareholders: Shareholder[] = [
      { id: 'shareholder-1', name: 'O\'Brien & Associates (LLC)', shares: 1000 },
    ];

    render(<ShareholderList shareholders={specialCharShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('O\'Brien & Associates (LLC)')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA attributes', () => {
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    // Should have table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Should have column headers
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /shares/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /ownership/i })).toBeInTheDocument();
  });

  it('should handle keyboard navigation for delete buttons', async () => {
    const user = userEvent.setup();
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    // Tab to first delete button
    await user.tab();
    await user.tab();
    await user.tab();
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons[0]).toHaveFocus();
    
    // Press Enter to activate
    await user.keyboard('{Enter}');
    expect(mockOnDeleteShareholder).toHaveBeenCalledWith('shareholder-1');
  });

  it('should handle responsive design classes', () => {
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    const table = screen.getByRole('table');
    expect(table.closest('div')).toHaveClass('overflow-x-auto');
  });

  it('should display correct header summary with different counts', () => {
    // Test with 1 shareholder
    const { rerender } = render(<ShareholderList shareholders={mockSingleShareholder} onDeleteShareholder={mockOnDeleteShareholder} />);
    expect(screen.getByText('1 shareholders • 500 shares')).toBeInTheDocument();
    
    // Test with multiple shareholders
    rerender(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    expect(screen.getByText('3 shareholders • 2,400 shares')).toBeInTheDocument();
  });

  it('should handle edge case with all shareholders having same shares', () => {
    const equalSharesShareholders: Shareholder[] = [
      { id: 'shareholder-1', name: 'Equal Owner 1', shares: 500 },
      { id: 'shareholder-2', name: 'Equal Owner 2', shares: 500 },
      { id: 'shareholder-3', name: 'Equal Owner 3', shares: 500 },
    ];

    render(<ShareholderList shareholders={equalSharesShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    // All should have 33.33% ownership
    const percentages = screen.getAllByText('33.33%');
    expect(percentages).toHaveLength(3);
  });

  it('should maintain proper visual hierarchy', () => {
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    // Check for proper CSS classes
    const container = screen.getByRole('table').closest('div');
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('rounded-xl');
    expect(container).toHaveClass('shadow-sm');
    expect(container).toHaveClass('border');
  });

  it('should handle very large ownership percentages', () => {
    const largeOwnershipShareholders: Shareholder[] = [
      { id: 'shareholder-1', name: 'Major Owner', shares: 999999 },
      { id: 'shareholder-2', name: 'Minor Owner', shares: 1 },
    ];

    render(<ShareholderList shareholders={largeOwnershipShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    expect(screen.getByText('100.00%')).toBeInTheDocument(); // Should round to 100%
    expect(screen.getByText('0.00%')).toBeInTheDocument(); // Should round to 0%
  });

  it('should handle deletion confirmation flow', async () => {
    const user = userEvent.setup();
    render(<ShareholderList shareholders={mockShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    
    // Should be able to click delete button
    await user.click(deleteButtons[0]);
    
    // Should call the handler immediately (no confirmation dialog in current implementation)
    expect(mockOnDeleteShareholder).toHaveBeenCalledWith('shareholder-1');
    expect(mockOnDeleteShareholder).toHaveBeenCalledTimes(1);
  });

  it('should handle error states gracefully', () => {
    // Test with invalid data
    const invalidShareholders: Shareholder[] = [
      { id: 'shareholder-1', name: '', shares: 1000 },
    ];

    render(<ShareholderList shareholders={invalidShareholders} onDeleteShareholder={mockOnDeleteShareholder} />);
    
    // Should still render even with empty name
    expect(screen.getByText('1 shareholders • 1,000 shares')).toBeInTheDocument();
  });
}); 
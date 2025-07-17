import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareholderForm } from '@/components/ShareholderForm';

describe('ShareholderForm', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render the form with correct elements', () => {
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Add New Shareholder')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Shares')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Shareholder' })).toBeInTheDocument();
  });

  it('should submit valid form data', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, '100');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('John Doe', 100);
  });

  it('should trim whitespace from name', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, '  John Doe  ');
    await user.type(sharesInput, '100');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('John Doe', 100);
  });

  it('should show error for empty name when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    // Leave name empty and add shares
    await user.type(sharesInput, '100');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for empty shares when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    // Add name but leave shares empty
    await user.type(nameInput, 'John Doe');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Shares must be greater than 0')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for negative shares when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, '-10');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Shares must be greater than 0')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for zero shares when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, '0');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Shares must be greater than 0')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for non-integer shares when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, '10.5');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Shares must be a whole number')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show multiple validation errors when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    // Leave name empty and add negative shares
    await user.type(sharesInput, '-5');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Shares must be greater than 0')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should clear form after successful submission', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, '100');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('John Doe', 100);
    
    // Check that form is cleared after successful submission
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(sharesInput).toHaveValue('');
    });
  });

  it('should clear validation errors after successful submission', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    // First submit with invalid data
    await user.type(sharesInput, '0');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Shares must be greater than 0')).toBeInTheDocument();
    });
    
    // Then submit with valid data
    await user.type(nameInput, 'John Doe');
    await user.clear(sharesInput);
    await user.type(sharesInput, '100');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('John Doe', 100);
    
    // Check that errors are cleared
    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Shares must be greater than 0')).not.toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    render(<ShareholderForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Adding...' });
    
    expect(nameInput).toBeDisabled();
    expect(sharesInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should apply error styling to input fields when validation fails', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(sharesInput, '0');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveClass('border-red-500');
      expect(sharesInput).toHaveClass('border-red-500');
    });
  });

  it('should convert string shares to number', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, '500');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('John Doe', 500);
  });

  it('should prevent form submission when disabled', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: 'Adding...' });
    
    await user.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle large share numbers', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, '1000000');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('John Doe', 1000000);
  });

  it('should have proper accessibility attributes', () => {
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    expect(nameInput).toHaveAttribute('id', 'name');
    expect(sharesInput).toHaveAttribute('id', 'shares');
    expect(sharesInput).toHaveAttribute('type', 'number');
    expect(sharesInput).toHaveAttribute('min', '1');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should handle form reset after error correction', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    // Submit with invalid data
    await user.type(sharesInput, '0');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Shares must be greater than 0')).toBeInTheDocument();
    });
    
    // Fix the errors and submit again
    await user.type(nameInput, 'John Doe');
    await user.clear(sharesInput);
    await user.type(sharesInput, '100');
    await user.click(submitButton);
    
    // Should call onSubmit and clear form
    expect(mockOnSubmit).toHaveBeenCalledWith('John Doe', 100);
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(sharesInput).toHaveValue('');
    });
  });

  it('should handle input changes and preserve values before submission', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    
    await user.type(nameInput, 'Test Name');
    await user.type(sharesInput, '50');
    
    expect(nameInput).toHaveValue('Test Name');
    expect(sharesInput).toHaveValue('50');
  });

  it('should handle edge case of NaN shares input', async () => {
    const user = userEvent.setup();
    render(<ShareholderForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText('Name');
    const sharesInput = screen.getByLabelText('Shares');
    const submitButton = screen.getByRole('button', { name: 'Add Shareholder' });
    
    await user.type(nameInput, 'John Doe');
    await user.type(sharesInput, 'abc');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Shares must be greater than 0')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 
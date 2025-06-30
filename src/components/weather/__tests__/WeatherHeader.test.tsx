import { render, screen, fireEvent } from '@testing-library/react';
import WeatherHeader from '../WeatherHeader';

describe('WeatherHeader', () => {
  const defaultProps = {
    city: 'New York',
    country: 'United States',
    isLoading: false,
    isRefreshing: false,
    onRefresh: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders city and country correctly', () => {
    render(<WeatherHeader {...defaultProps} />);
    
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const mockOnRefresh = jest.fn();
    render(<WeatherHeader {...defaultProps} onRefresh={mockOnRefresh} />);
    
    const refreshButton = screen.getByLabelText('Refresh weather data');
    fireEvent.click(refreshButton);
    
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    render(<WeatherHeader {...defaultProps} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByLabelText('Delete widget');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('disables refresh button when loading', () => {
    render(<WeatherHeader {...defaultProps} isLoading={true} />);
    
    const refreshButton = screen.getByLabelText('Refresh weather data');
    expect(refreshButton).toBeDisabled();
  });

  it('disables refresh button when refreshing', () => {
    render(<WeatherHeader {...defaultProps} isRefreshing={true} />);
    
    const refreshButton = screen.getByLabelText('Refresh weather data');
    expect(refreshButton).toBeDisabled();
  });

  it('shows spinning icon when loading or refreshing', () => {
    const { rerender } = render(<WeatherHeader {...defaultProps} isLoading={true} />);
    
    const refreshIcon = screen.getByLabelText('Refresh weather data').querySelector('svg');
    expect(refreshIcon).toHaveClass('animate-spin');

    rerender(<WeatherHeader {...defaultProps} isLoading={false} isRefreshing={true} />);
    expect(refreshIcon).toHaveClass('animate-spin');

    rerender(<WeatherHeader {...defaultProps} isLoading={false} isRefreshing={false} />);
    expect(refreshIcon).not.toHaveClass('animate-spin');
  });

  it('renders with correct hover styles', () => {
    render(<WeatherHeader {...defaultProps} />);
    
    const refreshButton = screen.getByLabelText('Refresh weather data');
    const deleteButton = screen.getByLabelText('Delete widget');
    
    expect(refreshButton).toHaveClass('hover:bg-white/20');
    expect(deleteButton).toHaveClass('hover:bg-white/20');
  });
});

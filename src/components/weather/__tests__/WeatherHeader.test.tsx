import { render, screen } from '@testing-library/react';
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

  it('shows spinning icon when loading or refreshing', () => {
    const { rerender } = render(<WeatherHeader {...defaultProps} isLoading={true} />);
    
    const refreshIcon = screen.getByLabelText('Refresh weather data').querySelector('svg');
    expect(refreshIcon).toHaveClass('animate-spin');

    rerender(<WeatherHeader {...defaultProps} isLoading={false} isRefreshing={true} />);
    expect(refreshIcon).toHaveClass('animate-spin');

    rerender(<WeatherHeader {...defaultProps} isLoading={false} isRefreshing={false} />);
    expect(refreshIcon).not.toHaveClass('animate-spin');
  });
});

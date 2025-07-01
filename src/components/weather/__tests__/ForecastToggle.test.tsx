import { render, screen, fireEvent } from '@testing-library/react';
import ForecastToggle from '../ForecastToggle';

describe('ForecastToggle', () => {
  const defaultProps = {
    showHourly: false,
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders forecast toggle component', () => {
    render(<ForecastToggle {...defaultProps} />);
    
    expect(screen.getByTestId('forecast-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('daily-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('hourly-toggle')).toBeInTheDocument();
  });

  it('calls onToggle with false when daily button is clicked', () => {
    const mockOnToggle = jest.fn();
    render(<ForecastToggle {...defaultProps} onToggle={mockOnToggle} />);
    
    const dailyButton = screen.getByTestId('daily-toggle');
    fireEvent.click(dailyButton);
    
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  it('calls onToggle with true when hourly button is clicked', () => {
    const mockOnToggle = jest.fn();
    render(<ForecastToggle {...defaultProps} onToggle={mockOnToggle} />);
    
    const hourlyButton = screen.getByTestId('hourly-toggle');
    fireEvent.click(hourlyButton);
    
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });
});

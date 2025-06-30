import { render, screen, fireEvent } from '@testing-library/react';
import DailyForecast from '../DailyForecast';
import { DailyForecast as DailyForecastType } from '@/types/weather';

// Mock the WeatherIcon component
jest.mock('../WeatherIcon', () => {
  return function MockWeatherIcon({ iconCode, size }: { iconCode: string; size?: string }) {
    return <div data-testid="weather-icon" data-icon={iconCode} data-size={size}>Mock Icon</div>;
  };
});

describe('DailyForecast', () => {
  const mockDailyForecast: DailyForecastType[] = [
    {
      day: 'Mon',
      date: '12/18',
      tempHigh: 25,
      tempLow: 15,
      description: 'Sunny',
      icon: '01d',
      humidity: 45,
      windSpeed: 8,
      precipitation: 0,
    },
    {
      day: 'Tue',
      date: '12/19',
      tempHigh: 22,
      tempLow: 12,
      description: 'Partly Cloudy',
      icon: '02d',
      humidity: 55,
      windSpeed: 12,
      precipitation: 10,
    },
    {
      day: 'Wed',
      date: '12/20',
      tempHigh: 18,
      tempLow: 8,
      description: 'Rainy',
      icon: '10d',
      humidity: 80,
      windSpeed: 15,
      precipitation: 70,
    },
  ];

  const defaultProps = {
    dailyForecast: mockDailyForecast,
    forecastDays: 3,
    onForecastDaysChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the forecast header with correct title', () => {
    render(<DailyForecast {...defaultProps} />);
    
    expect(screen.getByText('3-Day Forecast')).toBeInTheDocument();
    // Check if Calendar icon is rendered
    const header = screen.getByText('3-Day Forecast').closest('h3');
    expect(header).toBeInTheDocument();
  });

  it('updates title when forecastDays changes', () => {
    render(<DailyForecast {...defaultProps} forecastDays={5} />);
    
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
  });

  it('renders forecast days select with correct options', () => {
    render(<DailyForecast {...defaultProps} />);
    
    const select = screen.getByLabelText('Select number of forecast days');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('3');

    // Check if all options are present
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(7);
    expect(options[0]).toHaveValue('1');
    expect(options[6]).toHaveValue('7');
  });

  it('calls onForecastDaysChange when select value changes', () => {
    const mockOnForecastDaysChange = jest.fn();
    render(<DailyForecast {...defaultProps} onForecastDaysChange={mockOnForecastDaysChange} />);
    
    const select = screen.getByLabelText('Select number of forecast days');
    fireEvent.change(select, { target: { value: '5' } });
    
    expect(mockOnForecastDaysChange).toHaveBeenCalledWith(5);
  });

  it('displays correct number of forecast items based on forecastDays', () => {
    const { rerender } = render(<DailyForecast {...defaultProps} forecastDays={2} />);
    
    let weatherIcons = screen.getAllByTestId('weather-icon');
    expect(weatherIcons).toHaveLength(2);

    rerender(<DailyForecast {...defaultProps} forecastDays={3} />);
    weatherIcons = screen.getAllByTestId('weather-icon');
    expect(weatherIcons).toHaveLength(3);
  });

  it('displays day names correctly', () => {
    render(<DailyForecast {...defaultProps} />);
    
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
  });

  it('displays temperature ranges correctly', () => {
    render(<DailyForecast {...defaultProps} />);
    
    expect(screen.getByText('25°')).toBeInTheDocument();
    expect(screen.getByText('15°')).toBeInTheDocument();
    expect(screen.getByText('22°')).toBeInTheDocument();
    expect(screen.getByText('12°')).toBeInTheDocument();
  });

  it('displays humidity percentages correctly', () => {
    render(<DailyForecast {...defaultProps} />);
    
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders weather icons with correct props', () => {
    render(<DailyForecast {...defaultProps} />);
    
    const weatherIcons = screen.getAllByTestId('weather-icon');
    
    expect(weatherIcons[0]).toHaveAttribute('data-icon', '01d');
    expect(weatherIcons[0]).toHaveAttribute('data-size', 'sm');
    
    expect(weatherIcons[1]).toHaveAttribute('data-icon', '02d');
    expect(weatherIcons[2]).toHaveAttribute('data-icon', '10d');
  });

  it('applies correct styling to forecast items', () => {
    const { container } = render(<DailyForecast {...defaultProps} />);
    
    const forecastItems = container.querySelectorAll('.bg-white\\/10');
    expect(forecastItems).toHaveLength(3);
    
    forecastItems.forEach(item => {
      expect(item).toHaveClass('flex items-center justify-between bg-white/10 rounded-lg p-1.5 sm:p-2');
    });
  });

  it('handles empty daily forecast array', () => {
    render(<DailyForecast {...defaultProps} dailyForecast={[]} />);
    
    expect(screen.getByText('3-Day Forecast')).toBeInTheDocument();
    const weatherIcons = screen.queryAllByTestId('weather-icon');
    expect(weatherIcons).toHaveLength(0);
  });

  it('limits forecast items to the specified number of days', () => {
    const largeForecast = Array(10).fill(null).map((_, index) => ({
      ...mockDailyForecast[0],
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'][index],
      tempHigh: 25 - index,
      tempLow: 15 - index,
    }));

    render(
      <DailyForecast 
        dailyForecast={largeForecast} 
        forecastDays={5} 
        onForecastDaysChange={jest.fn()} 
      />
    );
    
    const weatherIcons = screen.getAllByTestId('weather-icon');
    expect(weatherIcons).toHaveLength(5); // Should be limited to 5 items
  });
});

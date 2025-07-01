import { render, screen, fireEvent } from '@testing-library/react';
import DailyForecast from '../DailyForecast';
import { DailyForecast as DailyForecastType } from '../../../types/weather';

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
});

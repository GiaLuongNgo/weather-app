import { render, screen } from '@testing-library/react';
import HourlyForecast from '../HourlyForecast';
import { HourlyForecast as HourlyForecastType } from '@/types/weather';

// Mock the WeatherIcon component
jest.mock('../WeatherIcon', () => {
  return function MockWeatherIcon({ iconCode, size }: { iconCode: string; size?: string }) {
    return <div data-testid="weather-icon" data-icon={iconCode} data-size={size}>Mock Icon</div>;
  };
});

describe('HourlyForecast', () => {
  const mockHourlyForecast: HourlyForecastType[] = [
    {
      time: '14:00',
      temperature: 22,
      description: 'Partly Cloudy',
      icon: '02d',
      humidity: 65,
      windSpeed: 10,
      precipitation: 0,
    },
    {
      time: '17:00',
      temperature: 20,
      description: 'Cloudy',
      icon: '04d',
      humidity: 70,
      windSpeed: 12,
      precipitation: 10,
    },
    {
      time: '20:00',
      temperature: 18,
      description: 'Light Rain',
      icon: '10n',
      humidity: 80,
      windSpeed: 15,
      precipitation: 30,
    },
  ];

  it('renders the forecast header with title and icon', () => {
    render(<HourlyForecast hourlyForecast={mockHourlyForecast} />);
    
    expect(screen.getByText('3-Hour Forecast')).toBeInTheDocument();
    // Check if Clock icon is rendered (Lucide React icons render as SVG)
    const header = screen.getByText('3-Hour Forecast').closest('h3');
    expect(header).toBeInTheDocument();
  });

  it('renders correct number of forecast items (max 12)', () => {
    // Create 15 items to test the slice(0, 12) functionality
    const extendedForecast = Array(15).fill(null).map((_, index) => ({
      ...mockHourlyForecast[0],
      time: `${14 + index}:00`,
      temperature: 22 - index,
    }));

    render(<HourlyForecast hourlyForecast={extendedForecast} />);
    
    const weatherIcons = screen.getAllByTestId('weather-icon');
    expect(weatherIcons).toHaveLength(12); // Should be limited to 12 items
  });

  it('displays time for each forecast item', () => {
    render(<HourlyForecast hourlyForecast={mockHourlyForecast} />);
    
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('17:00')).toBeInTheDocument();
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });

  it('displays temperature for each forecast item', () => {
    render(<HourlyForecast hourlyForecast={mockHourlyForecast} />);
    
    expect(screen.getByText('22°')).toBeInTheDocument();
    expect(screen.getByText('20°')).toBeInTheDocument();
    expect(screen.getByText('18°')).toBeInTheDocument();
  });

  it('displays humidity for each forecast item', () => {
    render(<HourlyForecast hourlyForecast={mockHourlyForecast} />);
    
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders weather icons with correct props', () => {
    render(<HourlyForecast hourlyForecast={mockHourlyForecast} />);
    
    const weatherIcons = screen.getAllByTestId('weather-icon');
    
    expect(weatherIcons[0]).toHaveAttribute('data-icon', '02d');
    expect(weatherIcons[0]).toHaveAttribute('data-size', 'sm');
    
    expect(weatherIcons[1]).toHaveAttribute('data-icon', '04d');
    expect(weatherIcons[2]).toHaveAttribute('data-icon', '10n');
  });

  it('applies correct styling for scrollable container', () => {
    const { container } = render(<HourlyForecast hourlyForecast={mockHourlyForecast} />);
    
    const scrollContainer = container.querySelector('.overflow-x-scroll');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('flex space-x-3 overflow-x-scroll overflow-y-hidden pb-2 scrollbar-none');
  });

  it('handles empty forecast array', () => {
    render(<HourlyForecast hourlyForecast={[]} />);
    
    expect(screen.getByText('3-Hour Forecast')).toBeInTheDocument();
    const weatherIcons = screen.queryAllByTestId('weather-icon');
    expect(weatherIcons).toHaveLength(0);
  });

  it('applies correct styling to individual forecast items', () => {
    const { container } = render(<HourlyForecast hourlyForecast={mockHourlyForecast} />);
    
    const forecastItems = container.querySelectorAll('.bg-white\\/10');
    expect(forecastItems).toHaveLength(3);
    
    forecastItems.forEach(item => {
      expect(item).toHaveClass('flex-shrink-0 text-center bg-white/10 rounded-lg p-1.5 sm:p-2 min-w-[50px] sm:min-w-[60px]');
    });
  });
});

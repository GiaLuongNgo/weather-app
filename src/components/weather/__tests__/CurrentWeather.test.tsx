import { render, screen } from '@testing-library/react';
import CurrentWeather from '../CurrentWeather';
import { WeatherData } from '@/types/weather';

// Mock the WeatherIcon component
jest.mock('../WeatherIcon', () => {
  return function MockWeatherIcon({ iconCode, size }: { iconCode: string; size?: string }) {
    return <div data-testid="weather-icon" data-icon={iconCode} data-size={size}>Mock Icon</div>;
  };
});

describe('CurrentWeather', () => {
  const mockWeatherData: WeatherData = {
    city: 'New York',
    country: 'United States',
    temperature: 22,
    description: 'partly cloudy',
    icon: '02d',
    humidity: 65,
    windSpeed: 10,
    feelsLike: 24,
    pressure: 1013,
    visibility: 16,
    uvIndex: 5,
    sunrise: '06:30',
    sunset: '19:45',
  };

  it('renders weather icon with correct props', () => {
    render(<CurrentWeather weatherData={mockWeatherData} />);
    
    const weatherIcon = screen.getByTestId('weather-icon');
    expect(weatherIcon).toBeInTheDocument();
    expect(weatherIcon).toHaveAttribute('data-icon', '02d');
    expect(weatherIcon).toHaveAttribute('data-size', 'md');
  });

  it('displays temperature and description', () => {
    render(<CurrentWeather weatherData={mockWeatherData} />);
    
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('partly cloudy')).toBeInTheDocument();
  });

  it('displays humidity information', () => {
    render(<CurrentWeather weatherData={mockWeatherData} />);
    
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('displays wind speed information', () => {
    render(<CurrentWeather weatherData={mockWeatherData} />);
    
    expect(screen.getByText('10 km/h')).toBeInTheDocument();
  });

  it('displays visibility information', () => {
    render(<CurrentWeather weatherData={mockWeatherData} />);
    
    expect(screen.getByText('16 km')).toBeInTheDocument();
  });

  it('displays pressure information', () => {
    render(<CurrentWeather weatherData={mockWeatherData} />);
    
    expect(screen.getByText('1013 hPa')).toBeInTheDocument();
  });

  it('displays sunrise and sunset times', () => {
    render(<CurrentWeather weatherData={mockWeatherData} />);
    
    expect(screen.getByText('06:30')).toBeInTheDocument();
    expect(screen.getByText('19:45')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<CurrentWeather weatherData={mockWeatherData} />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('mb-3 sm:mb-4');
  });

  it('capitalizes weather description', () => {
    const weatherDataWithLowerCase = {
      ...mockWeatherData,
      description: 'sunny',
    };
    
    const { container } = render(<CurrentWeather weatherData={weatherDataWithLowerCase} />);
    const descriptionElement = container.querySelector('.capitalize');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveTextContent('sunny');
  });
});

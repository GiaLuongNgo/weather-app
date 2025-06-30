import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WeatherWidget from '../WeatherWidget';
import { WeatherWidget as WeatherWidgetType } from '../../../types/weather';
import * as weatherService from '../../../services/weatherService';

// Mock environment variable before importing anything
process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key';

// Mock the weather service
jest.mock('../../../services/weatherService');

const mockedWeatherService = weatherService as jest.Mocked<typeof weatherService>;

// Test wrapper with React Query
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return { TestWrapper, queryClient };
};

const mockWeatherWidget: WeatherWidgetType = {
  id: '1',
  city: 'London',
  weatherData: {
    city: 'London',
    country: 'GB',
    temperature: 20,
    description: 'clear sky',
    icon: '01d',
    humidity: 65,
    windSpeed: 12,
    feelsLike: 19,
    pressure: 1013,
    visibility: 10,
    uvIndex: 0,
    sunrise: '06:30',
    sunset: '19:24'
  },
  hourlyForecast: [
    {
      time: '12 PM',
      temperature: 22,
      description: 'few clouds',
      icon: '02d',
      humidity: 60,
      windSpeed: 10,
      precipitation: 0
    }
  ],
  dailyForecast: [
    {
      date: '2023-12-15',
      day: 'Fri',
      tempHigh: 25,
      tempLow: 18,
      description: 'clear sky',
      icon: '01d',
      humidity: 60,
      windSpeed: 12,
      precipitation: 0
    }
  ],
  lastUpdated: new Date('2023-12-15T14:30:45'),
  forecastDays: 3
};

describe('WeatherWidget', () => {
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders weather widget with all components', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={mockWeatherWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
    expect(screen.getByTestId('weather-header')).toBeInTheDocument();
    expect(screen.getByTestId('current-weather')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('daily-forecast')).toBeInTheDocument();
    expect(screen.getByTestId('last-updated')).toBeInTheDocument();
  });

  it('shows hourly forecast when hourly toggle is clicked', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={mockWeatherWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    // Initially shows daily forecast
    expect(screen.getByTestId('daily-forecast')).toBeInTheDocument();
    expect(screen.queryByTestId('hourly-forecast')).not.toBeInTheDocument();

    // Click hourly toggle
    const hourlyToggle = screen.getByTestId('hourly-toggle');
    fireEvent.click(hourlyToggle);

    // Now shows hourly forecast
    expect(screen.getByTestId('hourly-forecast')).toBeInTheDocument();
    expect(screen.queryByTestId('daily-forecast')).not.toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={mockWeatherWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onUpdate when forecast days are changed', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={mockWeatherWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    const forecastSelect = screen.getByTestId('forecast-days-select');
    fireEvent.change(forecastSelect, { target: { value: '5' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('1', {
      ...mockWeatherWidget,
      forecastDays: 5
    });
  });

  it('calls refresh when refresh button is clicked', async () => {
    const mockWeatherData = {
      name: 'London',
      sys: { country: 'GB', sunrise: 1625123456, sunset: 1625169856 },
      main: { temp: 20, feels_like: 19, humidity: 65, pressure: 1013 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 3.2 },
      visibility: 10000,
      dt: 1625140856,
    };

    const mockForecastData = {
      city: { name: 'London', country: 'GB', sunrise: 1625123456, sunset: 1625169856 },
      list: [],
    };

    mockedWeatherService.getCurrentWeather.mockResolvedValue(mockWeatherData);
    mockedWeatherService.getForecast.mockResolvedValue(mockForecastData);

    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={mockWeatherWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockedWeatherService.getCurrentWeather).toHaveBeenCalledWith('London');
      expect(mockedWeatherService.getForecast).toHaveBeenCalledWith('London');
    });
  });

  it('displays weather icon', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={mockWeatherWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('current-weather-icon')).toBeInTheDocument();
  });

  it('switches between daily and hourly toggle states', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={mockWeatherWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    const dailyToggle = screen.getByTestId('daily-toggle');
    const hourlyToggle = screen.getByTestId('hourly-toggle');

    // Click daily toggle (should already be active)
    fireEvent.click(dailyToggle);
    expect(screen.getByTestId('daily-forecast')).toBeInTheDocument();

    // Click hourly toggle
    fireEvent.click(hourlyToggle);
    expect(screen.getByTestId('hourly-forecast')).toBeInTheDocument();

    // Click daily toggle again
    fireEvent.click(dailyToggle);
    expect(screen.getByTestId('daily-forecast')).toBeInTheDocument();
  });

  it('renders with different weather conditions', () => {
    const rainyWidget = {
      ...mockWeatherWidget,
      weatherData: {
        ...mockWeatherWidget.weatherData,
        icon: '10d',
        description: 'light rain'
      }
    };

    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <WeatherWidget
          widget={rainyWidget}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      </TestWrapper>
    );

    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
    expect(screen.getByTestId('current-weather-icon')).toBeInTheDocument();
  });
});

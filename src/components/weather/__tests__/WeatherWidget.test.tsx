import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WeatherWidget from '../WeatherWidget';
import { WeatherWidget as WeatherWidgetType } from '../../../types/weather';

process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key';
jest.mock('../../../services/weatherService');

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
});

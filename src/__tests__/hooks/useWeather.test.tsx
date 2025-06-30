import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCurrentWeather, useForecast, useLocationSearch, useWeatherData, weatherKeys } from '../../hooks/useWeather';
import * as weatherService from '../../services/weatherService';

// Mock environment variable before importing anything
process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key';

// Mock the weather service
jest.mock('../../services/weatherService');

const mockedWeatherService = weatherService as jest.Mocked<typeof weatherService>;

// Test component to render hooks
interface TestComponentProps {
  hookFn: (arg: string) => unknown;
  city?: string;
  query?: string;
}

interface HookResult {
  isLoading?: boolean;
  isError?: boolean;
  data?: unknown;
  weatherData?: unknown;
}

const TestComponent = ({ hookFn, city, query }: TestComponentProps) => {
  const result = hookFn(city || query || '') as HookResult;
  return (
    <div>
      <div data-testid="loading">{result.isLoading ? 'loading' : 'not loading'}</div>
      <div data-testid="error">{result.isError ? 'error' : 'no error'}</div>
      <div data-testid="data">{JSON.stringify(result.data || result.weatherData)}</div>
    </div>
  );
};

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

describe('useWeather hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('weatherKeys', () => {
    it('should generate correct query keys', () => {
      expect(weatherKeys.all).toEqual(['weather']);
      expect(weatherKeys.current('London')).toEqual(['weather', 'current', 'London']);
      expect(weatherKeys.forecast('Paris')).toEqual(['weather', 'forecast', 'Paris']);
      expect(weatherKeys.locations('New York')).toEqual(['weather', 'locations', 'New York']);
    });
  });

  describe('useCurrentWeather', () => {
    it('should fetch current weather data successfully', async () => {
      const mockWeatherData = {
        name: 'London',
        sys: { country: 'GB', sunrise: 1625123456, sunset: 1625169856 },
        main: { temp: 20, feels_like: 19, humidity: 65, pressure: 1013 },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 3.2 },
        visibility: 10000,
        dt: 1625140856,
      };

      mockedWeatherService.getCurrentWeather.mockResolvedValueOnce(mockWeatherData);

      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useCurrentWeather} city="London" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('no error');
      expect(mockedWeatherService.getCurrentWeather).toHaveBeenCalledWith('London');
    });

    it('should not fetch data when city is empty', async () => {
      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useCurrentWeather} city="" />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      expect(mockedWeatherService.getCurrentWeather).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockedWeatherService.getCurrentWeather.mockRejectedValueOnce(new Error('API Error'));

      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useCurrentWeather} city="InvalidCity" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('error');
      });

      expect(mockedWeatherService.getCurrentWeather).toHaveBeenCalledWith('InvalidCity');
    });
  });

  describe('useForecast', () => {
    it('should fetch forecast data successfully', async () => {
      const mockForecastData = {
        city: { name: 'London', country: 'GB', sunrise: 1625123456, sunset: 1625169856 },
        list: [
          {
            dt: 1625140856,
            main: { temp: 22, feels_like: 21, temp_min: 20, temp_max: 24, humidity: 60, pressure: 1015 },
            weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
            wind: { speed: 2.8 },
            visibility: 10000,
            dt_txt: '2021-07-01 12:00:00',
          },
        ],
      };

      mockedWeatherService.getForecast.mockResolvedValueOnce(mockForecastData);

      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useForecast} city="London" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('no error');
      expect(mockedWeatherService.getForecast).toHaveBeenCalledWith('London');
    });

    it('should not fetch data when city is empty', async () => {
      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useForecast} city="" />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      expect(mockedWeatherService.getForecast).not.toHaveBeenCalled();
    });
  });

  describe('useLocationSearch', () => {
    it('should search locations successfully', async () => {
      const mockLocations = [
        { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
        { name: 'London', lat: 42.9834, lon: -81.233, country: 'CA', state: 'Ontario' },
      ];

      mockedWeatherService.searchLocations.mockResolvedValueOnce(mockLocations);

      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useLocationSearch} query="London" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('no error');
      expect(mockedWeatherService.searchLocations).toHaveBeenCalledWith('London');
    });

    it('should not search when query is too short', async () => {
      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useLocationSearch} query="L" />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      expect(mockedWeatherService.searchLocations).not.toHaveBeenCalled();
    });

    it('should not search when query is empty', async () => {
      const { TestWrapper } = createTestWrapper();

      render(
        <TestWrapper>
          <TestComponent hookFn={useLocationSearch} query="" />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      expect(mockedWeatherService.searchLocations).not.toHaveBeenCalled();
    });

    it('should filter and limit search results', async () => {
      const mockLocations = [
        { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
        { name: '', lat: 42.9834, lon: -81.233, country: 'CA', state: 'Ontario' }, // Invalid - no name
        { name: 'London', lat: 42.9834, lon: -81.233, country: '', state: 'Ontario' }, // Invalid - no country
        { name: 'London', lat: 40.7128, lon: -74.0060, country: 'US', state: 'New York' },
        { name: 'London', lat: 37.1289, lon: -84.0833, country: 'US', state: 'Kentucky' },
        { name: 'London', lat: 39.8864, lon: -83.4483, country: 'US', state: 'Ohio' },
        { name: 'London', lat: 36.1201, lon: -84.0833, country: 'US', state: 'Tennessee' },
      ];

      mockedWeatherService.searchLocations.mockResolvedValueOnce(mockLocations);

      const { TestWrapper } = createTestWrapper();

      const TestComponentWithResults = () => {
        const result = useLocationSearch('London');
        return (
          <div>
            <div data-testid="loading">{result.isLoading ? 'loading' : 'not loading'}</div>
            <div data-testid="error">{result.isError ? 'error' : 'no error'}</div>
            <div data-testid="count">{result.data?.length || 0}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponentWithResults />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('no error');
      expect(screen.getByTestId('count')).toHaveTextContent('5'); // Limited to 5 results
    });
  });

  describe('useWeatherData', () => {
    it('should combine current weather and forecast data', async () => {
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
        list: [
          {
            dt: 1625140856,
            main: { temp: 22, feels_like: 21, temp_min: 20, temp_max: 24, humidity: 60, pressure: 1015 },
            weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
            wind: { speed: 2.8 },
            visibility: 10000,
            dt_txt: '2021-07-01 12:00:00',
          },
        ],
      };

      mockedWeatherService.getCurrentWeather.mockResolvedValueOnce(mockWeatherData);
      mockedWeatherService.getForecast.mockResolvedValueOnce(mockForecastData);

      const { TestWrapper } = createTestWrapper();

      const TestWeatherDataComponent = () => {
        const result = useWeatherData('London');
        return (
          <div>
            <div data-testid="loading">{result.isLoading ? 'loading' : 'not loading'}</div>
            <div data-testid="error">{result.isError ? 'error' : 'no error'}</div>
            <div data-testid="has-weather-data">{result.weatherData ? 'yes' : 'no'}</div>
            <div data-testid="hourly-count">{result.hourlyForecast.length}</div>
            <div data-testid="daily-count">{result.dailyForecast.length}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestWeatherDataComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(screen.getByTestId('error')).toHaveTextContent('no error');
      expect(screen.getByTestId('has-weather-data')).toHaveTextContent('yes');
      expect(mockedWeatherService.getCurrentWeather).toHaveBeenCalledWith('London');
      expect(mockedWeatherService.getForecast).toHaveBeenCalledWith('London');
    });

    it('should handle refetch for both current weather and forecast', async () => {
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

      const TestWeatherDataRefetchComponent = () => {
        const result = useWeatherData('London');
        
        return (
          <div>
            <div data-testid="loading">{result.isLoading ? 'loading' : 'not loading'}</div>
            <div data-testid="refetch-available">{typeof result.refetch === 'function' ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestWeatherDataRefetchComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
      });

      expect(screen.getByTestId('refetch-available')).toHaveTextContent('yes');
      expect(mockedWeatherService.getCurrentWeather).toHaveBeenCalledWith('London');
      expect(mockedWeatherService.getForecast).toHaveBeenCalledWith('London');
    });
  });
});

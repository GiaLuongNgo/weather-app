import { getCurrentWeather, getForecast, searchLocations } from '../../services/weatherService';

// Mock fetch
global.fetch = jest.fn();

// Mock environment variable before importing the service
process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key';

describe('weatherService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather data successfully', async () => {
      const mockResponse = {
        name: 'London',
        sys: {
          country: 'GB',
          sunrise: 1625123456,
          sunset: 1625169856,
        },
        main: {
          temp: 20.5,
          feels_like: 19.8,
          humidity: 65,
          pressure: 1013,
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        wind: {
          speed: 3.2,
        },
        visibility: 10000,
        dt: 1625140856,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCurrentWeather('London');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=London&appid=test-api-key&units=metric'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API request fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getCurrentWeather('InvalidCity')).rejects.toThrow(
        'Weather API request failed: 404 Not Found'
      );
    });

    it('should encode city name properly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await getCurrentWeather('New York');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=New%20York&appid=test-api-key&units=metric'
      );
    });
  });

  describe('getForecast', () => {
    it('should fetch forecast data successfully', async () => {
      const mockResponse = {
        city: {
          name: 'London',
          country: 'GB',
          sunrise: 1625123456,
          sunset: 1625169856,
        },
        list: [
          {
            dt: 1625140856,
            main: {
              temp: 22.3,
              feels_like: 21.8,
              temp_min: 20.1,
              temp_max: 24.5,
              humidity: 60,
              pressure: 1015,
            },
            weather: [
              {
                main: 'Clouds',
                description: 'few clouds',
                icon: '02d',
              },
            ],
            wind: {
              speed: 2.8,
            },
            visibility: 10000,
            dt_txt: '2021-07-01 12:00:00',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getForecast('London');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/forecast?q=London&appid=test-api-key&units=metric'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when forecast API request fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getForecast('London')).rejects.toThrow(
        'Forecast API request failed: 500 Internal Server Error'
      );
    });
  });

  describe('searchLocations', () => {
    it('should search locations successfully', async () => {
      const mockResponse = [
        {
          name: 'London',
          lat: 51.5074,
          lon: -0.1278,
          country: 'GB',
          state: 'England',
        },
        {
          name: 'London',
          lat: 42.9834,
          lon: -81.233,
          country: 'CA',
          state: 'Ontario',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchLocations('London');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=test-api-key'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when geocoding API request fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(searchLocations('London')).rejects.toThrow(
        'Geocoding API request failed: 401 Unauthorized'
      );
    });

    it('should encode search query properly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await searchLocations('São Paulo');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/geo/1.0/direct?q=S%C3%A3o%20Paulo&limit=5&appid=test-api-key'
      );
    });
  });
});

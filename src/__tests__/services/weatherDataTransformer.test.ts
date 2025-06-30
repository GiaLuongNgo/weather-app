import { transformCurrentWeather, transformHourlyForecast, transformDailyForecast } from '../../services/weatherDataTransformer';
import { OpenWeatherResponse, OpenWeatherForecastResponse } from '../../services/weatherService';

describe('weatherDataTransformer', () => {
  describe('transformCurrentWeather', () => {
    it('should transform current weather data correctly', () => {
      const mockApiResponse: OpenWeatherResponse = {
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

      const result = transformCurrentWeather(mockApiResponse);

      expect(result).toEqual({
        city: 'London',
        country: 'GB',
        temperature: 21,
        description: 'clear sky',
        icon: '01d',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 20,
        pressure: 1013,
        visibility: 10,
        uvIndex: 0,
        sunrise: expect.any(String),
        sunset: expect.any(String),
      });
    });

    it('should format sunrise and sunset times correctly', () => {
      const mockApiResponse: OpenWeatherResponse = {
        name: 'Test City',
        sys: {
          country: 'US',
          sunrise: 1625123456,
          sunset: 1625169856,
        },
        main: {
          temp: 25,
          feels_like: 24,
          humidity: 50,
          pressure: 1000,
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        wind: {
          speed: 5,
        },
        visibility: 15000,
        dt: 1625140856,
      };

      const result = transformCurrentWeather(mockApiResponse);

      expect(result.sunrise).toMatch(/^\d{1,2}:\d{2}\s?(AM|PM)$/i);
      expect(result.sunset).toMatch(/^\d{1,2}:\d{2}\s?(AM|PM)$/i);
    });
  });

  describe('transformHourlyForecast', () => {
    it('should transform hourly forecast data correctly', () => {
      const mockForecastResponse: OpenWeatherForecastResponse = {
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
          {
            dt: 1625151656,
            main: {
              temp: 25.1,
              feels_like: 24.2,
              temp_min: 23.0,
              temp_max: 27.0,
              humidity: 55,
              pressure: 1012,
            },
            weather: [
              {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
              },
            ],
            wind: {
              speed: 3.5,
            },
            visibility: 10000,
            dt_txt: '2021-07-01 15:00:00',
          },
        ],
      };

      const result = transformHourlyForecast(mockForecastResponse);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        time: expect.any(String),
        temperature: 22,
        description: 'few clouds',
        icon: '02d',
        humidity: 60,
        windSpeed: 10,
        precipitation: 0,
      });
      expect(result[1]).toEqual({
        time: expect.any(String),
        temperature: 25,
        description: 'clear sky',
        icon: '01d',
        humidity: 55,
        windSpeed: 13,
        precipitation: 0,
      });
    });

    it('should limit to 24 hourly forecasts', () => {
      const mockForecastResponse: OpenWeatherForecastResponse = {
        city: {
          name: 'London',
          country: 'GB',
          sunrise: 1625123456,
          sunset: 1625169856,
        },
        list: Array.from({ length: 40 }, (_, index) => ({
          dt: 1625140856 + index * 3600,
          main: {
            temp: 20 + index,
            feels_like: 20 + index,
            temp_min: 18 + index,
            temp_max: 22 + index,
            humidity: 60,
            pressure: 1015,
          },
          weather: [
            {
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
          wind: {
            speed: 3,
          },
          visibility: 10000,
          dt_txt: `2021-07-01 ${index}:00:00`,
        })),
      };

      const result = transformHourlyForecast(mockForecastResponse);

      expect(result).toHaveLength(24);
    });
  });

  describe('transformDailyForecast', () => {
    it('should transform daily forecast data correctly', () => {
      const mockForecastResponse: OpenWeatherForecastResponse = {
        city: {
          name: 'London',
          country: 'GB',
          sunrise: 1625123456,
          sunset: 1625169856,
        },
        list: [
          {
            dt: 1625097600,
            main: {
              temp: 18.5,
              feels_like: 17.8,
              temp_min: 16.0,
              temp_max: 20.0,
              humidity: 70,
              pressure: 1010,
            },
            weather: [
              {
                main: 'Rain',
                description: 'light rain',
                icon: '10d',
              },
            ],
            wind: {
              speed: 4.0,
            },
            visibility: 8000,
            dt_txt: '2021-07-01 00:00:00',
          },
          {
            dt: 1625108400,
            main: {
              temp: 22.0,
              feels_like: 21.5,
              temp_min: 20.0,
              temp_max: 24.0,
              humidity: 60,
              pressure: 1012,
            },
            weather: [
              {
                main: 'Clouds',
                description: 'few clouds',
                icon: '02d',
              },
            ],
            wind: {
              speed: 3.0,
            },
            visibility: 10000,
            dt_txt: '2021-07-01 03:00:00',
          },
          {
            dt: 1625119200,
            main: {
              temp: 25.5,
              feels_like: 24.8,
              temp_min: 23.0,
              temp_max: 27.0,
              humidity: 50,
              pressure: 1015,
            },
            weather: [
              {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
              },
            ],
            wind: {
              speed: 2.5,
            },
            visibility: 10000,
            dt_txt: '2021-07-01 06:00:00',
          },
          {
            dt: 1625184000,
            main: {
              temp: 20.0,
              feels_like: 19.5,
              temp_min: 18.0,
              temp_max: 22.0,
              humidity: 65,
              pressure: 1008,
            },
            weather: [
              {
                main: 'Clouds',
                description: 'overcast clouds',
                icon: '04d',
              },
            ],
            wind: {
              speed: 5.0,
            },
            visibility: 9000,
            dt_txt: '2021-07-02 00:00:00',
          },
        ],
      };

      const result = transformDailyForecast(mockForecastResponse);

      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({
        date: '2021-07-01',
        day: expect.any(String),
        tempHigh: 26,
        tempLow: 19,
        description: 'few clouds',
        icon: '02d',
        humidity: 60,
        windSpeed: 11,
        precipitation: 0,
      });

      expect(result[1]).toEqual({
        date: '2021-07-02',
        day: expect.any(String),
        tempHigh: 20,
        tempLow: 20,
        description: 'overcast clouds',
        icon: '04d',
        humidity: 65,
        windSpeed: 18,
        precipitation: 0,
      });
    });

    it('should limit to 7 days', () => {
      const mockForecastResponse: OpenWeatherForecastResponse = {
        city: {
          name: 'London',
          country: 'GB',
          sunrise: 1625123456,
          sunset: 1625169856,
        },
        list: Array.from({ length: 80 }, (_, index) => ({
          dt: 1625097600 + index * 86400,
          main: {
            temp: 20,
            feels_like: 20,
            temp_min: 18,
            temp_max: 22,
            humidity: 60,
            pressure: 1015,
          },
          weather: [
            {
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
          wind: {
            speed: 3,
          },
          visibility: 10000,
          dt_txt: `2021-07-${String(index + 1).padStart(2, '0')} 12:00:00`,
        })),
      };

      const result = transformDailyForecast(mockForecastResponse);

      expect(result.length).toBeLessThanOrEqual(7);
    });

    it('should format day names correctly', () => {
      const mockForecastResponse: OpenWeatherForecastResponse = {
        city: {
          name: 'London',
          country: 'GB',
          sunrise: 1625123456,
          sunset: 1625169856,
        },
        list: [
          {
            dt: 1625097600,
            main: {
              temp: 20,
              feels_like: 20,
              temp_min: 18,
              temp_max: 22,
              humidity: 60,
              pressure: 1015,
            },
            weather: [
              {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
              },
            ],
            wind: {
              speed: 3,
            },
            visibility: 10000,
            dt_txt: '2021-07-01 12:00:00',
          },
        ],
      };

      const result = transformDailyForecast(mockForecastResponse);

      expect(result[0].day).toMatch(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/);
    });
  });
});

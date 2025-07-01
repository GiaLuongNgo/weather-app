import { useQuery } from '@tanstack/react-query';
import { WeatherData, HourlyForecast, DailyForecast, GeoLocation } from '@/types/weather';
import { getCurrentWeather, getForecast, searchLocations, OpenWeatherGeoResponse } from '@/services/weatherService';
import { transformCurrentWeather, transformHourlyForecast, transformDailyForecast } from '@/services/weatherDataTransformer';

// Query keys
export const weatherKeys = {
  all: ['weather'] as const,
  current: (city: string) => [...weatherKeys.all, 'current', city] as const,
  forecast: (city: string) => [...weatherKeys.all, 'forecast', city] as const,
  locations: (query: string) => [...weatherKeys.all, 'locations', query] as const,
};

export function useCurrentWeather(city: string) {
  return useQuery({
    queryKey: weatherKeys.current(city),
    queryFn: async (): Promise<WeatherData> => {
      const response = await getCurrentWeather(city);
      return transformCurrentWeather(response);
    },
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  });
}

export function useForecast(city: string) {
  return useQuery({
    queryKey: weatherKeys.forecast(city),
    queryFn: async (): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> => {
      const response = await getForecast(city);
      return {
        hourly: transformHourlyForecast(response),
        daily: transformDailyForecast(response),
      };
    },
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: weatherKeys.locations(query),
    queryFn: async (): Promise<GeoLocation[]> => {
      if (!query.trim() || query.length < 2) return [];
      
      const locations = await searchLocations(query);

      return locations
        .filter((location: OpenWeatherGeoResponse) => location.name && location.country)
        .map((location: OpenWeatherGeoResponse) => ({
          name: location.name,
          lat: location.lat,
          lon: location.lon,
          country: location.country,
          state: location.state
        }))
        .slice(0, 5);
    },
    enabled: !!query.trim() && query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
}

// Combined hook for complete weather data
export function useWeatherData(city: string) {
  const currentWeather = useCurrentWeather(city);
  const forecast = useForecast(city);

  return {
    weatherData: currentWeather.data,
    hourlyForecast: forecast.data?.hourly || [],
    dailyForecast: forecast.data?.daily || [],
    isLoading: currentWeather.isLoading || forecast.isLoading,
    error: currentWeather.error || forecast.error,
    isError: currentWeather.isError || forecast.isError,
    refetch: () => {
      currentWeather.refetch();
      forecast.refetch();
    },
  };
}

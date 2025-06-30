import { WeatherData, HourlyForecast, DailyForecast } from '@/types/weather';
import { OpenWeatherResponse, OpenWeatherForecastResponse } from './weatherService';

// Transform current weather data
export function transformCurrentWeather(data: OpenWeatherResponse): WeatherData {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    feelsLike: Math.round(data.main.feels_like),
    pressure: data.main.pressure,
    visibility: Math.round(data.visibility / 1000), // Convert meters to kilometers
    uvIndex: 0, // UV index not available in current weather API
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
  };
}

// Transform hourly forecast data
export function transformHourlyForecast(data: OpenWeatherForecastResponse): HourlyForecast[] {
  return data.list.slice(0, 24).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { 
      hour: 'numeric', 
      hour12: true 
    }),
    temperature: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
    precipitation: 0, // Precipitation data not readily available in this format
  }));
}

// Transform daily forecast data
export function transformDailyForecast(data: OpenWeatherForecastResponse): DailyForecast[] {
  // Group forecast data by day
  const dailyData = new Map<string, typeof data.list>();
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyData.has(dateKey)) {
      dailyData.set(dateKey, []);
    }
    dailyData.get(dateKey)!.push(item);
  });

  // Transform grouped data into daily forecasts
  const dailyForecasts: DailyForecast[] = [];
  
  for (const [dateKey, dayData] of dailyData) {
    if (dailyForecasts.length >= 7) break; // Limit to 7 days
    
    const date = new Date(dateKey);
    const temps = dayData.map(item => item.main.temp);
    const humidity = dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length;
    const windSpeed = dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length;
    
    // Use the weather condition from the middle of the day (around noon)
    const middayIndex = Math.floor(dayData.length / 2);
    const representativeWeather = dayData[middayIndex]?.weather[0] || dayData[0].weather[0];
    
    dailyForecasts.push({
      date: dateKey,
      day: date.toLocaleDateString([], { weekday: 'short' }),
      tempHigh: Math.round(Math.max(...temps)),
      tempLow: Math.round(Math.min(...temps)),
      description: representativeWeather.description,
      icon: representativeWeather.icon,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed * 3.6), // Convert m/s to km/h
      precipitation: 0, // Precipitation data not readily available
    });
  }

  return dailyForecasts;
}

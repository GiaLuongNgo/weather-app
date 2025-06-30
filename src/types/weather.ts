export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface DailyForecast {
  date: string;
  day: string;
  tempHigh: number;
  tempLow: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherWidget {
  id: string;
  city: string;
  weatherData: WeatherData;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  lastUpdated: Date;
  forecastDays: number;
}

export interface WeatherPosition {
  x: number;
  y: number;
}

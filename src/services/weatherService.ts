const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

if (!API_KEY) {
  throw new Error('OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment variables.');
}

// Response interfaces
export interface OpenWeatherResponse {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  dt: number;
}

export interface OpenWeatherForecastResponse {
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    visibility: number;
    dt_txt: string;
  }>;
}

export interface OpenWeatherGeoResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Get current weather data
export async function getCurrentWeather(city: string): Promise<OpenWeatherResponse> {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Weather API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Get forecast data
export async function getForecast(city: string): Promise<OpenWeatherForecastResponse> {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Forecast API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Search for locations
export async function searchLocations(query: string): Promise<OpenWeatherGeoResponse[]> {
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Geocoding API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

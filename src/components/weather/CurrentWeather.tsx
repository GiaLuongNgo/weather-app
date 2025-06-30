import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from 'lucide-react';
import { WeatherData } from '@/types/weather';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

export default function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  return (
    <div className="mb-3 sm:mb-4" data-testid="current-weather">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
        <WeatherIcon iconCode={weatherData.icon} size="md" testId="current-weather-icon" />
        <div className="flex-1 min-w-0">
          <div className="text-xl sm:text-2xl font-bold">{weatherData.temperature}°C</div>
          <div className="text-white/80 text-xs sm:text-sm capitalize truncate">{weatherData.description}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-xs">
        <div className="flex items-center space-x-1">
          <Droplets className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{weatherData.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wind className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{weatherData.windSpeed} km/h</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{weatherData.visibility} km</span>
        </div>
        <div className="flex items-center space-x-1">
          <Gauge className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{weatherData.pressure} hPa</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <Sunrise className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{weatherData.sunrise}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Sunset className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{weatherData.sunset}</span>
        </div>
      </div>
    </div>
  );
}

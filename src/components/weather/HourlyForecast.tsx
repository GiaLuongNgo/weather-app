import { Clock } from 'lucide-react';
import { HourlyForecast as HourlyForecastType } from '@/types/weather';
import WeatherIcon from './WeatherIcon';

interface HourlyForecastProps {
  hourlyForecast: HourlyForecastType[];
}

export default function HourlyForecast({ hourlyForecast }: HourlyForecastProps) {
  return (
    <div data-testid="hourly-forecast">
      <h3 className="text-sm font-semibold mb-2 flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        3-Hour Forecast
      </h3>
      <div 
        className="flex space-x-3 overflow-x-scroll overflow-y-hidden pb-2 scrollbar-none"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {hourlyForecast.slice(0, 12).map((hour, index) => (
          <div key={index} className="flex-shrink-0 text-center bg-white/10 rounded-lg p-1.5 sm:p-2 min-w-[50px] sm:min-w-[60px]">
            <div className="text-xs text-white/80 mb-1 truncate">{hour.time}</div>
            <div className="mb-1">
              <WeatherIcon iconCode={hour.icon} size="sm" testId={`hourly-weather-icon-${index}`} />
            </div>
            <div className="text-xs font-medium">{hour.temperature}°</div>
            <div className="text-xs text-white/60">{hour.humidity}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

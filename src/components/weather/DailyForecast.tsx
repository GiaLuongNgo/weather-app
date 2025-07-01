import { Calendar, Droplets } from 'lucide-react';
import { DailyForecast as DailyForecastType } from '@/types/weather';
import WeatherIcon from './WeatherIcon';

interface DailyForecastProps {
  dailyForecast: DailyForecastType[];
  forecastDays: number;
  onForecastDaysChange: (days: number) => void;
}

export default function DailyForecast({ 
  dailyForecast, 
  forecastDays, 
  onForecastDaysChange 
}: DailyForecastProps) {
  const visibleDailyForecast = dailyForecast.slice(0, forecastDays);

  return (
    <div data-testid="daily-forecast">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {forecastDays}-Day Forecast
        </h3>
        <div className="flex items-center space-x-1">
          <select
            value={forecastDays}
            onChange={(e) => onForecastDaysChange(Number(e.target.value))}
            className="bg-white/20 border border-white/30 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/50 cursor-pointer"
            aria-label="Select number of forecast days"
            data-testid="forecast-days-select"
          >
            {[1, 2, 3, 4, 5, 6].map(days => (
              <option key={days} value={days} className="text-black">
                {days}d
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-1.5">
        {visibleDailyForecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-1.5 sm:p-2">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="text-xs font-medium w-6 sm:w-8 truncate">{day.day}</div>
              <div className="flex-shrink-0">
                <WeatherIcon iconCode={day.icon} size="sm" testId={`daily-weather-icon-${index}`} />
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1 text-xs">
                <Droplets className="h-3 w-3" />
                <span>{day.humidity}%</span>
              </div>
              <div className="text-xs font-medium">
                <span className="text-white">{day.tempHigh}°</span>
                <span className="text-white/60 ml-1">{day.tempLow}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

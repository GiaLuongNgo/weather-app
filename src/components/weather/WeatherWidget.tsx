'use client';

import { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Clock,
  Calendar
} from 'lucide-react';
import { WeatherWidget as WeatherWidgetType } from '@/types/weather';
import { useWeatherData } from '@/hooks/useWeather';
import { getCurrentWeather, getForecast } from '@/services/weatherService';
import { transformCurrentWeather, transformHourlyForecast, transformDailyForecast } from '@/services/weatherDataTransformer';

interface WeatherWidgetProps {
  widget: WeatherWidgetType;
  onDelete: (widgetId: string) => void;
  onUpdate: (widgetId: string, updatedWidget: WeatherWidgetType) => void;
}

export default function WeatherWidget({ widget, onDelete, onUpdate }: WeatherWidgetProps) {
  const [showHourly, setShowHourly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isLoading, refetch } = useWeatherData(widget.city);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch fresh weather data directly
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        getCurrentWeather(widget.city),
        getForecast(widget.city)
      ]);

      const weatherData = transformCurrentWeather(currentWeatherResponse);
      const hourlyForecast = transformHourlyForecast(forecastResponse);
      const dailyForecast = transformDailyForecast(forecastResponse);
      
      // Update the widget with fresh data and new timestamp
      const updatedWidget = {
        ...widget,
        weatherData,
        hourlyForecast,
        dailyForecast,
        lastUpdated: new Date()
      };
      onUpdate(widget.id, updatedWidget);
      
      // Also refresh React Query cache
      await refetch();
    } catch (error) {
      console.error('Failed to refresh weather data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleForecastDaysChange = (days: number) => {
    const updatedWidget = {
      ...widget,
      forecastDays: days
    };
    onUpdate(widget.id, updatedWidget);
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙', // clear sky
      '02d': '⛅', '02n': '☁️', // few clouds
      '03d': '☁️', '03n': '☁️', // scattered clouds
      '04d': '☁️', '04n': '☁️', // broken clouds
      '09d': '🌧️', '09n': '🌧️', // shower rain
      '10d': '🌦️', '10n': '🌧️', // rain
      '11d': '⛈️', '11n': '⛈️', // thunderstorm
      '13d': '❄️', '13n': '❄️', // snow
      '50d': '💨', '50n': '💨'  // mist
    };
    
    return iconMap[iconCode] || '☀️';
  };

  const getWeatherBackgroundColor = (iconCode: string) => {
    // Map weather conditions to gradient colors
    const weatherBackgrounds: { [key: string]: string } = {
      // Clear sky - blue sky with yellow sun in top right
      '01d': 'bg-gradient-to-bl from-yellow-300 via-sky-300 to-blue-400',
      '01n': 'bg-gradient-to-br from-indigo-800 via-purple-800 to-blue-900',
      
      // Few clouds - partly cloudy
      '02d': 'bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400',
      '02n': 'bg-gradient-to-br from-slate-700 via-blue-800 to-indigo-800',
      
      // Scattered/broken clouds - cloudy
      '03d': 'bg-gradient-to-br from-gray-400 via-slate-400 to-blue-400',
      '03n': 'bg-gradient-to-br from-gray-700 via-slate-700 to-blue-800',
      '04d': 'bg-gradient-to-br from-gray-500 via-slate-500 to-blue-500',
      '04n': 'bg-gradient-to-br from-gray-800 via-slate-800 to-blue-900',
      
      // Rain - blue/gray tones
      '09d': 'bg-gradient-to-br from-blue-600 via-slate-600 to-gray-600',
      '09n': 'bg-gradient-to-br from-blue-800 via-slate-800 to-gray-800',
      '10d': 'bg-gradient-to-br from-blue-500 via-cyan-600 to-slate-600',
      '10n': 'bg-gradient-to-br from-blue-700 via-cyan-800 to-slate-800',
      
      // Thunderstorm - dark dramatic colors
      '11d': 'bg-gradient-to-br from-purple-700 via-gray-700 to-slate-800',
      '11n': 'bg-gradient-to-br from-purple-900 via-gray-900 to-black',
      
      // Snow - white/light blue
      '13d': 'bg-gradient-to-br from-blue-200 via-slate-300 to-gray-400',
      '13n': 'bg-gradient-to-br from-blue-800 via-slate-800 to-gray-900',
      
      // Mist/fog - soft gray tones
      '50d': 'bg-gradient-to-br from-gray-300 via-slate-400 to-blue-400',
      '50n': 'bg-gradient-to-br from-gray-600 via-slate-700 to-blue-800'
    };
    
    return weatherBackgrounds[iconCode] || 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500';
  };

  const visibleDailyForecast = widget.dailyForecast.slice(0, widget.forecastDays);  

  // Use weather-based background color
  const backgroundClass = getWeatherBackgroundColor(widget.weatherData.icon);

  return (
    <div className={`${backgroundClass} rounded-xl p-3 sm:p-4 text-white shadow-xl w-full max-w-[280px] sm:w-[280px] relative select-none`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold truncate">{widget.weatherData.city}</h2>
          <p className="text-white/80 text-xs truncate">{widget.weatherData.country}</p>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="p-1 sm:p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onDelete(widget.id)}
            className="p-1 sm:p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
          <div className="text-3xl sm:text-4xl">
            {getWeatherIcon(widget.weatherData.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-bold">{widget.weatherData.temperature}°C</div>
            <div className="text-white/80 text-xs sm:text-sm capitalize truncate">{widget.weatherData.description}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-xs">
          <div className="flex items-center space-x-1">
            <Droplets className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{widget.weatherData.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{widget.weatherData.windSpeed} km/h</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{widget.weatherData.visibility} km</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gauge className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{widget.weatherData.pressure} hPa</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <Sunrise className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{widget.weatherData.sunrise}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sunset className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{widget.weatherData.sunset}</span>
          </div>
        </div>
      </div>

      {/* Toggle between Hourly and Daily */}
      <div className="flex items-center justify-center mb-2 sm:mb-3">
        <div className="bg-white/20 rounded-full p-0.5 flex">
          <button
            onClick={() => setShowHourly(false)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              !showHourly ? 'bg-white text-blue-600' : 'text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setShowHourly(true)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              showHourly ? 'bg-white text-blue-600' : 'text-white'
            }`}
          >
            Hourly
          </button>
        </div>
      </div>

      {/* Hourly Forecast */}
      {showHourly && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Hourly Forecast
          </h3>
          <div 
            className="flex space-x-3 overflow-x-scroll overflow-y-hidden pb-2 scrollbar-none"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {widget.hourlyForecast.slice(0, 12).map((hour, index) => (
              <div key={index} className="flex-shrink-0 text-center bg-white/10 rounded-lg p-1.5 sm:p-2 min-w-[50px] sm:min-w-[60px]">
                <div className="text-xs text-white/80 mb-1 truncate">{hour.time}</div>
                <div className="text-base sm:text-lg mb-1">
                  {getWeatherIcon(hour.icon)}
                </div>
                <div className="text-xs font-medium">{hour.temperature}°</div>
                <div className="text-xs text-white/60">{hour.humidity}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Forecast */}
      {!showHourly && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {widget.forecastDays}-Day Forecast
            </h3>
            <div className="flex items-center space-x-1">
              <select
                value={widget.forecastDays}
                onChange={(e) => handleForecastDaysChange(Number(e.target.value))}
                className="bg-white/20 border border-white/30 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/50 cursor-pointer"
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
                  <div className="text-base sm:text-lg flex-shrink-0">
                    {getWeatherIcon(day.icon)}
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
      )}

      {/* Last Updated */}
      <div className="text-xs text-white/60 text-center mt-2 sm:mt-3">
        Last updated: {widget.lastUpdated.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })} at {widget.lastUpdated.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })}
      </div>
    </div>
  );
}

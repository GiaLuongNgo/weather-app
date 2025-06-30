'use client';

import { useState } from 'react';
import { WeatherWidget as WeatherWidgetType } from '@/types/weather';
import { useWeatherData } from '@/hooks/useWeather';
import { getCurrentWeather, getForecast } from '@/services/weatherService';
import { transformCurrentWeather, transformHourlyForecast, transformDailyForecast } from '@/services/weatherDataTransformer';
import { getWeatherBackgroundColor } from '@/utils/weatherBackground';
import WeatherHeader from './WeatherHeader';
import CurrentWeather from './CurrentWeather';
import ForecastToggle from './ForecastToggle';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import LastUpdated from './LastUpdated';

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

  // Use weather-based background color
  const backgroundClass = getWeatherBackgroundColor(widget.weatherData.icon);

  return (
    <div className={`${backgroundClass} rounded-xl p-3 sm:p-4 text-white shadow-xl w-full max-w-[280px] sm:w-[280px] relative select-none`} data-testid="weather-widget">
      <WeatherHeader
        city={widget.weatherData.city}
        country={widget.weatherData.country}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onDelete={() => onDelete(widget.id)}
      />

      <CurrentWeather weatherData={widget.weatherData} />

      <ForecastToggle 
        showHourly={showHourly} 
        onToggle={setShowHourly} 
      />

      {showHourly ? (
        <HourlyForecast hourlyForecast={widget.hourlyForecast} />
      ) : (
        <DailyForecast
          dailyForecast={widget.dailyForecast}
          forecastDays={widget.forecastDays}
          onForecastDaysChange={handleForecastDaysChange}
        />
      )}

      <LastUpdated lastUpdated={widget.lastUpdated} />
    </div>
  );
}

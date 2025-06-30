'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WeatherWidget from '@/components/weather/WeatherWidget';
import SearchBar from '@/components/common/SearchBar';
import { WeatherWidget as WeatherWidgetType } from '@/types/weather';
import { getCurrentWeather, getForecast } from '@/services/weatherService';
import { transformCurrentWeather, transformHourlyForecast, transformDailyForecast } from '@/services/weatherDataTransformer';

export default function Home() {
  const [widgets, setWidgets] = useState<WeatherWidgetType[]>([]);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  // Load widgets from localStorage on mount
  useEffect(() => {
    const savedWidgets = localStorage.getItem('weatherWidgets');
    if (savedWidgets) {
      try {
        const parsedWidgets = JSON.parse(savedWidgets);
        // Convert lastUpdated strings back to Date objects
        const widgetsWithDates = parsedWidgets.map((widget: WeatherWidgetType) => ({
          ...widget,
          lastUpdated: new Date(widget.lastUpdated)
        }));
        setWidgets(widgetsWithDates);
      } catch (error) {
        console.error('Error parsing saved widgets:', error);
        setWidgets([]);
      }
    }
  }, []);

  // Save widgets to localStorage whenever widgets change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('weatherWidgets', JSON.stringify(widgets));
    }
  }, [widgets]);

  const addWidget = async (city: string) => {
    try {
      // Fetch weather data for the new widget
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city)
      ]);

      const weatherData = transformCurrentWeather(currentWeatherResponse);
      const hourlyForecast = transformHourlyForecast(forecastResponse);
      const dailyForecast = transformDailyForecast(forecastResponse);

      const newWidget: WeatherWidgetType = {
        id: Date.now().toString(),
        city: city, // Use the search city name directly
        weatherData,
        hourlyForecast,
        dailyForecast,
        lastUpdated: new Date(),
        forecastDays: 5,
      };

      setWidgets(prev => [...prev, newWidget]);
    } catch (error) {
      console.error('Error adding widget:', error);
      alert('Failed to add weather widget. Please try again.');
    }
  };

  const deleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
    // Update localStorage
    const updatedWidgets = widgets.filter(widget => widget.id !== widgetId);
    if (updatedWidgets.length === 0) {
      localStorage.removeItem('weatherWidgets');
    }
  };

  const updateWidget = (widgetId: string, updatedWidget: WeatherWidgetType) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId ? updatedWidget : widget
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
            Weather Dashboard
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6">
            Add cities to track their weather conditions
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <SearchBar onSelectLocation={addWidget} />
          </div>
        </div>

        {/* Widgets Grid */}
        {widgets.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 max-w-md mx-auto">
              <div className="text-4xl sm:text-5xl mb-4">🌤️</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                No Weather Widgets Yet
              </h2>
              <p className="text-white/80 text-sm sm:text-base">
                Search for a city above to add your first weather widget
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                layout
                drag
                dragMomentum={false}
                dragElastic={0}
                onDragStart={() => setDraggedWidget(widget.id)}
                onDragEnd={() => setDraggedWidget(null)}
                whileDrag={{ 
                  scale: 1.05, 
                  zIndex: 1000,
                  rotate: 2
                }}
                animate={{ 
                  scale: draggedWidget === widget.id ? 1.05 : 1,
                  rotate: draggedWidget === widget.id ? 2 : 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
                className="cursor-move"
              >
                <WeatherWidget
                  widget={widget}
                  onDelete={deleteWidget}
                  onUpdate={updateWidget}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-white/60 text-xs sm:text-sm">
            Weather data from OpenWeatherMap
          </p>
        </div>
      </div>
    </div>
  );
}

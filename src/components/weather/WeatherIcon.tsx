interface WeatherIconProps {
  iconCode: string;
  size?: 'sm' | 'md' | 'lg';
  testId?: string;
}

export default function WeatherIcon({ iconCode, size = 'md', testId = 'weather-icon' }: WeatherIconProps) {
  const getWeatherIcon = (code: string): string => {
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
    
    return iconMap[code] || '☀️';
  };

  const getSizeClass = (size: string): string => {
    const sizeMap = {
      'sm': 'text-base sm:text-lg',
      'md': 'text-3xl sm:text-4xl',
      'lg': 'text-4xl sm:text-5xl'
    };
    return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  };

  return (
    <div className={getSizeClass(size)} data-testid={testId}>
      {getWeatherIcon(iconCode)}
    </div>
  );
}

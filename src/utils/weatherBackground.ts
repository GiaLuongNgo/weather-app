export function getWeatherBackgroundColor(iconCode: string): string {
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
}

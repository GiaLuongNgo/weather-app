import { getWeatherBackgroundColor } from '../weatherBackground';

describe('getWeatherBackgroundColor', () => {
  it('returns correct background for clear day', () => {
    const result = getWeatherBackgroundColor('01d');
    expect(result).toBe('bg-gradient-to-bl from-yellow-300 via-sky-300 to-blue-400');
  });

  it('returns correct background for clear night', () => {
    const result = getWeatherBackgroundColor('01n');
    expect(result).toBe('bg-gradient-to-br from-indigo-800 via-purple-800 to-blue-900');
  });

  it('returns correct background for few clouds day', () => {
    const result = getWeatherBackgroundColor('02d');
    expect(result).toBe('bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400');
  });

  it('returns correct background for few clouds night', () => {
    const result = getWeatherBackgroundColor('02n');
    expect(result).toBe('bg-gradient-to-br from-slate-700 via-blue-800 to-indigo-800');
  });

  it('returns correct background for scattered clouds day', () => {
    const result = getWeatherBackgroundColor('03d');
    expect(result).toBe('bg-gradient-to-br from-gray-400 via-slate-400 to-blue-400');
  });

  it('returns correct background for scattered clouds night', () => {
    const result = getWeatherBackgroundColor('03n');
    expect(result).toBe('bg-gradient-to-br from-gray-700 via-slate-700 to-blue-800');
  });

  it('returns correct background for broken clouds day', () => {
    const result = getWeatherBackgroundColor('04d');
    expect(result).toBe('bg-gradient-to-br from-gray-500 via-slate-500 to-blue-500');
  });

  it('returns correct background for broken clouds night', () => {
    const result = getWeatherBackgroundColor('04n');
    expect(result).toBe('bg-gradient-to-br from-gray-800 via-slate-800 to-blue-900');
  });

  it('returns correct background for shower rain day', () => {
    const result = getWeatherBackgroundColor('09d');
    expect(result).toBe('bg-gradient-to-br from-blue-600 via-slate-600 to-gray-600');
  });

  it('returns correct background for shower rain night', () => {
    const result = getWeatherBackgroundColor('09n');
    expect(result).toBe('bg-gradient-to-br from-blue-800 via-slate-800 to-gray-800');
  });

  it('returns correct background for rain day', () => {
    const result = getWeatherBackgroundColor('10d');
    expect(result).toBe('bg-gradient-to-br from-blue-500 via-cyan-600 to-slate-600');
  });

  it('returns correct background for rain night', () => {
    const result = getWeatherBackgroundColor('10n');
    expect(result).toBe('bg-gradient-to-br from-blue-700 via-cyan-800 to-slate-800');
  });

  it('returns correct background for thunderstorm day', () => {
    const result = getWeatherBackgroundColor('11d');
    expect(result).toBe('bg-gradient-to-br from-purple-700 via-gray-700 to-slate-800');
  });

  it('returns correct background for thunderstorm night', () => {
    const result = getWeatherBackgroundColor('11n');
    expect(result).toBe('bg-gradient-to-br from-purple-900 via-gray-900 to-black');
  });

  it('returns correct background for snow day', () => {
    const result = getWeatherBackgroundColor('13d');
    expect(result).toBe('bg-gradient-to-br from-blue-200 via-slate-300 to-gray-400');
  });

  it('returns correct background for snow night', () => {
    const result = getWeatherBackgroundColor('13n');
    expect(result).toBe('bg-gradient-to-br from-blue-800 via-slate-800 to-gray-900');
  });

  it('returns correct background for mist day', () => {
    const result = getWeatherBackgroundColor('50d');
    expect(result).toBe('bg-gradient-to-br from-gray-300 via-slate-400 to-blue-400');
  });

  it('returns correct background for mist night', () => {
    const result = getWeatherBackgroundColor('50n');
    expect(result).toBe('bg-gradient-to-br from-gray-600 via-slate-700 to-blue-800');
  });

  it('returns default background for unknown icon code', () => {
    const result = getWeatherBackgroundColor('unknown');
    expect(result).toBe('bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500');
  });

  it('returns default background for empty string', () => {
    const result = getWeatherBackgroundColor('');
    expect(result).toBe('bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500');
  });

  it('handles all documented weather icon codes', () => {
    const allCodes = [
      '01d', '01n', '02d', '02n', '03d', '03n', '04d', '04n',
      '09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n',
      '50d', '50n'
    ];

    allCodes.forEach(code => {
      const result = getWeatherBackgroundColor(code);
      expect(result).toBeTruthy();
      expect(result).toContain('bg-gradient-to-');
      expect(result).not.toBe('bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500');
    });
  });
});

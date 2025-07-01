import { render, screen } from '@testing-library/react';
import WeatherIcon from '../WeatherIcon';

describe('WeatherIcon', () => {
  it('renders the correct icon for clear day', () => {
    render(<WeatherIcon iconCode="01d" />);
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('renders the correct icon for clear night', () => {
    render(<WeatherIcon iconCode="01n" />);
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('renders default icon for unknown code', () => {
    render(<WeatherIcon iconCode="unknown" />);
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('renders all weather icon types correctly', () => {
    const iconCodes = [
      { code: '02d', icon: '⛅' },
      { code: '03d', icon: '☁️' },
      { code: '09d', icon: '🌧️' },
      { code: '10d', icon: '🌦️' },
      { code: '11d', icon: '⛈️' },
      { code: '13d', icon: '❄️' },
      { code: '50d', icon: '💨' }
    ];

    iconCodes.forEach(({ code, icon }) => {
      const { rerender } = render(<WeatherIcon iconCode={code} />);
      expect(screen.getByText(icon)).toBeInTheDocument();
      rerender(<div />);
    });
  });
});

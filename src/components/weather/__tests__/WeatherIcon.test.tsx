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

  it('applies correct size classes', () => {
    const { container: smallContainer } = render(<WeatherIcon iconCode="01d" size="sm" />);
    expect(smallContainer.firstChild).toHaveClass('text-base sm:text-lg');

    const { container: mediumContainer } = render(<WeatherIcon iconCode="01d" size="md" />);
    expect(mediumContainer.firstChild).toHaveClass('text-3xl sm:text-4xl');

    const { container: largeContainer } = render(<WeatherIcon iconCode="01d" size="lg" />);
    expect(largeContainer.firstChild).toHaveClass('text-4xl sm:text-5xl');
  });

  it('defaults to medium size when no size is provided', () => {
    const { container } = render(<WeatherIcon iconCode="01d" />);
    expect(container.firstChild).toHaveClass('text-3xl sm:text-4xl');
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

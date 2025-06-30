interface ForecastToggleProps {
  showHourly: boolean;
  onToggle: (showHourly: boolean) => void;
}

export default function ForecastToggle({ showHourly, onToggle }: ForecastToggleProps) {
  return (
    <div className="flex items-center justify-center mb-2 sm:mb-3" data-testid="forecast-toggle">
      <div className="bg-white/20 rounded-full p-0.5 flex">
        <button
          onClick={() => onToggle(false)}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            !showHourly ? 'bg-white text-blue-600' : 'text-white'
          }`}
          aria-label="Show daily forecast"
          data-testid="daily-toggle"
        >
          Daily
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            showHourly ? 'bg-white text-blue-600' : 'text-white'
          }`}
          aria-label="Show hourly forecast"
          data-testid="hourly-toggle"
        >
          Hourly
        </button>
      </div>
    </div>
  );
}

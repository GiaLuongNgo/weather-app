import { RefreshCw, X } from 'lucide-react';

interface WeatherHeaderProps {
  city: string;
  country: string;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onDelete: () => void;
}

export default function WeatherHeader({ 
  city, 
  country, 
  isLoading, 
  isRefreshing, 
  onRefresh, 
  onDelete 
}: WeatherHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4" data-testid="weather-header">
      <div className="flex-1 min-w-0">
        <h2 className="text-base sm:text-lg font-bold truncate">{city}</h2>
        <p className="text-white/80 text-xs truncate">{country}</p>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <button
          onClick={onRefresh}
          disabled={isLoading || isRefreshing}
          className="p-1 sm:p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Refresh weather data"
          data-testid="refresh-button"
        >
          <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={onDelete}
          className="p-1 sm:p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer"
          aria-label="Delete widget"
          data-testid="delete-button"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useLocationSearch } from '@/hooks/useWeather';
import { GeoLocation } from '@/types/weather';

interface SearchBarProps {
  onSelectLocation: (city: string) => void;
}

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: locations = [], isLoading } = useLocationSearch(debouncedQuery);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleLocationSelect = (location: GeoLocation) => {
    onSelectLocation(location.name); // Use just the city name for API calls
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          placeholder="Enter city name (e.g., London, Tokyo, New York)..."
          className="w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white
                   placeholder-gray-500 text-gray-800 shadow-lg"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : locations.length > 0 ? (
            <ul className="py-2">
              {locations.map((location) => (
                <li key={`${location.lat}-${location.lon}`}>
                  <button
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 
                             flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500">
                        {location.state ? `${location.state}, ` : ''}{location.country}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No locations found for &quot;{debouncedQuery}&quot;</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

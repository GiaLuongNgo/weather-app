import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBar from '../SearchBar';
import * as weatherService from '../../../services/weatherService';

process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key';

jest.mock('../../../services/weatherService');

const mockedWeatherService = weatherService as jest.Mocked<typeof weatherService>;

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return { TestWrapper, queryClient };
};

describe('SearchBar', () => {
  const mockOnSelectLocation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search bar component', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <SearchBar onSelectLocation={mockOnSelectLocation} />
      </TestWrapper>
    );

    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('shows clear button when input has value', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <SearchBar onSelectLocation={mockOnSelectLocation} />
      </TestWrapper>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'London' } });

    expect(screen.getByTestId('clear-search-button')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <SearchBar onSelectLocation={mockOnSelectLocation} />
      </TestWrapper>
    );

    const input = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'London' } });
    
    const clearButton = screen.getByTestId('clear-search-button');
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
  });

  it('shows suggestions dropdown when typing', async () => {
    const mockLocations = [
      { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
    ];

    mockedWeatherService.searchLocations.mockResolvedValueOnce(mockLocations);

    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <SearchBar onSelectLocation={mockOnSelectLocation} />
      </TestWrapper>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Lon' } });

    await waitFor(() => {
      expect(screen.getByTestId('suggestions-dropdown')).toBeInTheDocument();
    });
  });

  it('shows loading state while searching', async () => {
    mockedWeatherService.searchLocations.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 1000))
    );

    const { TestWrapper } = createTestWrapper();

    render(
      <TestWrapper>
        <SearchBar onSelectLocation={mockOnSelectLocation} />
      </TestWrapper>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Lon' } });

    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });
  });
});

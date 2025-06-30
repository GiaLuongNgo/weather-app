import { render, screen } from '@testing-library/react';
import LastUpdated from '../LastUpdated';

describe('LastUpdated', () => {
  it('renders last updated date and time correctly', () => {
    const testDate = new Date('2023-12-15T14:30:45');
    render(<LastUpdated lastUpdated={testDate} />);
    
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    expect(screen.getByText(/Fri, Dec 15/)).toBeInTheDocument();
    expect(screen.getByText(/2:30:45 PM/i)).toBeInTheDocument();
  });

  it('formats date correctly for different date', () => {
    const testDate = new Date('2024-01-01T09:15:30');
    render(<LastUpdated lastUpdated={testDate} />);
    
    expect(screen.getByText(/Mon, Jan 1/)).toBeInTheDocument();
    expect(screen.getByText(/9:15:30 AM/i)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const testDate = new Date('2023-12-15T14:30:45');
    const { container } = render(<LastUpdated lastUpdated={testDate} />);
    
    const element = container.firstChild;
    expect(element).toHaveClass('text-xs text-white/60 text-center mt-2 sm:mt-3');
  });

  it('handles edge case dates correctly', () => {
    const testDate = new Date('2023-12-31T23:59:59');
    render(<LastUpdated lastUpdated={testDate} />);
    
    expect(screen.getByText(/Sun, Dec 31/)).toBeInTheDocument();
    expect(screen.getByText(/11:59:59 PM/i)).toBeInTheDocument();
  });
});

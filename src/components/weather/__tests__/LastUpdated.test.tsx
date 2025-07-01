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
});

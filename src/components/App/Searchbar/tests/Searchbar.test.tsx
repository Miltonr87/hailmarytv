/* eslint-disable @typescript-eslint/no-require-imports */
// src/components/App/Searchbar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ✅ mock BEFORE importing Searchbar (prevents import.meta.env crash)
jest.mock('@/features/videos', () => ({
  fetchVideosBySearch: jest.fn(() => () => Promise.resolve()),
}));

jest.mock('@/app/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
  Loader2: () => <svg data-testid="loader-icon" />,
}));

import Searchbar from '../index';

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

describe('Searchbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/app/hooks').useAppDispatch as jest.Mock).mockReturnValue(
      mockDispatch
    );
    (require('@/app/hooks').useAppSelector as jest.Mock).mockImplementation(
      mockSelector
    );
  });

  it('renders input and search button', () => {
    mockSelector.mockReturnValue({ searchHistory: [] });
    render(<Searchbar />);

    expect(
      screen.getByPlaceholderText(/Search NFL highlights/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    mockSelector.mockReturnValue({ searchHistory: [] });
    render(<Searchbar />);

    const input = screen.getByPlaceholderText(/Search NFL highlights/i);
    fireEvent.change(input, { target: { value: 'Patriots' } });

    expect(input).toHaveValue('Patriots');
  });

  it('shows search history when focused', () => {
    mockSelector.mockReturnValue({ searchHistory: ['Chiefs', 'Eagles'] });
    render(<Searchbar />);

    const input = screen.getByPlaceholderText(/Search NFL highlights/i);
    fireEvent.focus(input);

    expect(screen.getByText('Chiefs')).toBeInTheDocument();
    expect(screen.getByText('Eagles')).toBeInTheDocument();
  });

  it('dispatches search when clicking search button', async () => {
    mockSelector.mockReturnValue({ searchHistory: [] });
    render(<Searchbar />);

    const input = screen.getByPlaceholderText(/Search NFL highlights/i);
    fireEvent.change(input, { target: { value: 'Giants' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('dispatches search when selecting from history', async () => {
    mockSelector.mockReturnValue({ searchHistory: ['Raiders'] });
    render(<Searchbar />);

    const input = screen.getByPlaceholderText(/Search NFL highlights/i);
    fireEvent.focus(input);

    const historyItem = screen.getByText('Raiders');
    fireEvent.click(historyItem);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});

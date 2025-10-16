import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const { useLocation } = jest.requireMock('react-router-dom');
let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('NotFound Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 404 page content correctly', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/invalid-route' });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Oops! Page not found/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Return to Home/i })
    ).toHaveAttribute('href', '/');
  });

  it('logs an error with the invalid path', () => {
    const localMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/fake-url' });
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(localMock).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/fake-url'
    );

    localMock.mockRestore();
  });
});

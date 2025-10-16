/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent } from '@testing-library/react';
import SecondaryNav from '../index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@/components/ui/dropdown-menu', () => {
  return {
    DropdownMenu: ({ children, open, onOpenChange }: any) => (
      <div
        data-testid="dropdown-menu"
        onClick={() => onOpenChange && onOpenChange(!open)}
      >
        {children}
      </div>
    ),
    DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
    DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
    DropdownMenuItem: ({ children, onClick }: any) => (
      <div data-testid="menu-item" onClick={onClick}>
        {children}
      </div>
    ),
  };
});

jest.mock('lucide-react', () => ({
  ChevronDown: () => <svg data-testid="chevron-down" />,
}));
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/constants/nfl_teams', () => ({
  NFL_TEAMS: [
    { name: 'Chicago Bears', logoUrl: '/bears.png' },
    { name: 'Green Bay Packers', logoUrl: '/packers.png' },
  ],
}));

describe('SecondaryNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Home button', () => {
    render(<SecondaryNav />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it('navigates to home when clicking Home button', () => {
    render(<SecondaryNav />);
    fireEvent.click(screen.getByText(/Home/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders Teams dropdown trigger', () => {
    render(<SecondaryNav />);
    expect(screen.getByText(/Teams/i)).toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('renders team items after opening dropdown', () => {
    render(<SecondaryNav />);
    const dropdown = screen.getByTestId('dropdown-menu');
    fireEvent.click(dropdown);
    expect(screen.getByText('Chicago Bears')).toBeInTheDocument();
    expect(screen.getByText('Green Bay Packers')).toBeInTheDocument();
  });

  it('navigates when selecting a team', () => {
    render(<SecondaryNav />);
    const dropdown = screen.getByTestId('dropdown-menu');
    fireEvent.click(dropdown);
    const teamItem = screen.getAllByTestId('menu-item')[0];
    fireEvent.click(teamItem);
    expect(mockNavigate).toHaveBeenCalledWith('/team/chicago-bears');
  });
});

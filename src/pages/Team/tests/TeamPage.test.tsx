import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TeamPage from '../index';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTeamVideos } from '@/features/videos';
import { NFL_TEAMS } from '@/constants/nfl_teams';
import type { RootState } from '@/app/store';

jest.mock('@/constants/nfl_teams', () => ({
  YOUTUBE_API_KEY: 'mock-api-key',
  NFL_TEAMS: [
    {
      name: 'Mock Team',
      searchQuery: 'Mock Team NFL official',
      color: 'hsl(210, 100%, 40%)',
      logoUrl: 'mock-logo.png',
    },
  ],
}));

jest.mock('@/features/videos/videosThunks', () => ({
  __esModule: true,
  fetchTeamVideos: jest.fn(() => ({ type: 'mock/fetchTeamVideos' })),
}));

jest.mock('@/components/App/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('@/components/App/SecondaryNav', () => () => (
  <div data-testid="secondary-nav" />
));
jest.mock('@/components/Video/VideoCard', () => ({
  __esModule: true,
  default: ({ video }: { video: { id: string; title: string } }) => (
    <div data-testid="video-card">{video.title}</div>
  ),
}));

jest.mock('@/app/hooks');
jest.mock('@/features/videos');

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

const { useParams } = jest.requireMock('react-router-dom');

const renderWithRoute = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/team/:teamName" element={<TeamPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('TeamPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('renders "Team Not Found" when no valid team is found', () => {
    (useParams as jest.Mock).mockReturnValue({ teamName: 'invalid-team' });
    (useAppSelector as jest.Mock).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({ videos: { teamVideos: {}, loading: false } } as RootState)
    );
    renderWithRoute('/team/invalid-team');
    expect(screen.getByText(/Team Not Found/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Go Home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('dispatches fetchTeamVideos when team exists but has no videos', () => {
    const team = NFL_TEAMS[0];
    const teamSlug = team.name.toLowerCase().replace(/\s+/g, '-');
    (useParams as jest.Mock).mockReturnValue({ teamName: teamSlug });
    (useAppSelector as jest.Mock).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({ videos: { teamVideos: {}, loading: false } } as RootState)
    );
    renderWithRoute(`/team/${teamSlug}`);
    expect(mockDispatch).toHaveBeenCalledWith(
      fetchTeamVideos({
        teamName: team.name,
        searchQuery: team.searchQuery,
      })
    );
  });

  it('shows loading skeletons when loading is true and no videos', () => {
    const team = NFL_TEAMS[0];
    const teamSlug = team.name.toLowerCase().replace(/\s+/g, '-');
    (useParams as jest.Mock).mockReturnValue({ teamName: teamSlug });
    (useAppSelector as jest.Mock).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({ videos: { teamVideos: {}, loading: true } } as RootState)
    );
    renderWithRoute(`/team/${teamSlug}`);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0);
  });

  it('renders video cards when videos exist', () => {
    const team = NFL_TEAMS[0];
    const teamSlug = team.name.toLowerCase().replace(/\s+/g, '-');
    (useParams as jest.Mock).mockReturnValue({ teamName: teamSlug });
    (useAppSelector as jest.Mock).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          videos: {
            teamVideos: {
              [team.name]: [
                { id: '1', title: 'Highlight 1' },
                { id: '2', title: 'Highlight 2' },
              ],
            },
            loading: false,
          },
        } as RootState)
    );
    renderWithRoute(`/team/${teamSlug}`);
    expect(screen.getByText(team.name)).toBeInTheDocument();
    expect(screen.getAllByTestId('video-card')).toHaveLength(2);
  });
});

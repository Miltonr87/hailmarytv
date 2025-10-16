/* eslint-disable @typescript-eslint/no-require-imports */
// src/components/Video/__tests__/NFLVideos.test.tsx
import { render, screen } from '@testing-library/react';
import NFLVideos from '../index';

jest.mock('@/app/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/features/videos', () => ({
  fetchFeaturedVideos: jest.fn(() => () => Promise.resolve()),
}));

jest.mock('@/components/Video/VideoCard', () => ({
  __esModule: true,
  default: ({ video }: any) => (
    <div data-testid="video-card">{video.title}</div>
  ),
}));

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

describe('NFLVideos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/app/hooks').useAppDispatch as jest.Mock).mockReturnValue(
      mockDispatch
    );
    (require('@/app/hooks').useAppSelector as jest.Mock).mockImplementation(
      mockSelector
    );
  });

  it('dispatches fetchFeaturedVideos when featured is empty', () => {
    mockSelector.mockReturnValue({ featured: [], loading: false, error: null });
    render(<NFLVideos />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renders loading message when loading is true', () => {
    mockSelector.mockReturnValue({ featured: [], loading: true, error: null });
    render(<NFLVideos />);
    expect(screen.getByText(/Loading videos/i)).toBeInTheDocument();
  });

  it('renders error message when error exists', () => {
    mockSelector.mockReturnValue({
      featured: [],
      loading: false,
      error: 'Failed to load videos',
    });
    render(<NFLVideos />);
    expect(screen.getByText(/Failed to load videos/i)).toBeInTheDocument();
  });

  it('renders list of videos when featured has data', () => {
    mockSelector.mockReturnValue({
      featured: [
        { id: '1', title: 'Week 1 Highlights', thumbnail: '/1.jpg' },
        { id: '2', title: 'Top 10 Plays', thumbnail: '/2.jpg' },
      ],
      loading: false,
      error: null,
    });
    render(<NFLVideos />);
    expect(screen.getByText(/🏈 Videos/i)).toBeInTheDocument();
    const cards = screen.getAllByTestId('video-card');
    expect(cards.length).toBe(2);
    expect(cards[0]).toHaveTextContent('Week 1 Highlights');
  });
});

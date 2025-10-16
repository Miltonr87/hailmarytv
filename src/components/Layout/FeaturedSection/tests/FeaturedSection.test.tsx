/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent } from '@testing-library/react';
import FeaturedSection from '../index';

beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  (global as any).IntersectionObserver = MockIntersectionObserver;
});

jest.mock('../index', () => {
  const original = jest.requireActual('../index');
  return {
    __esModule: true,
    ...original,
    default: original.default,
    LazyYouTubePlayer: ({ videoId, title }: any) => (
      <iframe
        title={title}
        src={`https://youtube.com/embed/${videoId}`}
        data-testid="mock-iframe"
      />
    ),
  };
});

jest.mock('@/app/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: () => (props: any) => {
        const cleanProps = { ...props };
        delete cleanProps.whileHover;
        delete cleanProps.initial;
        delete cleanProps.animate;
        delete cleanProps.exit;
        delete cleanProps.transition;
        return <div {...cleanProps}>{props.children}</div>;
      },
    }
  ),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
  Play: () => <svg data-testid="play-icon" />,
}));

jest.mock('@/features/videos', () => ({
  fetchFeaturedVideos: jest.fn(() => () => Promise.resolve()),
}));

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

describe('FeaturedSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/app/hooks').useAppDispatch as jest.Mock).mockReturnValue(
      mockDispatch
    );
    (require('@/app/hooks').useAppSelector as jest.Mock).mockImplementation(
      mockSelector
    );
  });

  it('dispatches fetchFeaturedVideos on mount', () => {
    mockSelector.mockReturnValue({ featured: [], loading: false });
    render(<FeaturedSection />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renders loading skeletons when loading and no featured videos', () => {
    mockSelector.mockReturnValue({ featured: [], loading: true });
    render(<FeaturedSection />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders the featured video grid', () => {
    mockSelector.mockReturnValue({
      featured: [
        {
          id: 'abc123',
          title: 'NFL Highlights Week 1',
          thumbnail: '/thumb1.jpg',
          channelTitle: 'NFL',
        },
        {
          id: 'xyz456',
          title: 'Top 10 Touchdowns',
          thumbnail: '/thumb2.jpg',
          channelTitle: 'NFL Network',
        },
      ],
      loading: false,
    });
    render(<FeaturedSection />);
    expect(screen.getByText(/NFL Highlights Week 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Top 10 Touchdowns/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('play-icon').length).toBeGreaterThan(0);
  });

  it('toggles embedded video on click', () => {
    mockSelector.mockReturnValue({
      featured: [
        {
          id: 'abc123',
          title: 'NFL Highlights Week 1',
          thumbnail: '/thumb1.jpg',
          channelTitle: 'NFL',
        },
      ],
      loading: false,
    });
    render(<FeaturedSection />);
    const thumb = screen.getByAltText('NFL Highlights Week 1');
    fireEvent.click(thumb);
  });
});

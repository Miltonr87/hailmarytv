/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen } from '@testing-library/react';
import MoreVideosSection from '../index';

beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  (global as any).IntersectionObserver = MockIntersectionObserver;
});

jest.mock('@/app/hooks', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: () => (props: any) => {
        const cleanProps = { ...props };
        delete cleanProps.initial;
        delete cleanProps.animate;
        delete cleanProps.exit;
        delete cleanProps.transition;
        delete cleanProps.variants;
        delete cleanProps.whileHover;
        return <div {...cleanProps}>{props.children}</div>;
      },
    }
  ),
}));

jest.mock('@/components/Video/VideoCard', () => ({
  __esModule: true,
  default: ({ video }: any) => (
    <div data-testid="video-card">{video.title}</div>
  ),
}));

const mockSelector = jest.fn();

describe('MoreVideosSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/app/hooks').useAppSelector as jest.Mock).mockImplementation(
      mockSelector
    );
  });

  it('renders loading skeletons when loading and no featured videos', () => {
    mockSelector.mockReturnValue({ featured: [], loading: true });

    render(<MoreVideosSection />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders section title when not loading', () => {
    mockSelector.mockReturnValue({
      featured: [
        { id: '1', title: 'Game 1', thumbnail: '/1.jpg', channelTitle: 'NFL' },
        { id: '2', title: 'Game 2', thumbnail: '/2.jpg', channelTitle: 'NFL' },
      ],
      loading: false,
    });

    render(<MoreVideosSection />);
    expect(screen.getByText(/More Videos/i)).toBeInTheDocument();
  });

  it('renders video cards when visible', () => {
    mockSelector.mockReturnValue({
      featured: Array.from({ length: 8 }).map((_, i) => ({
        id: `${i}`,
        title: `Video ${i}`,
        thumbnail: `/thumb${i}.jpg`,
        channelTitle: 'NFL',
      })),
      loading: false,
    });

    render(<MoreVideosSection />);
    const cards = screen.getAllByTestId('video-card');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0]).toHaveTextContent('Video 4');
  });
});

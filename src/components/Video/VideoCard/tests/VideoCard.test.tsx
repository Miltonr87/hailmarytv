import { render, screen, fireEvent } from '@testing-library/react';
import VideoCard from '../index';
import type { Video } from '@/features/videos';

beforeAll(() => {
  class MockIntersectionObserver {
    constructor(private callback: (entries: any[]) => void) {
      setTimeout(() => this.callback([{ isIntersecting: true }]), 0);
    }
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  (global as any).IntersectionObserver = MockIntersectionObserver;
});

jest.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 days ago',
}));

jest.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: () => (props: any) => {
        const cleanProps = { ...props };
        delete cleanProps.initial;
        delete cleanProps.animate;
        delete cleanProps.transition;
        delete cleanProps.whileHover;
        delete cleanProps.whileInView;
        delete cleanProps.viewport;
        return <div {...cleanProps}>{props.children}</div>;
      },
    }
  ),
}));

jest.mock('lucide-react', () => ({
  Play: () => <svg data-testid="play-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
}));

const mockVideo: Video = {
  id: 'abc123',
  title: 'Epic NFL Game',
  description: 'Amazing touchdowns and plays',
  thumbnail: '/thumb.jpg',
  channelTitle: 'NFL Network',
  channelId: 'nfl123',
  publishedAt: new Date('2024-12-25').toISOString(),
};

describe('VideoCard', () => {
  it('renders video title, channel, and time distance', () => {
    render(<VideoCard video={mockVideo} />);

    expect(screen.getByText('Epic NFL Game')).toBeInTheDocument();
    expect(screen.getByText('NFL Network')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
  });

  it('renders thumbnail image', () => {
    render(<VideoCard video={mockVideo} />);
    const img = screen.getByAltText('Epic NFL Game');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/thumb.jpg');
  });

  it('switches to LazyYouTubePlayer on click', async () => {
    render(<VideoCard video={mockVideo} />);
    const card = screen.getByText('Epic NFL Game').closest('div');
    expect(card).toBeTruthy();
    fireEvent.click(card!);
    const iframe = await screen.findByTitle('Epic NFL Game');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining('https://www.youtube.com/embed/abc123')
    );
  });
});

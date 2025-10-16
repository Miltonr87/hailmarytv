import { render, screen } from '@testing-library/react';
import VideoPlayer from '../index';

jest.mock('react-youtube', () => {
  return ({ videoId, opts }: any) => (
    <div
      data-testid="youtube-mock"
      data-video-id={videoId}
      data-autoplay={opts?.playerVars?.autoplay}
      data-width={opts?.width}
      data-height={opts?.height}
    />
  );
});

describe('VideoPlayer', () => {
  it('renders YouTube component with correct props', () => {
    render(<VideoPlayer videoId="abc123" />);
    const youtube = screen.getByTestId('youtube-mock');
    expect(youtube).toBeInTheDocument();
    expect(youtube).toHaveAttribute('data-video-id', 'abc123');
    expect(youtube).toHaveAttribute('data-width', '100%');
    expect(youtube).toHaveAttribute('data-height', '360');
    expect(youtube).toHaveAttribute('data-autoplay', '1');
  });

  it('renders inside a styled container', () => {
    const { container } = render(<VideoPlayer videoId="xyz789" />);
    const wrapper = container.querySelector(
      '.aspect-video.rounded-xl.overflow-hidden.shadow-lg'
    );
    expect(wrapper).toBeInTheDocument();
  });
});

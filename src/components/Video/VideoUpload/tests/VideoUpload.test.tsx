import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoUpload from '../index';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props} data-testid="upload-btn">
      {children}
    </button>
  ),
}));
jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} data-testid="file-input" />,
}));

describe('VideoUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockToken = 'mock-access-token';
  const mockFile = new File(['test'], 'video.mp4', { type: 'video/mp4' });

  it('renders file input and button', () => {
    render(<VideoUpload accessToken={mockToken} />);
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('upload-btn')).toBeInTheDocument();
  });

  it('enables upload button after file selection', () => {
    render(<VideoUpload accessToken={mockToken} />);
    const input = screen.getByTestId('file-input');
    const button = screen.getByTestId('upload-btn');
    expect(button).toBeDisabled();
    fireEvent.change(input, { target: { files: [mockFile] } });
    expect(button).not.toBeDisabled();
  });

  it('handles successful upload', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ id: 'video123' }),
    });

    render(<VideoUpload accessToken={mockToken} />);
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [mockFile] } });

    const button = screen.getByTestId('upload-btn');
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText(/✅ Uploaded!/i)).toBeInTheDocument()
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://www.googleapis.com/upload/youtube/v3/videos'
      ),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
      })
    );
  });

  it('handles upload failure with API error', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ error: { message: 'Quota exceeded' } }),
    });

    render(<VideoUpload accessToken={mockToken} />);
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [mockFile] } });
    fireEvent.click(screen.getByTestId('upload-btn'));

    await waitFor(() =>
      expect(
        screen.getByText(/❌ Upload failed: Quota exceeded/i)
      ).toBeInTheDocument()
    );
  });

  it('handles network error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<VideoUpload accessToken={mockToken} />);
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [mockFile] } });
    fireEvent.click(screen.getByTestId('upload-btn'));

    await waitFor(() =>
      expect(screen.getByText(/❌ Upload failed/i)).toBeInTheDocument()
    );
  });
});

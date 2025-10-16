import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Navbar from '../index';

jest.mock('@/components/App/Searchbar', () => () => (
  <div data-testid="searchbar" />
));
jest.mock('@/components/ui/modal', () => ({
  Modal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="modal">Modal Open</div> : null,
}));
jest.mock('@/components/Video/VideoUpload', () => () => (
  <div data-testid="video-upload">Video Upload</div>
));
jest.mock('@/features/googleAuth', () => ({
  googleSignIn: jest.fn(() => () => Promise.resolve()),
  googleSignOut: jest.fn(() => () => Promise.resolve()),
}));
jest.mock('@/hooks/useToast', () => ({
  toast: jest.fn(),
}));

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderNavbar = (state: any) => {
    const store = mockStore({ googleAuth: state });
    store.dispatch = mockDispatch;
    return render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );
  };

  it('renders logo, title, and searchbar', () => {
    renderNavbar({ user: null, loading: false });

    expect(screen.getByText(/HailMaryTV/i)).toBeInTheDocument();
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    renderNavbar({ user: null, loading: false });

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('shows "Signing in..." when loading is true', () => {
    renderNavbar({ user: null, loading: true });

    expect(screen.getByText(/Signing in.../i)).toBeInTheDocument();
  });

  it('renders user info and logout when authenticated', () => {
    renderNavbar({
      user: { name: 'Tom Brady', image: 'mock.jpg', access_token: '123' },
      loading: false,
    });

    expect(screen.getByText('Tom')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByAltText('Tom Brady')).toBeInTheDocument();
  });

  it('opens upload modal when clicking upload button', () => {
    renderNavbar({
      user: { name: 'Tom Brady', image: null, access_token: '123' },
      loading: false,
    });

    const uploadButton = screen.getAllByRole('button')[0];
    fireEvent.click(uploadButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});

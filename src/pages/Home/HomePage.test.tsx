import { render, screen } from '@testing-library/react';
import HomePage from './index';

jest.mock('@/components/App/Navbar', () => () => (
  <div data-testid="navbar">Navbar</div>
));
jest.mock('@/components/App/SecondaryNav', () => () => (
  <div data-testid="secondary-nav">SecondaryNav</div>
));
jest.mock('@/components/Layout/FeaturedSection', () => () => (
  <div data-testid="featured-section">FeaturedSection</div>
));
jest.mock('@/components/Layout/MoreVideosSection', () => () => (
  <div data-testid="more-videos-section">MoreVideosSection</div>
));
jest.mock('@/components/App/Footer', () => () => (
  <div data-testid="footer">Footer</div>
));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the home layout correctly with all sections', () => {
    render(<HomePage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('secondary-nav')).toBeInTheDocument();
    expect(screen.getByTestId('featured-section')).toBeInTheDocument();
    expect(screen.getByTestId('more-videos-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the layout structure with correct main container', () => {
    render(<HomePage />);
    const main = screen.getByRole('main', { hidden: true });
    expect(main).toBeInTheDocument();
  });
});

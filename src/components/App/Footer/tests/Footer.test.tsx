// src/components/App/Footer.test.tsx
import { render, screen } from '@testing-library/react';
import Footer from '../index';

describe('Footer', () => {
  it('renders the project name and author link', () => {
    render(<Footer />);

    const projectText = screen.getByText(/HailMaryTV/i);
    expect(projectText).toBeInTheDocument();

    const authorLink = screen.getByRole('link', {
      name: /Milton Rodrigues – 2025/i,
    });
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute('href', 'https://miltonr87.vercel.app/');
    expect(authorLink).toHaveAttribute('target', '_blank');
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the disclaimer text', () => {
    render(<Footer />);

    const disclaimer = screen.getByText(
      /All NFL highlights and clips are property of their respective rights holders/i
    );
    expect(disclaimer).toBeInTheDocument();
  });
});

/**
 * Unit Tests: Footer Component
 * 
 * Tests footer component
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer Component', () => {
  test('component renders without errors', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeTruthy();
  });

  test('copyright text is present with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    const copyright = screen.getByText(new RegExp(`© ${currentYear} Chris Cole`));
    expect(copyright).toBeTruthy();
  });

  test('tech stack credit is present', () => {
    render(<Footer />);
    expect(screen.getByText(/Built with Next.js, GSAP, Framer Motion/)).toBeTruthy();
  });

  test('design credit/acknowledgment is present', () => {
    render(<Footer />);
    expect(screen.getByText(/Design inspired by Chris Cole/)).toBeTruthy();
    expect(screen.getByText(/hellochriscole.webflow.io/)).toBeTruthy();
  });

  test('no Webflow badge text present', () => {
    const { container } = render(<Footer />);
    const footerText = container.textContent || '';
    expect(footerText).not.toContain('Webflow');
    expect(footerText).not.toContain('Made in Webflow');
  });

  test('footer has centered layout classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const innerDiv = container.querySelector('.text-center');
    expect(innerDiv).toBeTruthy();
  });

  test('monospace font is used for technical details', () => {
    const { container } = render(<Footer />);
    const monoElements = container.querySelectorAll('.font-mono');
    expect(monoElements.length).toBeGreaterThan(0);
  });
});


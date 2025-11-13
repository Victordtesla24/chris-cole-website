/**
 * Unit Tests: ContactSection Component
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import ContactSection from '@/components/sections/ContactSection';

// Mock scroll trigger
jest.mock('@/animations/scrollTrigger', () => ({
  useScrollTrigger: () => ({
    controls: 'visible',
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('ContactSection Component', () => {
  test('component renders without errors', () => {
    render(<ContactSection />);
    expect(screen.getByText('CONTACT')).toBeTruthy();
  });

  test('section has id="contact"', () => {
    const { container } = render(<ContactSection />);
    const section = container.querySelector('section#contact');
    expect(section).toBeTruthy();
  });

  test('email address is displayed', () => {
    render(<ContactSection />);
    const email = screen.getByText('hello@chriscole.com');
    expect(email).toBeTruthy();
  });

  test('copy email button is present', () => {
    render(<ContactSection />);
    const button = screen.getByText('Copy Email');
    expect(button).toBeTruthy();
  });

  test('section heading is h2', () => {
    const { container } = render(<ContactSection />);
    const heading = container.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('CONTACT');
  });
});


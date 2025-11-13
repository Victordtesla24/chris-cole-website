/**
 * Unit Tests: AboutSection Component
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import AboutSection from '@/components/sections/AboutSection';

// Mock scroll trigger
jest.mock('@/animations/scrollTrigger', () => ({
  useScrollTrigger: () => ({
    controls: 'visible',
  }),
}));

describe('AboutSection Component', () => {
  test('component renders without errors', () => {
    render(<AboutSection />);
    expect(screen.getByText('ABOUT')).toBeTruthy();
  });

  test('section has id="about"', () => {
    const { container } = render(<AboutSection />);
    const section = container.querySelector('section#about');
    expect(section).toBeTruthy();
  });

  test('section heading is h2', () => {
    const { container } = render(<AboutSection />);
    const heading = container.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('ABOUT');
  });

  test('bio paragraphs are present', () => {
    render(<AboutSection />);
    const bioText = screen.getByText(/creative director/i);
    expect(bioText).toBeTruthy();
  });
});


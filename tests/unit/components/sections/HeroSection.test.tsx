/**
 * Unit Tests: HeroSection Component
 * 
 * Tests hero section component logic
 * Following testing-strategy.md requirements
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/sections/HeroSection';

// Mock GSAP
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    to: jest.fn(() => ({
      kill: jest.fn(),
    })),
  },
}));

describe('HeroSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('component renders without errors', () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section#home');
    expect(section).toBeTruthy();
  });

  test('section has id="home"', () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section#home');
    expect(section).toBeTruthy();
  });

  test('headline text matches exactly', () => {
    render(<HeroSection />);
    const headline = screen.getByText(/I'VE WORKED IN TECH AND CPG FOR 6 YEARS/i);
    expect(headline).toBeTruthy();
  });

  test('bordered container is present', () => {
    const { container } = render(<HeroSection />);
    const borderedContainer = container.querySelector('.border-2.border-white');
    expect(borderedContainer).toBeTruthy();
  });

  test('specialties intro text is present', () => {
    render(<HeroSection />);
    const introText = screen.getByText(/I DO A BIT OF EVERYTHING/i);
    expect(introText).toBeTruthy();
  });

  test('all 5 specialty icons are present', () => {
    render(<HeroSection />);
    expect(screen.getByText('WEB')).toBeTruthy();
    expect(screen.getByText('BRANDING')).toBeTruthy();
    expect(screen.getByText('PRODUCT')).toBeTruthy();
    expect(screen.getByText('PACKAGING')).toBeTruthy();
    expect(screen.getByText(/COCKTAILS/i)).toBeTruthy();
  });

  test('satellite icon has correct data attributes', () => {
    const { container } = render(<HeroSection />);
    const satellite = container.querySelector('[data-w-id="c24b678f-7639-7dd0-241b-f552bb310982"]');
    expect(satellite).toBeTruthy();
  });

  test('specialties line divider is present', () => {
    const { container } = render(<HeroSection />);
    const divider = container.querySelector('.specialties-line');
    expect(divider).toBeTruthy();
  });
});


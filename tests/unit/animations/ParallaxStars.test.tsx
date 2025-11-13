/**
 * Unit Tests: ParallaxStars Component
 * 
 * Tests background starfield with parallax scroll effect
 * Following testing-strategy.md requirements
 */

import React from 'react';
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import ParallaxStars from '@/components/animations/ParallaxStars';

// Mock GSAP and ScrollTrigger
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  set: jest.fn(),
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(() => ({
      kill: jest.fn(),
    })),
    getAll: jest.fn(() => []),
  },
}));

describe('ParallaxStars Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('component renders without errors', () => {
    const { container } = render(<ParallaxStars />);
    expect(container).toBeTruthy();
  });

  test('container has fixed position', () => {
    const { container } = render(<ParallaxStars />);
    const starsContainer = container.querySelector('.fixed');
    expect(starsContainer).toBeTruthy();
  });

  test('container has pointer-events-none', () => {
    const { container } = render(<ParallaxStars />);
    const starsContainer = container.querySelector('.pointer-events-none');
    expect(starsContainer).toBeTruthy();
  });

  test('container has z-index 0', () => {
    const { container } = render(<ParallaxStars />);
    const starsContainer = container.querySelector('.z-0');
    expect(starsContainer).toBeTruthy();
  });
});


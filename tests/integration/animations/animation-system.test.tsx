/**
 * Integration Tests: Animation System
 * 
 * Tests animation components working together
 * Following testing-strategy.md requirements
 */

import React from 'react';
import { describe, test, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import LoadingOverlay from '@/components/animations/LoadingOverlay';
import CursorTrail from '@/components/animations/CursorTrail';
import ParallaxStars from '@/components/animations/ParallaxStars';
import DriftingSpaceships from '@/components/animations/DriftingSpaceships';
import MouseParallax from '@/components/animations/MouseParallax';
import Constellation from '@/components/animations/Constellation';

// Mock GSAP
jest.mock('gsap', () => ({
  set: jest.fn(),
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  registerPlugin: jest.fn(),
  killTweensOf: jest.fn(),
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(() => ({
      kill: jest.fn(),
    })),
    getAll: jest.fn(() => []),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
    media: '',
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Animation System Integration', () => {
  test('all animation components can render together', () => {
    const { container } = render(
      <>
        <LoadingOverlay />
        <ParallaxStars />
        <DriftingSpaceships />
        <Constellation />
        <MouseParallax>
          <div>Test content</div>
        </MouseParallax>
      </>
    );
    
    expect(container).toBeTruthy();
  });

  test('LoadingOverlay has highest z-index', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.querySelector('.z-\\[9999\\]');
    expect(overlay).toBeTruthy();
  });

  test('background animations have z-index 0', () => {
    const { container: starsContainer } = render(<ParallaxStars />);
    const { container: shipsContainer } = render(<DriftingSpaceships />);
    const { container: constellationContainer } = render(<Constellation />);
    
    expect(starsContainer.querySelector('.z-0')).toBeTruthy();
    expect(shipsContainer.querySelector('.z-0')).toBeTruthy();
    expect(constellationContainer.querySelector('.z-0')).toBeTruthy();
  });

  test('all background animations have pointer-events-none', () => {
    const { container: starsContainer } = render(<ParallaxStars />);
    const { container: shipsContainer } = render(<DriftingSpaceships />);
    const { container: constellationContainer } = render(<Constellation />);
    
    expect(starsContainer.querySelector('.pointer-events-none')).toBeTruthy();
    expect(shipsContainer.querySelector('.pointer-events-none')).toBeTruthy();
    expect(constellationContainer.querySelector('.pointer-events-none')).toBeTruthy();
  });

  test('all animations have fixed positioning', () => {
    const { container: overlayContainer } = render(<LoadingOverlay />);
    const { container: starsContainer } = render(<ParallaxStars />);
    const { container: shipsContainer } = render(<DriftingSpaceships />);
    const { container: constellationContainer } = render(<Constellation />);
    
    expect(overlayContainer.querySelector('.fixed')).toBeTruthy();
    expect(starsContainer.querySelector('.fixed')).toBeTruthy();
    expect(shipsContainer.querySelector('.fixed')).toBeTruthy();
    expect(constellationContainer.querySelector('.fixed')).toBeTruthy();
  });
});


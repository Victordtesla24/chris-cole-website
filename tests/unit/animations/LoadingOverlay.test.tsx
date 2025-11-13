/**
 * Unit Tests: LoadingOverlay Component
 * 
 * Tests Saturn & Moon orbit loading animation
 * Following testing-strategy.md requirements
 */

import React from 'react';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import LoadingOverlay from '@/components/animations/LoadingOverlay';

// Mock GSAP
jest.mock('gsap', () => ({
  set: jest.fn(),
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
}));

describe('LoadingOverlay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('component renders without errors', () => {
    const { container } = render(<LoadingOverlay />);
    expect(container).toBeTruthy();
  });

  test('data-w-id attribute is present', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.querySelector('[data-w-id="5e181dd5-2adb-abf2-9999-c6fcf58866a5"]');
    expect(overlay).toBeTruthy();
  });

  test('overlay has correct z-index class', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.querySelector('.z-\\[9999\\]');
    expect(overlay).toBeTruthy();
  });

  test('overlay is centered on screen', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeTruthy();
    expect(overlay?.className).toContain('flex');
    expect(overlay?.className).toContain('items-center');
    expect(overlay?.className).toContain('justify-center');
  });

  test('LOADING text is present', () => {
    const { getByText } = render(<LoadingOverlay />);
    expect(getByText('LOADING')).toBeTruthy();
  });

  test('overlay has black background', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.querySelector('.bg-black');
    expect(overlay).toBeTruthy();
  });
});


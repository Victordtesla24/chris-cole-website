/**
 * Unit Tests: DriftingSpaceships Component
 * 
 * Tests spaceship icons drifting diagonally
 * Following testing-strategy.md requirements
 */

import React from 'react';
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import DriftingSpaceships from '@/components/animations/DriftingSpaceships';

// Mock GSAP
jest.mock('gsap', () => ({
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  set: jest.fn(),
  killTweensOf: jest.fn(),
}));

describe('DriftingSpaceships Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('component renders without errors', () => {
    const { container } = render(<DriftingSpaceships />);
    expect(container).toBeTruthy();
  });

  test('container has fixed position', () => {
    const { container } = render(<DriftingSpaceships />);
    const containerEl = container.querySelector('.fixed');
    expect(containerEl).toBeTruthy();
  });

  test('container has pointer-events-none', () => {
    const { container } = render(<DriftingSpaceships />);
    const containerEl = container.querySelector('.pointer-events-none');
    expect(containerEl).toBeTruthy();
  });

  test('container has z-index 0', () => {
    const { container } = render(<DriftingSpaceships />);
    const containerEl = container.querySelector('.z-0');
    expect(containerEl).toBeTruthy();
  });
});


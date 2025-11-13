/**
 * Unit Tests: Constellation Component
 * 
 * Tests connected stars forming constellation pattern
 * Following testing-strategy.md requirements
 */

import React from 'react';
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import Constellation from '@/components/animations/Constellation';

// Mock GSAP
jest.mock('gsap', () => ({
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  killTweensOf: jest.fn(),
}));

describe('Constellation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('component renders without errors', () => {
    const { container } = render(<Constellation />);
    expect(container).toBeTruthy();
  });

  test('container has fixed position', () => {
    const { container } = render(<Constellation />);
    const containerEl = container.querySelector('.fixed');
    expect(containerEl).toBeTruthy();
  });

  test('container has pointer-events-none', () => {
    const { container } = render(<Constellation />);
    const containerEl = container.querySelector('.pointer-events-none');
    expect(containerEl).toBeTruthy();
  });

  test('container has z-index 0', () => {
    const { container } = render(<Constellation />);
    const containerEl = container.querySelector('.z-0');
    expect(containerEl).toBeTruthy();
  });
});


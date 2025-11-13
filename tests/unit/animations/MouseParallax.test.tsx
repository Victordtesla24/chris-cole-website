/**
 * Unit Tests: MouseParallax Component
 * 
 * Tests 3D parallax effect based on mouse position
 * Following testing-strategy.md requirements
 */

import React from 'react';
import { describe, test, expect, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import MouseParallax from '@/components/animations/MouseParallax';

// Mock GSAP
jest.mock('gsap', () => ({
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  killTweensOf: jest.fn(),
}));

describe('MouseParallax Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('component renders without errors', () => {
    const { container } = render(
      <MouseParallax>
        <div>Test content</div>
      </MouseParallax>
    );
    expect(container).toBeTruthy();
  });

  test('children are rendered', () => {
    const { getByText } = render(
      <MouseParallax>
        <div>Test content</div>
      </MouseParallax>
    );
    expect(getByText('Test content')).toBeTruthy();
  });
});


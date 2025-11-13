/**
 * Unit Tests: SmoothScroll Component
 * 
 * Tests Lenis smooth scroll initialization
 * Following testing-strategy.md requirements
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import SmoothScroll from '@/components/layout/SmoothScroll';

// Mock Lenis
jest.mock('lenis', () => {
  return jest.fn().mockImplementation(() => ({
    raf: jest.fn(),
    destroy: jest.fn(),
  }));
});

describe('SmoothScroll Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('component renders without errors', () => {
    const { container } = render(
      <SmoothScroll>
        <div>Test content</div>
      </SmoothScroll>
    );
    
    expect(container).toBeTruthy();
  });

  test('children are rendered', () => {
    const { getByText } = render(
      <SmoothScroll>
        <div>Test content</div>
      </SmoothScroll>
    );
    
    expect(getByText('Test content')).toBeTruthy();
  });

  test('Lenis is initialized with correct configuration', () => {
    const Lenis = require('lenis');
    
    render(
      <SmoothScroll>
        <div>Test</div>
      </SmoothScroll>
    );
    
    expect(Lenis).toHaveBeenCalled();
    const config = Lenis.mock.calls[0][0];
    expect(config.duration).toBe(1.2);
    expect(config.easing).toBeDefined();
  });
});


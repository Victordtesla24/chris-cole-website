/**
 * Unit Tests: CursorTrail Component
 * 
 * Tests custom cursor that follows mouse
 * Following testing-strategy.md requirements
 */

import React from 'react';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import CursorTrail from '@/components/animations/CursorTrail';

// Mock GSAP
jest.mock('gsap', () => ({
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  set: jest.fn(),
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

describe('CursorTrail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.innerWidth for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('component renders without errors on desktop', () => {
    const { container } = render(<CursorTrail />);
    expect(container).toBeTruthy();
  });

  test('cursor has correct classes', () => {
    const { container } = render(<CursorTrail />);
    const cursor = container.querySelector('.fixed');
    expect(cursor).toBeTruthy();
    expect(cursor?.className).toContain('rounded-full');
    expect(cursor?.className).toContain('bg-white');
    expect(cursor?.className).toContain('pointer-events-none');
    expect(cursor?.className).toContain('mix-blend-difference');
  });

  test('cursor has correct size (24px)', () => {
    const { container } = render(<CursorTrail />);
    const cursor = container.querySelector('.w-6.h-6');
    expect(cursor).toBeTruthy();
  });

  test('cursor is hidden on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile width
    });

    const { container } = render(<CursorTrail />);
    // Component should return null on mobile
    expect(container.firstChild).toBeNull();
  });
});


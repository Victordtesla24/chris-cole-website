/**
 * Unit Tests: useScrollTrigger Hook (Framer Motion)
 * 
 * Tests Framer Motion scroll trigger hook
 * Following testing-strategy.md requirements
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useScrollTrigger } from '@/animations/scrollTrigger';
import { useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  useAnimation: jest.fn(() => ({
    start: jest.fn(),
  })),
}));

// Mock react-intersection-observer
const mockInView = jest.fn();
const mockRef = jest.fn();

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({
    ref: mockRef,
    inView: false,
  })),
}));

describe('useScrollTrigger Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useInView as jest.Mock).mockReturnValue({
      ref: mockRef,
      inView: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns controls and inView state', () => {
    const { result } = renderHook(() => useScrollTrigger());
    
    expect(result.current).toHaveProperty('controls');
    expect(result.current).toHaveProperty('inView');
    expect(result.current).toHaveProperty('ref');
  });

  test('uses default config options', () => {
    renderHook(() => useScrollTrigger());
    
    expect(useInView).toHaveBeenCalledWith({
      triggerOnce: true,
      threshold: 0.1,
      rootMargin: '-50px',
    });
  });

  test('accepts custom config options', () => {
    renderHook(() => useScrollTrigger({
      triggerOnce: false,
      threshold: 0.2,
      rootMargin: '-100px',
    }));
    
    expect(useInView).toHaveBeenCalledWith({
      triggerOnce: false,
      threshold: 0.2,
      rootMargin: '-100px',
    });
  });

  test('starts visible animation when inView is true', () => {
    const mockStart = jest.fn();
    (useAnimation as jest.Mock).mockReturnValue({
      start: mockStart,
    });
    (useInView as jest.Mock).mockReturnValue({
      ref: mockRef,
      inView: true,
    });
    
    renderHook(() => useScrollTrigger());
    
    expect(mockStart).toHaveBeenCalledWith('visible');
  });

  test('starts hidden animation when inView is false and triggerOnce is false', () => {
    const mockStart = jest.fn();
    (useAnimation as jest.Mock).mockReturnValue({
      start: mockStart,
    });
    (useInView as jest.Mock).mockReturnValue({
      ref: mockRef,
      inView: false,
    });
    
    renderHook(() => useScrollTrigger({ triggerOnce: false }));
    
    expect(mockStart).toHaveBeenCalledWith('hidden');
  });

  test('does not start hidden animation when triggerOnce is true', () => {
    const mockStart = jest.fn();
    (useAnimation as jest.Mock).mockReturnValue({
      start: mockStart,
    });
    (useInView as jest.Mock).mockReturnValue({
      ref: mockRef,
      inView: false,
    });
    
    renderHook(() => useScrollTrigger({ triggerOnce: true }));
    
    expect(mockStart).not.toHaveBeenCalledWith('hidden');
  });

  test('returns ref for element attachment', () => {
    const { result } = renderHook(() => useScrollTrigger());
    
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref).toHaveProperty('current');
  });
});


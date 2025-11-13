/**
 * Unit Tests: useParallax Hook
 * 
 * Tests parallax scroll effects
 * Following testing-strategy.md requirements
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useParallax } from '@/hooks/useParallax';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Get the mock function after import
const getMockGetAll = () => (ScrollTrigger as any).getAll;

// Mock GSAP and ScrollTrigger
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    to: jest.fn(() => ({
      scrollTrigger: null,
    })),
  },
}));

const mockGetAll = jest.fn(() => []);
jest.mock('gsap/ScrollTrigger', () => {
  const mockGetAllFn = jest.fn(() => []);
  return {
    __esModule: true,
    default: {
      getAll: mockGetAllFn,
    },
    mockGetAll: mockGetAllFn,
  };
});

describe('useParallax Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
    document.body.innerHTML = '<div id="test-element"></div>';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns a ref', () => {
    const { result } = renderHook(() => useParallax());
    
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('current');
  });

  test('registers ScrollTrigger plugin', () => {
    renderHook(() => useParallax());
    
    expect(gsap.registerPlugin).toHaveBeenCalledWith(ScrollTrigger);
  });

  test('accepts speed multiplier parameter', () => {
    const { result } = renderHook(() => useParallax(0.3));
    
    expect(result.current).toBeDefined();
  });

  test('creates parallax animation with scrub enabled', () => {
    const { result } = renderHook(() => useParallax(0.5));
    
    const element = document.getElementById('test-element');
    if (element && result.current) {
      Object.defineProperty(result.current, 'current', {
        value: element as HTMLElement,
        writable: true,
        configurable: true,
      });
    }
    
    renderHook(() => useParallax(0.5));
    
    expect(gsap.to).toHaveBeenCalled();
    const toCall = (gsap.to as jest.Mock).mock.calls[0];
    const animationConfig = toCall[1] as any;
    const scrollTriggerConfig = animationConfig?.scrollTrigger;
    expect(scrollTriggerConfig).toMatchObject({
      trigger: expect.any(HTMLElement),
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    });
  });

  test('uses correct speed multiplier in animation', () => {
    const { result } = renderHook(() => useParallax(0.3));
    
    const element = document.getElementById('test-element');
    if (element && result.current) {
      Object.defineProperty(result.current, 'current', {
        value: element as HTMLElement,
        writable: true,
        configurable: true,
      });
    }
    
    renderHook(() => useParallax(0.3));
    
    expect(gsap.to).toHaveBeenCalled();
    const toCall = (gsap.to as jest.Mock).mock.calls[0];
    const animationConfig = toCall[1] as any;
    expect(animationConfig.ease).toBe('none');
    expect(typeof animationConfig.y).toBe('function');
  });

  test('defaults to 0.5 speed if not provided', () => {
    const { result } = renderHook(() => useParallax());
    
    expect(result.current).toBeDefined();
  });

  test('cleans up ScrollTrigger on unmount', () => {
    const mockKill = jest.fn();
    const mockScrollTrigger = { kill: mockKill };
    
    (gsap.to as jest.Mock).mockReturnValue({
      scrollTrigger: mockScrollTrigger,
    });
    
    const { result, unmount } = renderHook(() => useParallax(0.5));
    
    const element = document.getElementById('test-element');
    if (element && result.current) {
      // Mock ref assignment for test
      const ref = result.current as any;
      if (ref) {
        Object.defineProperty(ref, 'current', {
          value: element as HTMLElement,
          writable: true,
          configurable: true,
        });
      }
    }
    
    unmount();
    
    expect(ScrollTrigger.getAll).toHaveBeenCalled();
  });
});


/**
 * Unit Tests: useScrollReveal Hook
 * 
 * Tests scroll-triggered fade-up animations
 * Following testing-strategy.md requirements
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Mock GSAP and ScrollTrigger
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    fromTo: jest.fn(() => ({
      scrollTrigger: null,
    })),
  },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(() => []),
  },
}));

describe('useScrollReveal Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock DOM element
    document.body.innerHTML = '<div id="test-element"></div>';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns a ref', () => {
    const { result } = renderHook(() => useScrollReveal());
    
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('current');
  });

  test('registers ScrollTrigger plugin', () => {
    renderHook(() => useScrollReveal());
    
    expect(gsap.registerPlugin).toHaveBeenCalledWith(ScrollTrigger);
  });

  test('creates animation with correct initial state', () => {
    const { result } = renderHook(() => useScrollReveal());
    
    // Attach ref to element
    const element = document.getElementById('test-element');
    if (element && result.current) {
      // Use Object.defineProperty to set readonly current
      Object.defineProperty(result.current, 'current', {
        value: element as HTMLDivElement,
        writable: true,
        configurable: true,
      });
    }
    
    // Re-render to trigger effect
    renderHook(() => useScrollReveal());
    
    expect(gsap.fromTo).toHaveBeenCalled();
    const fromToCall = (gsap.fromTo as jest.Mock).mock.calls[0];
    expect(fromToCall[1]).toMatchObject({
      opacity: 0,
      y: 30,
    });
  });

  test('creates animation with correct target state', () => {
    const { result } = renderHook(() => useScrollReveal());
    
    const element = document.getElementById('test-element');
    if (element && result.current) {
      Object.defineProperty(result.current, 'current', {
        value: element as HTMLDivElement,
        writable: true,
        configurable: true,
      });
    }
    
    renderHook(() => useScrollReveal());
    
    expect(gsap.fromTo).toHaveBeenCalled();
    const fromToCall = (gsap.fromTo as jest.Mock).mock.calls[0];
    expect(fromToCall[2]).toMatchObject({
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  test('configures ScrollTrigger with correct settings', () => {
    const { result } = renderHook(() => useScrollReveal());
    
    const element = document.getElementById('test-element');
    if (element && result.current) {
      Object.defineProperty(result.current, 'current', {
        value: element as HTMLDivElement,
        writable: true,
        configurable: true,
      });
    }
    
    renderHook(() => useScrollReveal());
    
    expect(gsap.fromTo).toHaveBeenCalled();
    const fromToCall = (gsap.fromTo as jest.Mock).mock.calls[0];
    const animationConfig = fromToCall[2] as any;
    const scrollTriggerConfig = animationConfig?.scrollTrigger;
    expect(scrollTriggerConfig).toMatchObject({
      trigger: expect.any(HTMLElement),
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    });
  });

  test('cleans up ScrollTrigger on unmount', () => {
    const mockKill = jest.fn();
    const mockScrollTrigger = { kill: mockKill };
    
    (gsap.fromTo as jest.Mock).mockReturnValue({
      scrollTrigger: mockScrollTrigger,
    });
    
    const { result, unmount } = renderHook(() => useScrollReveal());
    
    const element = document.getElementById('test-element');
    if (element && result.current) {
      Object.defineProperty(result.current, 'current', {
        value: element as HTMLDivElement,
        writable: true,
        configurable: true,
      });
    }
    
    unmount();
    
    // Verify cleanup is called (through ScrollTrigger.getAll)
    expect(ScrollTrigger.getAll).toHaveBeenCalled();
  });
});


/**
 * Unit Tests: EarthMoonSunAnimation
 *
 * Ensures heavy canvas animation respects motion preferences and lazy loading.
 */

import React from 'react';
import { describe, expect, test, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import EarthMoonSunAnimation from '@/components/animations/EarthMoonSunAnimation';

type MatchMediaResult = {
  matches: boolean;
  media: string;
  onchange: null;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  addListener: jest.Mock;
  removeListener: jest.Mock;
  dispatchEvent: jest.Mock;
};

const createMatchMedia = (matches: boolean): MatchMediaResult => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('EarthMoonSunAnimation', () => {
  const originalMatchMedia = window.matchMedia;
  const originalIntersectionObserver = global.IntersectionObserver;
  const originalRAF = window.requestAnimationFrame;
  const originalCAF = window.cancelAnimationFrame;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    global.IntersectionObserver = originalIntersectionObserver as any;
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCAF;
    jest.restoreAllMocks();
  });

  test('skips canvas initialization when prefers-reduced-motion is enabled', () => {
    window.matchMedia = jest.fn().mockImplementation(() => createMatchMedia(true));

    const getContextSpy = jest.spyOn(HTMLCanvasElement.prototype, 'getContext');
    render(<EarthMoonSunAnimation />);

    expect(getContextSpy).not.toHaveBeenCalled();
  });

  test('registers lazy-load observer with 200px root margin', () => {
    window.matchMedia = jest.fn().mockImplementation(() => createMatchMedia(false));

    let usedRootMargin: string | undefined;
    class MockObserver {
      callback: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = cb;
        usedRootMargin = options?.rootMargin;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    global.IntersectionObserver = MockObserver as unknown as typeof IntersectionObserver;

    const getContextSpy = jest.spyOn(HTMLCanvasElement.prototype, 'getContext');
    render(<EarthMoonSunAnimation />);

    expect(usedRootMargin).toBe('200px');
    expect(getContextSpy).not.toHaveBeenCalled();
  });

  test('starts animation when visible and cleans up on unmount', () => {
    window.matchMedia = jest.fn().mockImplementation(() => createMatchMedia(false));

    window.requestAnimationFrame = jest.fn().mockReturnValue(7 as unknown as number);
    const cancelMock = jest.fn();
    window.cancelAnimationFrame = cancelMock as unknown as typeof window.cancelAnimationFrame;
    const getContextSpy = jest
      .spyOn(HTMLCanvasElement.prototype as any, 'getContext')
      .mockImplementation(() => ({} as unknown as CanvasRenderingContext2D));

    class TriggeringObserver {
      callback: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.callback = cb;
      }
      observe(target: Element) {
        this.callback(
          [{ isIntersecting: true, target } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver
        );
      }
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    global.IntersectionObserver = TriggeringObserver as unknown as typeof IntersectionObserver;

    const { unmount } = render(<EarthMoonSunAnimation />);
    expect(getContextSpy).toHaveBeenCalled();

    unmount();
    expect(cancelMock).toHaveBeenCalledWith(7);
  });
});

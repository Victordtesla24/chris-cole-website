/**
 * Unit Tests: SaturnCanvasAnimation
 *
 * Verifies reduced-motion compliance, lazy-loading, and cleanup.
 */

import React from 'react';
import { describe, expect, test, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import SaturnCanvasAnimation from '@/components/animations/SaturnCanvasAnimation';

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

const createContextStub = (): CanvasRenderingContext2D =>
  ({
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    clearRect: jest.fn(),
    createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
    lineCap: 'round',
    lineJoin: 'round',
  } as unknown as CanvasRenderingContext2D);

describe('SaturnCanvasAnimation', () => {
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

  test('does not run when prefers-reduced-motion is enabled', () => {
    window.matchMedia = jest.fn().mockImplementation(() => createMatchMedia(true));

    const rafSpy = jest.spyOn(window, 'requestAnimationFrame');
    render(<SaturnCanvasAnimation />);

    expect(rafSpy).not.toHaveBeenCalled();
  });

  test('configures IntersectionObserver with 200px root margin', () => {
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

    render(<SaturnCanvasAnimation />);
    expect(usedRootMargin).toBe('200px');
  });

  test('starts and stops animation when visible', () => {
    window.matchMedia = jest.fn().mockImplementation(() => createMatchMedia(false));

    const ctxStub = createContextStub();
    jest
      .spyOn(HTMLCanvasElement.prototype as any, 'getContext')
      .mockImplementation(() => ctxStub);

    const rafMock = jest.fn().mockReturnValue(11 as unknown as number);
    window.requestAnimationFrame = rafMock as unknown as typeof window.requestAnimationFrame;
    const cancelMock = jest.fn();
    window.cancelAnimationFrame = cancelMock as unknown as typeof window.cancelAnimationFrame;

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

    const { unmount } = render(<SaturnCanvasAnimation />);
    expect(rafMock).toHaveBeenCalled();

    unmount();
    expect(cancelMock).toHaveBeenCalledWith(11);
  });
});

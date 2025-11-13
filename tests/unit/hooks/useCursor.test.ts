/**
 * Unit Tests: useCursor Hook
 * 
 * Tests custom cursor state management
 * Following testing-strategy.md requirements
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useCursor } from '@/hooks/useCursor';

describe('useCursor Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <a href="#test">Link</a>
      <button>Button</button>
    `;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns cursor position and state', () => {
    const { result } = renderHook(() => useCursor());
    
    expect(result.current).toHaveProperty('position');
    expect(result.current).toHaveProperty('state');
    expect(result.current).toHaveProperty('scale');
  });

  test('tracks mouse position', () => {
    const { result } = renderHook(() => useCursor());
    
    act(() => {
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
      });
      window.dispatchEvent(mouseEvent);
    });
    
    expect(result.current.position.x).toBe(100);
    expect(result.current.position.y).toBe(200);
  });

  test('default state is "default"', () => {
    const { result } = renderHook(() => useCursor());
    
    expect(result.current.state).toBe('default');
    expect(result.current.scale).toBe(1);
  });

  test('changes to hover state on interactive element hover', () => {
    const { result } = renderHook(() => useCursor());
    
    const link = document.querySelector('a');
    
    act(() => {
      if (link) {
        const mouseEnterEvent = new MouseEvent('mouseenter', {
          bubbles: true,
        });
        link.dispatchEvent(mouseEnterEvent);
      }
    });
    
    expect(result.current.state).toBe('hover');
    expect(result.current.scale).toBe(1.5);
  });

  test('changes to click state on mousedown', () => {
    const { result } = renderHook(() => useCursor());
    
    act(() => {
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
      });
      window.dispatchEvent(mouseDownEvent);
    });
    
    expect(result.current.state).toBe('click');
    expect(result.current.scale).toBe(0.75);
  });

  test('returns to default state on mouseup', () => {
    const { result } = renderHook(() => useCursor());
    
    act(() => {
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
      });
      window.dispatchEvent(mouseDownEvent);
    });
    
    expect(result.current.state).toBe('click');
    
    act(() => {
      const mouseUpEvent = new MouseEvent('mouseup', {
        bubbles: true,
      });
      window.dispatchEvent(mouseUpEvent);
    });
    
    expect(result.current.state).toBe('default');
    expect(result.current.scale).toBe(1);
  });

  test('returns correct scale for each state', () => {
    const { result } = renderHook(() => useCursor());
    
    // Default
    expect(result.current.scale).toBe(1);
    
    // Hover
    act(() => {
      const link = document.querySelector('a');
      if (link) {
        link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      }
    });
    expect(result.current.scale).toBe(1.5);
    
    // Click
    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(result.current.scale).toBe(0.75);
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useCursor());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});


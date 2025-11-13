/**
 * Unit Tests: SketchesSection Component
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import SketchesSection from '@/components/sections/SketchesSection';

// Mock scroll trigger
jest.mock('@/animations/scrollTrigger', () => ({
  useScrollTrigger: () => ({
    controls: 'visible',
  }),
}));

describe('SketchesSection Component', () => {
  test('component renders without errors', () => {
    render(<SketchesSection />);
    expect(screen.getByText('SKETCHES')).toBeTruthy();
  });

  test('section has id="sketches"', () => {
    const { container } = render(<SketchesSection />);
    const section = container.querySelector('section#sketches');
    expect(section).toBeTruthy();
  });

  test('section heading is h2', () => {
    const { container } = render(<SketchesSection />);
    const heading = container.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('SKETCHES');
  });

  test('gallery grid is present', () => {
    const { container } = render(<SketchesSection />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeTruthy();
  });
});


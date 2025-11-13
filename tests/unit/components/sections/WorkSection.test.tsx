/**
 * Unit Tests: WorkSection Component
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import WorkSection from '@/components/sections/WorkSection';

// Mock scroll trigger
jest.mock('@/animations/scrollTrigger', () => ({
  useScrollTrigger: () => ({
    controls: 'visible',
  }),
}));

describe('WorkSection Component', () => {
  test('component renders without errors', () => {
    render(<WorkSection />);
    expect(screen.getByText('WORK')).toBeTruthy();
  });

  test('section has id="work"', () => {
    const { container } = render(<WorkSection />);
    const section = container.querySelector('section#work');
    expect(section).toBeTruthy();
  });

  test('UNDER CONSTRUCTION label is present', () => {
    render(<WorkSection />);
    const label = screen.getByText('(UNDER CONSTRUCTION)');
    expect(label).toBeTruthy();
  });

  test('section heading is h2', () => {
    const { container } = render(<WorkSection />);
    const heading = container.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('WORK');
  });
});


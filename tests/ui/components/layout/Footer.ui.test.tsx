/**
 * UI Tests: Footer Component
 * 
 * Tests visual rendering and structure
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer UI Structure', () => {
  test('footer has correct semantic HTML structure', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeTruthy();
  });

  test('footer has centered text layout', () => {
    const { container } = render(<Footer />);
    const centeredDiv = container.querySelector('.text-center');
    expect(centeredDiv).toBeTruthy();
  });

  test('footer has monospace font for technical details', () => {
    const { container } = render(<Footer />);
    const monoElements = container.querySelectorAll('.font-mono');
    expect(monoElements.length).toBeGreaterThan(0);
  });

  test('footer has proper spacing classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('py-8');
  });

  test('footer has border top', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('border-t');
  });

  test('footer text colors are correct (gray scale)', () => {
    const { container } = render(<Footer />);
    const grayText = container.querySelectorAll('.text-gray-300, .text-gray-400');
    expect(grayText.length).toBeGreaterThan(0);
  });
});


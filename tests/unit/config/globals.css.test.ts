/**
 * Unit Tests: src/app/globals.css
 * 
 * Tests global CSS styles, Tailwind directives, custom utilities
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('globals.css Configuration', () => {
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  let cssContent: string;

  beforeAll(() => {
    cssContent = fs.readFileSync(globalsPath, 'utf-8');
  });

  test('globals.css file exists', () => {
    expect(fs.existsSync(globalsPath)).toBe(true);
  });

  test('Tailwind directives are present', () => {
    expect(cssContent).toContain('@tailwind base');
    expect(cssContent).toContain('@tailwind components');
    expect(cssContent).toContain('@tailwind utilities');
  });

  test('background is pure black', () => {
    expect(cssContent).toMatch(/bg-black|background.*#000000|background.*black/i);
  });

  test('text is pure white', () => {
    expect(cssContent).toMatch(/text-white|color.*#FFFFFF|color.*white/i);
  });

  test('custom cursor is hidden', () => {
    expect(cssContent).toContain('cursor-none');
  });

  test('smooth scroll is enabled', () => {
    expect(cssContent).toContain('scroll-smooth');
  });

  test('reduced motion preferences are respected', () => {
    expect(cssContent).toContain('prefers-reduced-motion');
    expect(cssContent).toContain('reduce');
  });

  test('custom utility classes are defined', () => {
    expect(cssContent).toContain('.text-hero');
    expect(cssContent).toContain('.text-section');
    expect(cssContent).toContain('.section-padding');
    expect(cssContent).toContain('.container-custom');
    expect(cssContent).toContain('.text-column');
  });

  test('focus indicators are visible for accessibility', () => {
    expect(cssContent).toContain('focus-visible');
    expect(cssContent).toContain('outline');
  });

  test('custom cursor styles are defined', () => {
    expect(cssContent).toContain('.custom-cursor');
    expect(cssContent).toContain('mix-blend-mode: difference');
  });

  test('custom cursor is hidden on mobile', () => {
    expect(cssContent).toContain('@media');
    expect(cssContent).toMatch(/max-width.*1024|1024.*max-width/);
    expect(cssContent).toContain('cursor: auto');
  });

  test('loading animation keyframes are defined', () => {
    expect(cssContent).toContain('@keyframes blink');
  });
});


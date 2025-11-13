/**
 * Unit Tests: tailwind.config.js
 * 
 * Tests Tailwind CSS configuration with custom theme
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('tailwind.config.js Configuration', () => {
  const configPath = path.join(process.cwd(), 'tailwind.config.js');
  let configContent: string;

  beforeAll(() => {
    configContent = fs.readFileSync(configPath, 'utf-8');
  });

  test('tailwind.config.js file exists', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('content paths include all source files', () => {
    expect(configContent).toContain('./src/pages/**/*');
    expect(configContent).toContain('./src/components/**/*');
    expect(configContent).toContain('./src/app/**/*');
  });

  test('custom colors are defined', () => {
    expect(configContent).toContain('black: \'#000000\'');
    expect(configContent).toContain('white: \'#FFFFFF\'');
    expect(configContent).toContain('gray:');
    expect(configContent).toContain('100: \'#CCCCCC\'');
    expect(configContent).toContain('200: \'#AAAAAA\'');
    expect(configContent).toContain('300: \'#888888\'');
    expect(configContent).toContain('400: \'#666666\'');
    expect(configContent).toContain('500: \'#333333\'');
  });

  test('custom fonts are configured', () => {
    expect(configContent).toContain('fontFamily:');
    expect(configContent).toContain('--font-space-grotesk');
    expect(configContent).toContain('Courier New');
    expect(configContent).toContain('monospace');
  });

  test('custom font sizes are defined', () => {
    expect(configContent).toContain('fontSize:');
    expect(configContent).toMatch(/['"]hero['"]:/);
    expect(configContent).toMatch(/['"]section['"]:/);
  });

  test('custom animations are defined', () => {
    expect(configContent).toContain('animation:');
    expect(configContent).toContain('twinkle');
    expect(configContent).toContain('float');
    expect(configContent).toContain('drift');
    expect(configContent).toContain('rotate-saturn');
    expect(configContent).toContain('orbit-moon');
  });

  test('custom keyframes are defined', () => {
    expect(configContent).toContain('keyframes:');
    expect(configContent).toContain('twinkle:');
    expect(configContent).toContain('float:');
    expect(configContent).toContain('drift:');
    expect(configContent).toContain('rotateSaturn:');
    expect(configContent).toContain('orbitMoon:');
  });

  test('custom spacing is defined', () => {
    expect(configContent).toContain('spacing:');
    expect(configContent).toMatch(/['"]section['"]:/);
    expect(configContent).toMatch(/['"]section-mobile['"]:/);
  });

  test('cursor-none utility is defined', () => {
    expect(configContent).toContain('cursor:');
    expect(configContent).toContain('none: \'none\'');
  });
});


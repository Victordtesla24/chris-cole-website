/**
 * Unit Tests: postcss.config.js
 * 
 * Tests PostCSS configuration for Tailwind processing
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('postcss.config.js Configuration', () => {
  const configPath = path.join(process.cwd(), 'postcss.config.js');
  let configContent: string;

  beforeAll(() => {
    configContent = fs.readFileSync(configPath, 'utf-8');
  });

  test('postcss.config.js file exists', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('tailwindcss plugin is configured', () => {
    expect(configContent).toContain('tailwindcss:');
  });

  test('autoprefixer plugin is configured', () => {
    expect(configContent).toContain('autoprefixer:');
  });

  test('plugins object structure is correct', () => {
    expect(configContent).toContain('plugins:');
    // Check that both plugins are present (order doesn't matter)
    expect(configContent).toContain('tailwindcss');
    expect(configContent).toContain('autoprefixer');
  });
});


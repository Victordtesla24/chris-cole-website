/**
 * Unit Tests: src/app/fonts.ts
 * 
 * Tests Google Fonts configuration (Space Grotesk)
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('fonts.ts Configuration', () => {
  const fontsPath = path.join(process.cwd(), 'src/app/fonts.ts');
  let fontsContent: string;

  beforeAll(() => {
    fontsContent = fs.readFileSync(fontsPath, 'utf-8');
  });

  test('fonts.ts file exists', () => {
    expect(fs.existsSync(fontsPath)).toBe(true);
  });

  test('Space Grotesk is imported from next/font/google', () => {
    expect(fontsContent).toContain('Space_Grotesk');
    expect(fontsContent).toContain('next/font/google');
  });

  test('font-display: swap strategy is configured', () => {
    expect(fontsContent).toContain('display: \'swap\'');
  });

  test('preload is enabled for critical fonts', () => {
    expect(fontsContent).toContain('preload: true');
  });

  test('all required weights are configured', () => {
    expect(fontsContent).toContain('weight:');
    expect(fontsContent).toContain('300');
    expect(fontsContent).toContain('400');
    expect(fontsContent).toContain('500');
    expect(fontsContent).toContain('600');
    expect(fontsContent).toContain('700');
  });

  test('latin subset is configured', () => {
    expect(fontsContent).toContain('subsets:');
    expect(fontsContent).toContain('latin');
  });

  test('font variable is exported correctly', () => {
    expect(fontsContent).toContain('variable: \'--font-space-grotesk\'');
    expect(fontsContent).toContain('export const spaceGrotesk');
  });

  test('no Typekit script imports present (only comments allowed)', () => {
    // Typekit references in comments are acceptable for documentation
    // But no actual Typekit imports or scripts should be present
    expect(fontsContent).not.toContain('use.typekit.net');
    expect(fontsContent).not.toContain('typekit.js');
    expect(fontsContent).not.toContain('from \'typekit\'');
    // Comments mentioning Typekit are fine
    expect(fontsContent).toContain('next/font/google'); // Should use Google Fonts
  });

  test('Courier New is documented as system font', () => {
    expect(fontsContent).toContain('Courier New');
    expect(fontsContent).toContain('System font');
  });
});


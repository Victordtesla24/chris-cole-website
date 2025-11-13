/**
 * Unit Tests: next.config.js
 * 
 * Tests Next.js configuration for static site generation
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('next.config.js Configuration', () => {
  const configPath = path.join(process.cwd(), 'next.config.js');
  let configContent: string;

  beforeAll(() => {
    configContent = fs.readFileSync(configPath, 'utf-8');
  });

  test('next.config.js file exists', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('reactStrictMode is enabled', () => {
    expect(configContent).toContain('reactStrictMode: true');
  });

  test('image optimization is configured', () => {
    expect(configContent).toContain('images:');
    expect(configContent).toContain('formats:');
    expect(configContent).toMatch(/formats:.*avif|webp/);
  });

  test('console removal in production is enabled', () => {
    expect(configContent).toContain('removeConsole');
    expect(configContent).toContain('NODE_ENV === \'production\'');
  });

  test('compression is enabled', () => {
    expect(configContent).toContain('compress: true');
  });

  test('poweredByHeader is disabled', () => {
    expect(configContent).toContain('poweredByHeader: false');
  });

  test('original site domain is allowed for images', () => {
    expect(configContent).toContain('hellochriscole.webflow.io');
  });

  test('SITE_URL environment variable is configured', () => {
    expect(configContent).toContain('SITE_URL');
  });
});


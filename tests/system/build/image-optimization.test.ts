/**
 * System Tests: Image Optimization
 * 
 * Tests that image optimization is enabled in Next.js config
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Image Optimization Configuration', () => {
  const configPath = path.join(process.cwd(), 'next.config.js');
  let configContent: string;

  beforeAll(() => {
    configContent = fs.readFileSync(configPath, 'utf-8');
  });

  test('image optimization formats are configured', () => {
    expect(configContent).toContain('formats:');
    expect(configContent).toMatch(/avif|webp/);
  });

  test('device sizes are configured', () => {
    expect(configContent).toContain('deviceSizes:');
    // Should include common device sizes
    expect(configContent).toMatch(/640|750|828|1080|1200|1920/);
  });

  test('image domains include original site', () => {
    expect(configContent).toContain('hellochriscole.webflow.io');
  });
});


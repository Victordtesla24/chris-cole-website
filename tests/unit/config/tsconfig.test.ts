/**
 * Unit Tests: tsconfig.json
 * 
 * Tests TypeScript configuration
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('tsconfig.json Configuration', () => {
  const configPath = path.join(process.cwd(), 'tsconfig.json');
  let config: any;

  beforeAll(() => {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configContent);
  });

  test('tsconfig.json file exists', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('strict mode is enabled', () => {
    expect(config.compilerOptions.strict).toBe(true);
  });

  test('path aliases are configured correctly', () => {
    const paths = config.compilerOptions.paths;
    expect(paths).toBeDefined();
    expect(paths['@/*']).toEqual(['./src/*']);
    expect(paths['@/components/*']).toEqual(['./src/components/*']);
    expect(paths['@/animations/*']).toEqual(['./src/animations/*']);
    expect(paths['@/styles/*']).toEqual(['./src/styles/*']);
    expect(paths['@/utils/*']).toEqual(['./src/utils/*']);
    expect(paths['@/types/*']).toEqual(['./src/types/*']);
  });

  test('target is ES2020', () => {
    expect(config.compilerOptions.target).toBe('ES2020');
  });

  test('jsx is preserved for Next.js', () => {
    expect(config.compilerOptions.jsx).toBe('preserve');
  });

  test('module is esnext', () => {
    expect(config.compilerOptions.module).toBe('esnext');
  });

  test('noEmit is true (Next.js handles compilation)', () => {
    expect(config.compilerOptions.noEmit).toBe(true);
  });

  test('incremental compilation is enabled', () => {
    expect(config.compilerOptions.incremental).toBe(true);
  });

  test('Next.js plugin is configured', () => {
    expect(config.compilerOptions.plugins).toBeDefined();
    expect(config.compilerOptions.plugins[0].name).toBe('next');
  });
});


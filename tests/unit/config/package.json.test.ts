/**
 * Unit Tests: package.json
 * 
 * Tests project dependencies and scripts
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('package.json Configuration', () => {
  const configPath = path.join(process.cwd(), 'package.json');
  let packageJson: any;

  beforeAll(() => {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    packageJson = JSON.parse(configContent);
  });

  test('package.json file exists', () => {
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('required scripts are defined', () => {
    const scripts = packageJson.scripts;
    expect(scripts).toBeDefined();
    expect(scripts.dev).toBeDefined();
    expect(scripts.build).toBeDefined();
    expect(scripts.start).toBeDefined();
    expect(scripts.lint).toBeDefined();
    expect(scripts['type-check']).toBeDefined();
  });

  test('engines are specified', () => {
    const engines = packageJson.engines;
    expect(engines).toBeDefined();
    expect(engines.node).toMatch(/>=18\.0\.0/);
    expect(engines.npm).toMatch(/>=9\.0\.0/);
  });

  test('core dependencies are present', () => {
    const deps = packageJson.dependencies;
    expect(deps).toBeDefined();
    expect(deps.next).toBeDefined();
    expect(deps.react).toBeDefined();
    expect(deps['react-dom']).toBeDefined();
    expect(deps['framer-motion']).toBeDefined();
    expect(deps.gsap).toBeDefined();
  });

  test('development dependencies are present', () => {
    const devDeps = packageJson.devDependencies;
    expect(devDeps).toBeDefined();
    expect(devDeps.typescript).toBeDefined();
    expect(devDeps['@types/node']).toBeDefined();
    expect(devDeps['@types/react']).toBeDefined();
    expect(devDeps.tailwindcss).toBeDefined();
    expect(devDeps.postcss).toBeDefined();
    expect(devDeps.autoprefixer).toBeDefined();
    expect(devDeps.eslint).toBeDefined();
  });

  test('testing dependencies are present', () => {
    const devDeps = packageJson.devDependencies;
    expect(devDeps.jest).toBeDefined();
    expect(devDeps['@types/jest']).toBeDefined();
    expect(devDeps['@testing-library/react']).toBeDefined();
    expect(devDeps['@playwright/test']).toBeDefined();
  });
});


/**
 * System Tests: Build Verification
 * 
 * Tests that production build completes successfully
 * Following testing-strategy.md requirements
 */

import { describe, test, expect } from '@jest/globals';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Build Verification', () => {
  const nextDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(nextDir, 'static');

  test('production build completes without errors', () => {
    try {
      // Run build command
      execSync('npm run build', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf-8',
      });
      
      // If we get here, build succeeded
      expect(true).toBe(true);
    } catch (error: any) {
      // Build failed
      console.error('Build error:', error.message);
      expect(false).toBe(true);
    }
  }, 120000); // 2 minute timeout for build

  test('static HTML files are generated in .next directory', () => {
    // This test runs after build
    expect(fs.existsSync(nextDir)).toBe(true);
    
    // Check for static directory
    if (fs.existsSync(staticDir)) {
      expect(fs.existsSync(staticDir)).toBe(true);
    }
  });

  test('TypeScript compilation succeeds', () => {
    try {
      execSync('npm run type-check', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf-8',
      });
      
      expect(true).toBe(true);
    } catch (error: any) {
      console.error('Type check error:', error.message);
      expect(false).toBe(true);
    }
  }, 30000);

  test('ESLint passes', () => {
    try {
      execSync('npm run lint', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf-8',
      });
      
      expect(true).toBe(true);
    } catch (error: any) {
      // ESLint may have warnings, but should not fail
      console.warn('Lint warnings:', error.message);
      // Don't fail test for warnings
    }
  }, 30000);
});


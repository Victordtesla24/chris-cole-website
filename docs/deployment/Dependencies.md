# Dependencies Documentation
# Chris Cole Portfolio Website - Complete Dependency Specifications

**Project**: Chris Cole Portfolio Website Recreation  
**Original Site**: https://hellochriscole.webflow.io  
**Target Platform**: Next.js 14 + TypeScript + Tailwind CSS  
**Deployment**: Render.com  
**Version**: 1.0.0  
**Date**: November 11, 2025  
**Status**: Complete Dependency Specification

---

## Table of Contents

1. [System Prerequisites](#1-system-prerequisites)
2. [Core Runtime Dependencies](#2-core-runtime-dependencies)
3. [Development Dependencies](#3-development-dependencies)
4. [Testing Dependencies](#4-testing-dependencies)
5. [Build & Deployment Tools](#5-build--deployment-tools)
6. [Development Tools](#6-development-tools)
7. [Optional Tools](#7-optional-tools)
8. [Installation Instructions](#8-installation-instructions)
9. [Verification Commands](#9-verification-commands)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. System Prerequisites

### 1.1 Operating System

**Supported Operating Systems**:
- macOS 10.15 (Catalina) or later
- Windows 10 or later
- Linux (Ubuntu 18.04+, Debian 10+, or equivalent)

**Current Development Environment**: macOS (Cursor IDE)

### 1.2 Node.js Runtime

**Required Version**: >= 18.0.0  
**Recommended Version**: 18.x LTS or 20.x LTS

**Installation Methods**:

**Option 1: Using Official Installer**
```bash
# Visit https://nodejs.org/
# Download LTS version for your OS
# Run installer
```

**Option 2: Using Homebrew (macOS)**
```bash
brew install node@18
# or
brew install node@20
```

**Option 3: Using nvm (Cross-platform)**
```bash
# Install nvm first: https://github.com/nvm-sh/nvm
nvm install 18
nvm use 18
```

**Verification**:
```bash
node --version  # Should show v18.x.x or v20.x.x
```

### 1.3 npm Package Manager

**Required Version**: >= 9.0.0  
**Recommended Version**: Latest stable (comes with Node.js)

**Verification**:
```bash
npm --version  # Should show 9.x.x or higher
```

**Upgrade npm** (if needed):
```bash
npm install -g npm@latest
```

### 1.4 Git Version Control

**Required Version**: >= 2.30.0  
**Recommended Version**: Latest stable

**Installation**:

**macOS**:
```bash
brew install git
# or comes with Xcode Command Line Tools
xcode-select --install
```

**Windows**:
```bash
# Download from https://git-scm.com/downloads
# Run installer
```

**Linux**:
```bash
sudo apt-get install git  # Debian/Ubuntu
sudo yum install git      # RedHat/CentOS
```

**Verification**:
```bash
git --version  # Should show 2.30.0 or higher
```

---

## 2. Core Runtime Dependencies

### 2.1 Framework & UI Libraries

#### Next.js
- **Package**: `next`
- **Version**: `^14.0.4`
- **Purpose**: React framework for static site generation, routing, optimization
- **Documentation**: https://nextjs.org/docs

#### React
- **Package**: `react`
- **Version**: `^18.2.0`
- **Purpose**: UI component library, client-side hydration
- **Documentation**: https://react.dev/

#### React DOM
- **Package**: `react-dom`
- **Version**: `^18.2.0`
- **Purpose**: React rendering for web browsers
- **Documentation**: https://react.dev/reference/react-dom

### 2.2 Animation Libraries

#### GSAP (GreenSock Animation Platform)
- **Package**: `gsap`
- **Version**: `^3.12.4`
- **Purpose**: Professional-grade animation library
- **Plugins Used**: ScrollTrigger
- **Registration Required**: Must register plugins in each file
- **Documentation**: https://greensock.com/docs/

**Usage Pattern**:
```typescript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger); // Required in each file
```

#### Framer Motion
- **Package**: `framer-motion`
- **Version**: `^10.16.16`
- **Purpose**: React animation library for declarative animations
- **Documentation**: https://www.framer.com/motion/

**Note**: Use version 10.16.16+ (not 7.x as mentioned in some docs) for Next.js 14 compatibility.

#### Lenis Smooth Scroll
- **Package**: `@studio-freight/lenis`
- **Version**: `^1.0.0` (latest 1.x)
- **Purpose**: Buttery smooth scrolling
- **Documentation**: https://github.com/studio-freight/lenis

#### Three.js
- **Package**: `three`
- **Version**: Latest stable
- **Purpose**: 3D graphics library for WebGL-based black hole visualization
- **Type Definitions**: `@types/three`
- **Documentation**: https://threejs.org/docs/
- **Usage**: Used in BlackHoleAnimation component for physics-accurate 3D rendering

### 2.3 Utility Libraries

#### React Intersection Observer
- **Package**: `react-intersection-observer`
- **Version**: Latest stable
- **Purpose**: Alternative scroll trigger detection
- **Documentation**: https://github.com/thebuilder/react-intersection-observer

**Installation**:
```bash
npm install react-intersection-observer
```

#### React Use
- **Package**: `react-use`
- **Version**: Latest stable
- **Purpose**: Collection of essential React hooks
- **Documentation**: https://github.com/streamich/react-use

**Installation**:
```bash
npm install react-use
```

---

## 3. Development Dependencies

### 3.1 TypeScript

#### TypeScript Compiler
- **Package**: `typescript`
- **Version**: `^5.3.3`
- **Purpose**: Type safety, developer experience
- **Documentation**: https://www.typescriptlang.org/docs/

#### Type Definitions
- **Package**: `@types/node`
- **Version**: `^20.10.6`
- **Purpose**: Node.js type definitions

- **Package**: `@types/react`
- **Version**: `^18.2.46`
- **Purpose**: React type definitions

- **Package**: `@types/react-dom`
- **Version**: `^18.2.18`
- **Purpose**: React DOM type definitions

- **Package**: `@types/three`
- **Version**: Latest stable
- **Purpose**: Three.js type definitions for TypeScript support

### 3.2 Styling

#### Tailwind CSS
- **Package**: `tailwindcss`
- **Version**: `^3.4.0`
- **Purpose**: Utility-first CSS framework
- **Documentation**: https://tailwindcss.com/docs

#### PostCSS
- **Package**: `postcss`
- **Version**: `^8.4.32`
- **Purpose**: CSS processing and transformation
- **Documentation**: https://postcss.org/

#### Autoprefixer
- **Package**: `autoprefixer`
- **Version**: `^10.4.16`
- **Purpose**: Automatic vendor prefixing for CSS
- **Documentation**: https://github.com/postcss/autoprefixer

### 3.3 Code Quality

#### ESLint
- **Package**: `eslint`
- **Version**: `^8.56.0`
- **Purpose**: JavaScript/TypeScript linting
- **Documentation**: https://eslint.org/docs/

#### ESLint Config Next
- **Package**: `eslint-config-next`
- **Version**: `^14.0.4`
- **Purpose**: ESLint configuration for Next.js projects
- **Documentation**: https://nextjs.org/docs/basic-features/eslint

---

## 4. Testing Dependencies

### 4.1 Unit & Integration Testing

#### Jest
- **Package**: `jest`
- **Version**: Latest stable
- **Purpose**: JavaScript testing framework
- **Documentation**: https://jestjs.io/

**Installation**:
```bash
npm install --save-dev jest @types/jest
```

#### React Testing Library
- **Package**: `@testing-library/react`
- **Version**: Latest stable
- **Purpose**: Component testing library
- **Documentation**: https://testing-library.com/react

**Installation**:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### 4.2 End-to-End Testing

#### Playwright
- **Package**: `@playwright/test`
- **Version**: Latest stable
- **Purpose**: E2E testing, visual regression, browser automation
- **Documentation**: https://playwright.dev/

**Installation**:
```bash
npm install --save-dev @playwright/test
npx playwright install  # Install browser binaries
```

**Browsers Installed**:
- Chromium
- Firefox
- WebKit (Safari)

### 4.3 Accessibility Testing

#### Axe Core for Playwright
- **Package**: `@axe-core/playwright`
- **Version**: Latest stable
- **Purpose**: Automated accessibility testing
- **Documentation**: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright

**Installation**:
```bash
npm install --save-dev @axe-core/playwright
```

### 4.4 Visual Regression Testing (Optional)

#### Percy
- **Package**: `@percy/cli` and `@percy/playwright`
- **Purpose**: Visual regression testing service
- **Documentation**: https://docs.percy.io/

**Installation** (if needed):
```bash
npm install --save-dev @percy/cli @percy/playwright
```

#### Chromatic (Alternative)
- **Purpose**: Visual testing and review
- **Documentation**: https://www.chromatic.com/docs/

**Installation** (if needed):
```bash
npm install --save-dev chromatic
```

---

## 5. Build & Deployment Tools

### 5.1 Build Tools

#### Next.js Build System
- **Included with**: `next` package
- **Purpose**: Webpack-based bundling, optimization, static site generation
- **Commands**:
  ```bash
  npm run build    # Production build
  npm run dev      # Development server
  npm start        # Production server
  ```

#### TypeScript Compiler
- **Included with**: `typescript` package
- **Purpose**: Type checking and compilation
- **Command**:
  ```bash
  npm run type-check  # TypeScript validation
  ```

### 5.2 Deployment Platform

#### Render.com
- **Account Required**: Free tier available
- **Setup**: https://render.com/docs
- **Configuration**: Via `render.yaml` (already included)

**Requirements**:
- Git repository (GitHub, GitLab, or Bitbucket)
- `render.yaml` configuration file ✅ (included)
- Node.js 18+ runtime (automatic on Render)

#### GitHub Repository
- **Purpose**: Version control, deployment trigger
- **Setup**: https://github.com/

---

## 6. Development Tools

### 6.1 IDE / Code Editor

#### Cursor AI (Current)
- **Version**: Latest
- **Purpose**: AI-powered code editor based on VS Code
- **Configuration**: `.cursor/` directory (already configured)
- **Website**: https://cursor.sh/

#### VS Code (Alternative)
- **Version**: Latest stable
- **Purpose**: Source code editor
- **Website**: https://code.visualstudio.com/

**Recommended Extensions**:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens

### 6.2 Browser & DevTools

#### Chrome/Chromium
- **Version**: Latest stable
- **Purpose**: Primary development browser
- **DevTools**: Built-in

**Required Extensions**:
- **React Developer Tools**
  - Purpose: React component inspection
  - Link: https://chrome.google.com/webstore (search "React Developer Tools")

- **Axe DevTools**
  - Purpose: Accessibility testing
  - Link: https://www.deque.com/axe/devtools/

- **ColorZilla** (Optional)
  - Purpose: Color picker and analyzer
  - Link: https://chrome.google.com/webstore (search "ColorZilla")

#### Firefox Developer Edition (Optional)
- **Version**: Latest
- **Purpose**: Alternative development browser
- **Website**: https://www.mozilla.org/firefox/developer/

#### Safari (macOS)
- **Version**: Latest
- **Purpose**: WebKit testing (required for iOS compatibility)
- **DevTools**: Built-in (enable in Preferences > Advanced)

---

## 7. Optional Tools

### 7.1 Analytics

#### Google Analytics
- **Package**: `react-ga4` or `@next/third-parties`
- **Purpose**: Website analytics (optional)
- **Documentation**: https://analytics.google.com/

**Installation** (if needed):
```bash
npm install react-ga4
```

#### Plausible Analytics
- **Purpose**: Privacy-friendly analytics alternative
- **Documentation**: https://plausible.io/docs

### 7.2 Error Tracking

#### Sentry
- **Package**: `@sentry/nextjs`
- **Purpose**: Error tracking and monitoring (optional)
- **Documentation**: https://docs.sentry.io/platforms/javascript/guides/nextjs/

**Installation** (if needed):
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 7.3 Monitoring

#### Uptime Robot
- **Purpose**: Website uptime monitoring
- **Website**: https://uptimerobot.com/

#### Pingdom
- **Purpose**: Website performance monitoring
- **Website**: https://www.pingdom.com/

---

## 8. Installation Instructions

### 8.1 Complete Setup from Scratch

#### Step 1: System Prerequisites

```bash
# Verify Node.js
node --version  # Should be >= 18.0.0

# Verify npm
npm --version   # Should be >= 9.0.0

# Verify Git
git --version   # Should be >= 2.30.0
```

**If any verification fails, install missing tools using methods in Section 1.**

#### Step 2: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd chris-cole-website

# Or if starting from existing directory
cd /Users/Shared/cursor/chris-cole-website
```

#### Step 3: Install Core Dependencies

```bash
# Install all dependencies from package.json
npm install

# This installs:
# - next (14.0.4)
# - react (18.2.0)
# - react-dom (18.2.0)
# - framer-motion (10.16.16)
# - gsap (3.12.4)
# - three (latest stable)
# - All dev dependencies
```

**Alternative: Install Core Dependencies Explicitly**

If you need to install core dependencies individually:

```bash
# Install React and React DOM
npm install react react-dom

# Install Three.js and TypeScript types
npm install three @types/three
```

**Expected Output**:
```
added XXX packages in XXs
```

#### Step 4: Install Additional Utility Libraries

```bash
# Optional but recommended
npm install react-intersection-observer react-use
npm install @studio-freight/lenis
```

#### Step 5: Install Testing Dependencies

```bash
# Install all testing libraries
npm install --save-dev jest @types/jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test
npm install --save-dev @axe-core/playwright

# Install Playwright browsers
npx playwright install
```

#### Step 6: Configure Development Environment

```bash
# Initialize Tailwind CSS (if not already done)
npx tailwindcss init -p

# This creates:
# - tailwind.config.js ✅ (already exists)
# - postcss.config.js ✅ (already exists)
```

#### Step 7: Verify Installation

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Start development server
npm run dev

# Expected output:
# > next dev
# ▲ Next.js 14.0.4
# - Local:        http://localhost:3002
# - Network:      http://192.168.x.x:3002
```

**Note**: Frontend runs on port 3002, backend/API (if added) on port 3001.

---

## 9. Verification Commands

### 9.1 Dependency Verification

```bash
# Check all installed packages
npm list --depth=0

# Should show:
# ├── next@14.0.4
# ├── react@18.2.0
# ├── react-dom@18.2.0
# ├── framer-motion@10.16.16
# ├── gsap@3.12.4
# ├── typescript@5.3.3
# ├── tailwindcss@3.4.0
# ├── eslint@8.56.0
# └── ... (other dependencies)
```

### 9.2 Build Verification

```bash
# Production build test
npm run build

# Expected output:
# ▲ Next.js 14.0.4
# ✓ Creating an optimized production build
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

### 9.3 Type Checking

```bash
# TypeScript validation
npm run type-check

# Expected output: No errors
```

### 9.4 Linting

```bash
# ESLint validation
npm run lint

# Expected output:
# ✔ No ESLint warnings or errors
```

### 9.5 Test Execution

```bash
# Run all tests (when implemented)
npm run test

# Run specific test suites
npm run test:unit
npm run test:ui
npm run test:integration
npm run test:system
```

---

## 10. Troubleshooting

### 10.1 Common Issues

#### Issue: `npm install` fails with EACCES error

**Solution**:
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or reinstall Node.js with proper permissions
```

#### Issue: Node version mismatch

**Solution**:
```bash
# Check current version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Or update Node.js from nodejs.org
```

#### Issue: Playwright browsers not installed

**Solution**:
```bash
# Install Playwright browsers
npx playwright install

# Install system dependencies (Linux only)
npx playwright install-deps
```

#### Issue: Port 3002 already in use

**Solution**:
```bash
# Kill process on port 3002
lsof -ti:3002 | xargs kill -9

# Or use different port
PORT=3003 npm run dev
```

#### Issue: TypeScript errors after npm install

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

#### Issue: Tailwind styles not working

**Solution**:
```bash
# Verify tailwind.config.js content paths
# Should include: './src/**/*.{js,ts,jsx,tsx,mdx}'

# Rebuild CSS
npm run dev
```

### 10.2 Clean Installation

If you encounter persistent issues, perform a clean installation:

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Rebuild
npm run build
```

---

## 11. Dependency Update Policy

### 11.1 Version Locking

**Current Strategy**: Lock major and minor versions, allow patch updates

**package.json Syntax**:
- `^14.0.4`: Allow updates to 14.x.x (minor and patch)
- `~14.0.4`: Allow updates to 14.0.x (patch only)
- `14.0.4`: Exact version (no updates)

### 11.2 Update Commands

```bash
# Check for outdated packages
npm outdated

# Update all packages (respecting semver)
npm update

# Update specific package
npm update <package-name>

# Update to latest (breaking changes possible)
npm install <package-name>@latest
```

### 11.3 Security Audits

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix with breaking changes (use cautiously)
npm audit fix --force
```

---

## 12. Environment-Specific Dependencies

### 12.1 Development Environment

**Already Installed**:
- TypeScript (type checking)
- ESLint (linting)
- Tailwind CSS (styling)
- Jest (unit testing)
- Playwright (E2E testing)

**Required Tools**:
- Cursor AI or VS Code
- Chrome/Firefox with DevTools
- Git

### 12.2 CI/CD Environment

**Required**:
- Node.js 18+
- npm 9+
- Git

**Optional**:
- GitHub Actions (for automated testing)
- Render.com build environment (automatic)

### 12.3 Production Environment

**Provided by Render.com**:
- Node.js 18+ runtime ✅
- npm package manager ✅
- Build environment ✅
- CDN for static assets ✅
- HTTPS/SSL certificates ✅

**No Additional Installation Required**

---

## 13. Font Dependencies

### 13.1 Google Fonts

#### Space Grotesk
- **Source**: Google Fonts (https://fonts.google.com/specimen/Space+Grotesk)
- **Loading Method**: next/font/google
- **Weights**: 300, 400, 500, 600, 700
- **Subsets**: latin
- **Display Strategy**: swap (show fallback immediately)
- **Preload**: true (critical font)

**Implementation**:
```typescript
// src/app/fonts.ts
import { Space_Grotesk } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
});
```

**Original Site Used**: Adobe Typekit (kit ID: uti0eci)  
**Replica Uses**: Google Fonts (Space Grotesk) - free, reliable alternative

#### Courier New (System Font)
- **Source**: System font (no installation needed)
- **Purpose**: Monospace text, technical elements
- **Fallback**: Courier, monospace

---

## 14. Asset Dependencies

### 14.1 SVG Assets Required

**Location**: `public/svg/`

**Critical Assets** (Must have before development):
- `satellite.svg` - Hero section satellite icon
- `icon-web.svg` - WEB specialty icon
- `icon-branding.svg` - BRANDING specialty icon
- `icon-product.svg` - PRODUCT specialty icon
- `icon-packaging.svg` - PACKAGING specialty icon
- `icon-cocktails.svg` - COCKTAILS specialty icon
- `spaceship.svg` - Drifting background animation

**Optional Assets**:
- `film-reel.svg` - Work section indicator
- `constellation.svg` - Decorative pattern
- Social media icons (LinkedIn, Twitter, etc.)

**Asset Sources**:
1. Extract from original site (if accessible)
2. Recreate based on screenshots
3. Use similar open-source icons

### 14.2 Image Assets

**Location**: `public/assets/images/`

**Required**:
- Project thumbnails (Work section)
- Sketch gallery images (Sketches section)
- About section portrait (optional)

**Formats**:
- WebP (preferred for web optimization)
- PNG (fallback)
- SVG (for vector graphics)

**Optimization Tools**:
- Next.js Image component (automatic optimization)
- SVGO (SVG optimization)
- ImageOptim or similar

---

## 15. Complete Package.json Reference

### 15.1 Current Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.16",
    "gsap": "^3.12.4",
    "three": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "@types/three": "latest",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 15.2 Recommended Additional Dependencies

```json
{
  "dependencies": {
    "@studio-freight/lenis": "^1.0.0",
    "react-intersection-observer": "^9.5.3",
    "react-use": "^17.4.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@axe-core/playwright": "^4.8.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0"
  }
}
```

---

## 16. Dependency Installation Checklist

### Pre-Development Checklist

- [ ] Node.js >= 18.0.0 installed
- [ ] npm >= 9.0.0 installed
- [ ] Git >= 2.30.0 installed
- [ ] Cursor AI or VS Code installed
- [ ] Chrome/Firefox with DevTools installed
- [ ] React Developer Tools extension installed
- [ ] Axe DevTools extension installed

### Core Dependencies Checklist

- [ ] `next@14.0.4` installed
- [ ] `react@18.2.0` installed
- [ ] `react-dom@18.2.0` installed
- [ ] `framer-motion@10.16.16` installed
- [ ] `gsap@3.12.4` installed
- [ ] `three` installed
- [ ] `@types/three` installed

**Installation Command**:
```bash
npm install three @types/three react react-dom
```

### Development Dependencies Checklist

- [ ] `typescript@5.3.3` installed
- [ ] `@types/node` installed
- [ ] `@types/react` installed
- [ ] `@types/react-dom` installed
- [ ] `@types/three` installed
- [ ] `tailwindcss@3.4.0` installed
- [ ] `postcss@8.4.32` installed
- [ ] `autoprefixer@10.4.16` installed
- [ ] `eslint@8.56.0` installed
- [ ] `eslint-config-next@14.0.4` installed

### Optional Dependencies Checklist

- [ ] `@studio-freight/lenis` installed
- [ ] `react-intersection-observer` installed
- [ ] `react-use` installed

### Testing Dependencies Checklist

- [ ] `jest` installed
- [ ] `@testing-library/react` installed
- [ ] `@testing-library/jest-dom` installed
- [ ] `@playwright/test` installed
- [ ] `@axe-core/playwright` installed
- [ ] Playwright browsers installed (`npx playwright install`)

### Asset Dependencies Checklist

- [ ] `satellite.svg` obtained/created
- [ ] 5 specialty icons obtained/created
- [ ] `spaceship.svg` obtained/created
- [ ] Project images prepared
- [ ] Sketch gallery images prepared

### Configuration Checklist

- [ ] `tsconfig.json` configured ✅
- [ ] `tailwind.config.js` configured ✅
- [ ] `postcss.config.js` configured ✅
- [ ] `next.config.js` configured ✅
- [ ] `.eslintrc.json` configured ✅
- [ ] `render.yaml` configured ✅

### Verification Checklist

- [ ] `npm run dev` works
- [ ] `npm run build` succeeds
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] All dependencies listed in `npm list --depth=0`
- [ ] No security vulnerabilities (`npm audit`)

---

## 17. Additional Resources

### Documentation Links

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **GSAP**: https://greensock.com/docs/
- **Framer Motion**: https://www.framer.com/motion/
- **Playwright**: https://playwright.dev/
- **Jest**: https://jestjs.io/
- **Render.com**: https://render.com/docs

### Package Registries

- **npm**: https://www.npmjs.com/
- **GitHub Packages**: https://github.com/features/packages

### Community Resources

- **Next.js Discord**: https://nextjs.org/discord
- **React Community**: https://react.dev/community
- **TypeScript Community**: https://www.typescriptlang.org/community
- **Stack Overflow**: https://stackoverflow.com/ (tag: nextjs, react, typescript)

---

## Document Status

**Status**: ✅ **COMPLETE**  
**Version**: 1.0.0  
**Last Updated**: November 11, 2025  
**Total Dependencies**: 15+ core, 10+ dev, 10+ testing, 5+ optional  
**Next Review**: After dependency updates or version changes

**Maintained By**: Development Team  
**Contact**: [Project repository issues]

---

**END OF DEPENDENCIES DOCUMENTATION**

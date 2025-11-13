# Project Structure Overview

## 📁 Complete Directory Structure

```
chris-cole-website/
│
├── .cursor/                         # Cursor AI Configuration
│   ├── commands/
│   │   └── fix-errors.md           # Repeat-until-green error fixing loop
│   ├── memory-bank/
│   │   ├── currentTaskContext.md   # Current task error trail
│   │   ├── progressTracking.md     # Progress tracking & verification
│   │   ├── projectContext.md       # Project context memory
│   │   └── technicalArchitecture.md # Technical architecture notes
│   ├── rules/
│   │   └── guard-rails.mdc         # Guard-rails & constraints
│   └── worktrees.json              # Git worktree configuration
│
├── docs/                           # Project Documentation
│   ├── api/                        # API documentation
│   ├── architecture/               # Architecture documentation
│   ├── deployment/
│   │   └── DEPLOYMENT.md          # Deployment guide
│   ├── project-structure/
│   │   ├── DIRECTORY_TREE.txt     # Visual directory tree
│   │   ├── INDEX.md               # Quick navigation index
│   │   ├── PROJECT_STRUCTURE.md   # This file
│   │   └── START_HERE.md          # Getting started guide
│   ├── testing/
│   │   └── testing-strategy.md    # Testing strategy & approach
│   └── ui/                        # UI documentation
│
├── tests/                          # Test Suite (All Types)
│   ├── animation/                 # Animation tests
│   ├── integration/               # Integration tests
│   ├── logs/
│   │   ├── error-logs/           # Error logs from test runs
│   │   └── test-results/         # Test result logs
│   ├── system/                   # System/E2E tests
│   ├── ui/                       # UI/Component tests
│   └── unit/                     # Unit tests
│
├── user-docs/                      # User-Provided Documentation
│   ├── business-requirements.md   # Comprehensive business requirements
│   ├── Chris-Cole-Website-Analysis.pdf # Original site analysis
│   └── implementation-plan.md     # Implementation plan
│
├── public/                         # Static assets
│   ├── assets/
│   │   ├── images/                # Project images, photos
│   │   │   └── .gitkeep
│   │   ├── icons/                 # Custom icons
│   │   │   └── .gitkeep
│   │   └── favicon.ico            # Site favicon (add this)
│   └── robots.txt                 # SEO robots file (optional)
│
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── Navbar.tsx             # Navigation bar with mobile menu
│   │   ├── HeroSection.tsx        # Hero/landing section
│   │   ├── AboutSection.tsx       # About/bio section
│   │   ├── WorkGrid.tsx           # Portfolio grid container
│   │   ├── ProjectCard.tsx        # Individual project card
│   │   └── Footer.tsx             # Footer with contact info
│   │
│   ├── animations/                 # Animation utilities
│   │   ├── fadeInUp.ts            # Fade-in-up animation variants
│   │   ├── scrollTrigger.ts       # Scroll-triggered animations
│   │   └── cursorTrail.ts         # Custom cursor effects
│   │
│   ├── styles/                     # Styling files
│   │   ├── globals.css            # Global styles and utilities
│   │   └── tailwind.css           # Tailwind imports
│   │
│   └── pages/                      # Next.js pages
│       ├── index.tsx              # Home page (main landing)
│       ├── _app.tsx               # App wrapper (fonts, providers)
│       └── _document.tsx          # HTML document (meta tags)
│
├── node_modules/                   # Dependencies (auto-generated)
│
├── .next/                         # Next.js build output (auto-generated)
│
├── Configuration Files
├── package.json                    # Dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── next.config.js                 # Next.js configuration
├── .eslintrc.json                 # ESLint rules
├── .gitignore                     # Git ignore patterns
│
├── Root Documentation
├── README.md                       # Main project documentation
├── QUICKSTART.md                  # Quick start guide
│
└── Deployment
    └── render.yaml                # Render.com configuration

```

## 📄 File Descriptions

### Core Files

#### `package.json`
Project configuration with dependencies and npm scripts.
- **Dependencies**: React, Next.js, Framer Motion, etc.
- **Scripts**: dev, build, start, lint, type-check

#### `tsconfig.json`
TypeScript compiler configuration.
- **Target**: ES2020
- **Path aliases**: `@/` for cleaner imports
- **Strict mode**: Enabled for type safety

#### `tailwind.config.js`
Tailwind CSS customization.
- **Colors**: Primary and accent color schemes
- **Fonts**: Custom font families
- **Animations**: Custom keyframes and transitions

#### `next.config.js`
Next.js framework configuration.
- **Output**: Standalone for Render deployment
- **Optimization**: Compression, minification
- **Environment**: Production settings

### Source Files

#### Components (`src/components/`)

**`Navbar.tsx`**
- Fixed navigation bar
- Responsive mobile menu
- Smooth scroll links
- Scroll-based styling changes

**`HeroSection.tsx`**
- Full-screen hero
- Animated gradient background
- Call-to-action buttons
- Scroll indicator

**`AboutSection.tsx`**
- Personal bio section
- Skills grid with animations
- Scroll-triggered entry animations

**`WorkGrid.tsx`**
- Portfolio project container
- Responsive grid layout
- Project data management

**`ProjectCard.tsx`**
- Individual project display
- Hover animations
- Tag display
- External links

**`Footer.tsx`**
- Contact information
- Social media links
- Copyright notice

#### Animations (`src/animations/`)

**`fadeInUp.ts`**
- Framer Motion variants
- Fade-in-up animation
- Stagger children animations

**`scrollTrigger.ts`**
- Scroll-based animation triggers
- IntersectionObserver hooks
- GSAP configuration helpers

**`cursorTrail.ts`**
- Custom cursor tracking
- Interactive cursor effects
- Hover state management

#### Pages (`src/pages/`)

**`index.tsx`**
- Main landing page
- Assembles all components
- SEO meta tags

**`_app.tsx`**
- Next.js app wrapper
- Global font configuration
- Provider setup

**`_document.tsx`**
- HTML document structure
- Meta tags and SEO
- Font preloading

#### Styles (`src/styles/`)

**`globals.css`**
- Global CSS styles
- Tailwind directives
- Custom utility classes
- Component styles

**`tailwind.css`**
- Tailwind base imports
- Layer organization

### Public Assets (`public/`)

**`assets/images/`**
Add your project images here:
- Project screenshots
- Illustrations
- Background images
- Profile photos

**`assets/icons/`**
Add custom icons:
- SVG icons
- Icon fonts
- Favicons

### Documentation Files

**`README.md`**
- Project overview
- Installation instructions
- Features and tech stack
- Deployment guide

**`DEPLOYMENT.md`**
- Detailed deployment steps
- Render.com configuration
- Troubleshooting guide
- Post-deployment checklist

**`QUICKSTART.md`**
- Quick setup guide
- Common customizations
- Development tips
- Testing instructions

**`business-requirements.md`**
- Project goals
- Target audience
- Feature requirements
- Success metrics

### Deployment Configuration

**`render.yaml`**
- Render.com blueprint
- Build and start commands
- Environment variables
- Service configuration

### Testing Infrastructure (`tests/`)

**`tests/unit/`**
- Unit tests for individual functions
- Test pure logic and utilities
- Fast execution, isolated tests

**`tests/ui/`**
- Component rendering tests
- User interaction tests  
- Visual regression tests (when added)

**`tests/animation/`**
- Animation behavior verification
- Timing and easing tests
- GSAP/Framer Motion integration tests

**`tests/integration/`**
- Multi-component interaction tests
- Data flow tests
- API integration tests (if applicable)

**`tests/system/`**
- End-to-end tests
- Full user journey tests
- Cross-browser compatibility tests

**`tests/logs/`**
- `error-logs/`: Failed test error traces
- `test-results/`: Test execution summaries

### Cursor AI Configuration (`.cursor/`)

**`.cursor/commands/fix-errors.md`**
- Repeat-until-green error fixing loop
- Systematic debugging workflow
- Test-driven error resolution

**`.cursor/rules/guard-rails.mdc`**
- Development constraints and policies
- Code quality gates
- Anti-patterns to avoid
- Ensures production-grade code

**`.cursor/memory-bank/`**
- `currentTaskContext.md`: Active task error trail with symptom, root cause, fix summary
- `progressTracking.md`: Progress verification and completion tracking
- `projectContext.md`: Project-wide context and decisions
- `technicalArchitecture.md`: Architecture patterns and technical notes

### User Documentation (`user-docs/`)

**`business-requirements.md`**
- Comprehensive business requirements (17,000+ lines)
- Complete specification for hellochriscole.webflow.io replica
- Visual design, animations, technical requirements
- 16 major sections covering all aspects

**`Chris-Cole-Website-Analysis.pdf`**
- Original site analysis document
- Animation inventory
- Design breakdown
- Implementation guidance

**`implementation-plan.md`**
- Phased implementation plan
- Task breakdown and sequencing
- Resource allocation

## 🎯 Key Patterns

### Component Structure
```typescript
// Standard component pattern
'use client';                    // Client component directive
import React from 'react';       // React import
import { motion } from 'framer-motion';  // Animation library

const ComponentName: React.FC = () => {
  // Component logic
  return (
    <section>
      {/* JSX */}
    </section>
  );
};

export default ComponentName;
```

### Animation Pattern
```typescript
// Animation variants
const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Apply to motion component
<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
/>
```

### Styling Pattern
```typescript
// Tailwind classes with responsive design
<div className="section-container py-20 md:py-32">
  <h1 className="heading-primary mb-6">Title</h1>
  <p className="text-body max-w-2xl">Content</p>
</div>
```

## 🔄 Data Flow

```
User Browser
    ↓
index.tsx (Main Page)
    ↓
├── Navbar
├── HeroSection
├── WorkGrid
│   └── ProjectCard (multiple)
├── AboutSection
└── Footer
    ↓
Components use:
├── Animation utilities (fadeInUp, scrollTrigger)
├── Global styles (globals.css)
└── Tailwind classes (tailwind.config.js)
```

## 🚀 Build Process

```
Development:
npm run dev → Next.js dev server → Hot reload

Production:
npm run build → TypeScript compile → Next.js optimize → Static generation
npm start → Production server → Serve optimized bundle
```

## 📝 Customization Points

1. **Colors**: `tailwind.config.js` → theme.extend.colors
2. **Content**: Component files → Update text and data
3. **Images**: `public/assets/images/` → Add your images
4. **Fonts**: `src/pages/_app.tsx` → Import Google Fonts
5. **Animations**: `src/animations/` → Modify animation variants
6. **Meta Tags**: `src/pages/_document.tsx` → Update SEO

## 🧪 Quality Assurance & Testing

### Testing Strategy

**Test Pyramid**:
```
                    /\
                   /  \        System Tests (E2E)
                  /____\       
                 /      \      Integration Tests
                /________\     
               /          \    UI Component Tests
              /__unit_____\    Unit Tests
```

**Test Types**:
- **Unit Tests** (`tests/unit/`): Individual function testing
- **UI Tests** (`tests/ui/`): Component rendering and interaction
- **Animation Tests** (`tests/animation/`): Animation behavior verification
- **Integration Tests** (`tests/integration/`): Multi-component interactions
- **System Tests** (`tests/system/`): End-to-end user journeys

### Cursor AI Workflow

**Fix-Errors Command** (`.cursor/commands/fix-errors.md`):
1. Parse failures → Rank by criticality
2. Root-cause & impact trace
3. Minimal, targeted fix plan
4. Implement fix + adjust tests
5. Verify: UI script, tests, typecheck, lint, build
6. Research pass if error persists ≥3 attempts
7. Append error trail to memory-bank

**Guard-Rails** (`.cursor/rules/guard-rails.mdc`):
- ✅ Touch only code implicated by failing tests/errors
- ✅ Align strictly with `/docs/` directory documentation
- ✅ No duplicate/unnecessary file creation
- ✅ No mocks/placeholders/fallbacks in runtime code
- ✅ Maintain error trail in `.cursor/memory-bank/`
- ✅ Production-grade changes only (no fake green)
- ✅ Research escalation after 3 failed attempts

**Memory Bank** (`.cursor/memory-bank/`):
- **currentTaskContext.md**: Error trail with symptom, root cause, fix
- **progressTracking.md**: Task progress and verification evidence
- **projectContext.md**: Project-wide decisions and context
- **technicalArchitecture.md**: Architecture patterns and notes

### Quality Gates

**Pre-Commit Checks**:
```bash
npm run type-check   # TypeScript validation
npm run lint         # ESLint code quality
npm run build        # Production build succeeds
```

**Pre-Deployment Checks**:
- ✅ All tests passing
- ✅ No console errors in browser
- ✅ TypeScript compiles without errors
- ✅ ESLint shows no warnings
- ✅ Production build successful
- ✅ No runtime mocks or placeholders
- ✅ Performance metrics meet targets (Lighthouse 90+)

### Test Logs

**Location**: `tests/logs/`
- **error-logs/**: Detailed error traces from failed test runs
- **test-results/**: Test execution summaries with pass/fail stats

**Log Format**:
- Date-stamped files (YYYY-MM-DD)
- Symptom description
- Root cause analysis
- Fix applied
- Verification evidence

## 📊 Project Metrics

**Codebase Statistics**:
- Total Files: 50+
- Source Code: ~1,500 lines (TypeScript/TSX)
- Documentation: ~18,500 lines (including business requirements)
- Configuration: ~150 lines
- Test Coverage: TBD (tests to be implemented)

**Documentation Coverage**:
- Business Requirements: ✅ Complete (17,000+ lines)
- Technical Architecture: ✅ Complete
- API Documentation: 🔄 In Progress
- Testing Strategy: ✅ Complete
- Deployment Guide: ✅ Complete

---

**Structure Status**: ✅ Complete with Testing Infrastructure and Quality Gates


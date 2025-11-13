# BlackHole Animation Visual Regression Testing

## Overview
This directory contains visual regression tests for the BlackHole animation in the BTR section.

## Test Files
- `blackhole-animation.visual.test.ts` - Main test suite for BlackHole animation validation

## Directory Structure
```
tests/visual-regression/
├── blackhole-animation.visual.test.ts  # Test suite
├── reference-images/                   # Reference images for comparison
│   └── blackhole-reference.png        # Expected BlackHole animation appearance
├── screenshots/                        # Test-generated screenshots
│   ├── blackhole-current-*.png        # Current animation screenshots
│   └── blackhole-diff-*.png           # Pixel difference visualizations
└── reports/                           # Generated test reports
    └── blackhole-discrepancy-report.md # Detailed analysis report
```

## Reference Image Setup

The reference image (`blackhole-reference.png`) represents the expected visual appearance of the BlackHole animation with the following characteristics:

### Expected Features
1. **Event Horizon** - Central perfectly black circle
2. **Photon Sphere** - Bright white ring(s) around the event horizon
3. **Accretion Disk** - Swirling particles in elliptical orbits
4. **Spacetime Grid** - Warped grid lines showing gravitational distortion
5. **Gravitational Lensing** - Light bending effects around the black hole
6. **Relativistic Jets** - Optional particle streams perpendicular to disk

### Theme Requirements
- **Monochromatic**: Only black, white, and gray colors
- **High Contrast**: Strong separation between dark and light areas
- **Smooth Gradients**: Professional gradient transitions
- **Realistic Physics**: Scientifically accurate representation

## Running Tests

### Install Dependencies
```bash
npm install --save-dev pixelmatch pngjs @types/pixelmatch @types/pngjs @playwright/test
```

### Start Development Server
```bash
npm run dev
```

### Run Visual Regression Test
```bash
npx playwright test tests/visual-regression/blackhole-animation.visual.test.ts --headed
```

### Generate Report
The test automatically generates a comprehensive discrepancy report at:
```
tests/visual-regression/reports/blackhole-discrepancy-report.md
```

## Initial Reference Image Setup

To create the initial reference image from the provided design:

1. Place the reference image file at: `tests/visual-regression/reference-images/blackhole-reference.png`
2. Run the test once to capture current state
3. Review generated screenshots and diff images
4. Adjust animation parameters if needed
5. Re-run tests until discrepancies are minimal

## Test Metrics

The test suite validates:

### Visual Metrics
- Pixel-perfect comparison (< 5% difference allowed)
- Color distribution (black/white/gray percentages)
- Brightness levels and gradients
- Feature presence (horizon, sphere, disk, grid)

### Theme Compliance
- Monochromatic color scheme verification
- No colored pixels (> 1% tolerance for anti-aliasing)
- Pure black background (RGB 0,0,0)
- Proper contrast levels

### Animation Quality
- Canvas dimensions
- Proper element positioning
- Animation smoothness (60fps target)
- No rendering artifacts

## Interpreting Results

### Discrepancy Severity Levels

- **🔴 Critical**: Must fix before deployment
  - Non-monochromatic colors detected
  - Missing event horizon or photon sphere
  - Major visual inconsistencies

- **🟡 Major**: Should fix soon
  - Insufficient particle effects
  - Missing expected features
  - Notable visual differences

- **🔵 Minor**: Polish when possible
  - Slight gradient differences
  - Minor parameter tweaks needed
  - Acceptable visual variations

### Success Criteria
✅ Zero critical issues
✅ Fewer than 2 major issues
✅ Pixel difference < 5%
✅ All theme requirements met

## Troubleshooting

### Reference Image Not Found
If you get "Reference image not found" warning:
1. Capture a current screenshot during test execution
2. Review the screenshot quality
3. If acceptable, copy it to reference images:
   ```bash
   cp tests/visual-regression/screenshots/blackhole-current-*.png \
      tests/visual-regression/reference-images/blackhole-reference.png
   ```

### High Pixel Difference
If pixel difference exceeds 5%:
1. Check animation timing (may need longer wait)
2. Review canvas dimensions
3. Verify all animation features are rendering
4. Check for console errors
5. Ensure server is fully ready

### Theme Violations
If monochromatic theme violations detected:
1. Review BlackHoleAnimation.tsx gradients
2. Check for unintended colored particles
3. Verify all RGB values are equal (grayscale)
4. Remove any non-monochrome effects

## Maintenance

- Update reference images when intentional design changes occur
- Re-run tests after any animation parameter adjustments
- Keep screenshots for historical comparison
- Archive old reports for regression tracking
- Document any threshold adjustments

## Related Documentation
- `/docs/testing/testing-strategy.md` - Overall testing approach
- `/src/components/animations/BlackHoleAnimation.tsx` - Animation implementation
- `/src/components/sections/BTRSection.tsx` - Section integration

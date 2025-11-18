# BTR Web Application - Comprehensive UAT Plan

## Overview

Execute systematic end-to-end UAT for the BTR (Birth Time Rectification) web application, verifying complete data flow from UI inputs through API to results display, fixing all errors and ensuring production readiness.

## Current Implementation State

- **Frontend**: React + TypeScript (Vite) - 3-step form (Mandatory → Optional → Review)
- **Backend**: FastAPI (Python) - Port 8000
- **API Endpoints**: `/api/geocode`, `/api/btr`
- **Form Steps**: 

1. Mandatory Info (DoB, PoB, Timezone, ToB mode)
2. Optional Verification (Physical traits, Life events)
3. Review & Submit

## Phase 0: Environment Setup & Configuration

### 0.1 Backend Setup

- [ ] Verify Python 3.10+ and dependencies installed
- [ ] Create/verify `.env` file with `OPENCAGE_API_KEY=d2d47cd822ee4804bb389d742e5c1c0d`
- [ ] Start backend server: `uvicorn backend.main:app --reload`
- [ ] Verify backend accessible at `http://127.0.0.1:8000`
- [ ] Test `/api/geocode?q=test` endpoint directly
- [ ] Check backend logs for errors/warnings

### 0.2 Frontend Setup

- [ ] Navigate to `frontend-react/` directory
- [ ] Run `npm install` if needed
- [ ] Start dev server: `npm run dev`
- [ ] Verify frontend accessible at `http://127.0.0.1:3000` or `http://127.0.0.1:5173` (Vite default)
- [ ] Check Vite proxy configuration for `/api` → `http://localhost:8000`

### 0.3 Browser DevTools Configuration

- [ ] Open browser DevTools (F12)
- [ ] Enable Network tab monitoring
- [ ] Enable Console tab for error tracking
- [ ] Clear console and network logs before each test

## Phase 1: Step-by-Step UAT - Mandatory Info Page

### 1.1 UI Input Integrity Testing

**Test Scenario 1.1.1: Minimal Required Input**

- [ ] Navigate to `http://127.0.0.1:3000` (or appropriate port)
- [ ] Verify form loads with Step 1 (Mandatory Info) visible
- [ ] Fill Date of Birth: `1990-05-15` (YYYY-MM-DD format)
- [ ] Fill Place of Birth: `Sialkot, Pakistan`
- [ ] Verify geocoding triggers (debounced after 1 second)
- [ ] Verify geocoding status indicator appears
- [ ] Verify geocoding success shows formatted address + lat/lon
- [ ] Select Timezone: `Asia/Karachi (UTC+5)` (default)
- [ ] Select ToB Mode: `Unknown (full 24h search)`
- [ ] Verify all inputs persist when navigating away and back
- [ ] Click "Next: Optional Verification →"
- [ ] Verify validation passes and moves to Step 2

**Test Scenario 1.1.2: Approximate Time Mode**

- [ ] Reset form (refresh page)
- [ ] Fill DoB: `1985-08-20`
- [ ] Fill PoB: `Delhi, India`
- [ ] Verify geocoding succeeds
- [ ] Select ToB Mode: `Approximate Time`
- [ ] Verify additional fields appear (center time, ± hours)
- [ ] Set Center Time: `14:30`
- [ ] Set Window: `3.0` hours
- [ ] Verify time range preview shows: `11:30 to 17:30`
- [ ] Test edge cases:
- [ ] Window = 0.5 (minimum)
- [ ] Window = 12.0 (maximum)
- [ ] Invalid time format handling

**Test Scenario 1.1.3: Time Range Override**

- [ ] Set ToB Mode: `Unknown`
- [ ] Fill Override Start: `08:00`
- [ ] Fill Override End: `12:00`
- [ ] Verify time range preview displays
- [ ] Test validation: Start < End (should pass)
- [ ] Test validation: Start >= End (should show alert)
- [ ] Test edge case: `00:00` to `23:59` (full day)

**Test Scenario 1.1.4: Custom Timezone**

- [ ] Select Timezone: `Custom Offset`
- [ ] Verify custom offset input appears
- [ ] Set custom offset: `-5.0` (America/New_York)
- [ ] Verify value persists
- [ ] Test negative, positive, and fractional offsets

**Test Scenario 1.1.5: Geocoding Edge Cases**

- [ ] Test invalid place: `xyz123nonexistent`
- [ ] Verify error message displays gracefully
- [ ] Verify form allows submission with warning confirmation
- [ ] Test very short input: `ab` (should not trigger geocoding)
- [ ] Test geocoding timeout handling

### 1.2 UI → API Mapping Verification

**For each test scenario above:**

- [ ] Open Network tab before clicking "Next" or "Calculate"
- [ ] Intercept `/api/btr` POST request
- [ ] Verify request payload structure matches `BTRRequest` type:
- [ ] `dob`: string (YYYY-MM-DD)
- [ ] `pob_text`: string
- [ ] `tz_offset_hours`: number
- [ ] `approx_tob.mode`: "unknown" | "approx"
- [ ] `approx_tob.center`: string | null (HH:MM format)
- [ ] `approx_tob.window_hours`: number | null
- [ ] `time_range_override`: object | null
- [ ] Verify field values match UI inputs exactly
- [ ] Verify types are correct (numbers as numbers, not strings)
- [ ] Document any mapping mismatches

### 1.3 Validation Testing

- [ ] Test empty DoB → should show alert
- [ ] Test invalid DoB format → should show alert
- [ ] Test future DoB → should show alert
- [ ] Test empty PoB → should show alert
- [ ] Test invalid time range (start >= end) → should show alert
- [ ] Verify all validation messages are user-friendly

## Phase 2: Step-by-Step UAT - Optional Verification Page

### 2.1 UI Input Integrity Testing

**Test Scenario 2.1.1: Physical Traits Only**

- [ ] From Step 1, proceed to Step 2
- [ ] Set Height: `TALL`
- [ ] Set Build: `ATHLETIC`
- [ ] Set Complexion: `WHEATISH`
- [ ] Verify all dropdowns work correctly
- [ ] Verify "Not specified" option works
- [ ] Click "Next: Review & Submit →"
- [ ] Verify data persists

**Test Scenario 2.1.2: Life Events Only**

- [ ] Reset to Step 2
- [ ] Set Marriage Date: `2020-05-15`
- [ ] Set Children Count: `2`
- [ ] Verify child date inputs appear (2 inputs)
- [ ] Fill Child 1 Date: `2021-08-20`
- [ ] Fill Child 2 Date: `2023-03-10`
- [ ] Set Career Events: `2018-06-01, 2022-03-15`
- [ ] Verify comma-separated parsing works
- [ ] Test changing children count (increase/decrease)
- [ ] Verify date inputs adjust dynamically

**Test Scenario 2.1.3: All Optional Fields**

- [ ] Fill all physical traits
- [ ] Fill all life events
- [ ] Verify all fields persist
- [ ] Navigate back to Step 1, then forward again
- [ ] Verify all optional data is preserved

**Test Scenario 2.1.4: Empty Optional Fields**

- [ ] Leave all optional fields empty
- [ ] Verify form allows submission
- [ ] Verify API receives `null` for optional fields

### 2.2 UI → API Mapping Verification

- [ ] Intercept `/api/btr` request from Review page
- [ ] Verify `optional_traits` structure:
- [ ] `height`: string | undefined
- [ ] `build`: string | undefined
- [ ] `complexion`: string | undefined
- [ ] Verify `optional_events` structure:
- [ ] `marriage.date`: string | undefined
- [ ] `children.count`: number
- [ ] `children.dates`: string[]
- [ ] `career`: string[]
- [ ] Verify empty optional fields send `null` (not empty objects)
- [ ] Verify partial optional data sends only filled fields

## Phase 3: Step-by-Step UAT - Review & Submit Page

### 3.1 Review Display Verification

- [ ] Verify all mandatory fields displayed correctly
- [ ] Verify all optional fields displayed (if filled)
- [ ] Verify field labels match input labels
- [ ] Verify date formats are readable
- [ ] Verify timezone display is clear
- [ ] Verify ToB mode description is accurate
- [ ] Test "← Back" button returns to Step 2
- [ ] Verify data persists when going back and forward

### 3.2 API → UI Mapping Verification

- [ ] Click "Calculate BTR" button
- [ ] Verify loading spinner appears
- [ ] Monitor Network tab for `/api/btr` response
- [ ] Verify response structure matches `BTRResponse` type:
- [ ] `engine_version`: string
- [ ] `geocode`: object with lat, lon, formatted
- [ ] `search_config`: object
- [ ] `candidates`: array
- [ ] `best_candidate`: object | null
- [ ] `notes`: string | null
- [ ] Verify response status is 200 (not 4xx/5xx)
- [ ] Check backend logs for any errors

### 3.3 Results Display Verification

- [ ] Verify results page replaces form
- [ ] Verify candidate list displays
- [ ] Verify best candidate is highlighted
- [ ] Verify all candidate fields display:
- [ ] Time (local)
- [ ] Lagna degrees
- [ ] Pranapada degrees
- [ ] Scores
- [ ] Special lagnas
- [ ] Nisheka data
- [ ] Verify methodology notes display
- [ ] Test "New Calculation" button resets form

## Phase 4: Full End-to-End Flow Testing

### 4.1 Minimal Data Flow

- [ ] Complete flow with only mandatory fields:
- [ ] DoB: `1990-05-15`
- [ ] PoB: `Mumbai, India`
- [ ] Timezone: Default
- [ ] ToB: Unknown
- [ ] Skip all optional fields
- [ ] Submit and verify results appear
- [ ] Verify no console errors
- [ ] Verify no network errors
- [ ] Verify backend processes request successfully

### 4.2 Complete Data Flow

- [ ] Complete flow with all fields filled:
- [ ] All mandatory fields
- [ ] All physical traits
- [ ] All life events (marriage, children, career)
- [ ] Submit and verify enhanced scoring appears
- [ ] Verify physical_traits_scores in response
- [ ] Verify life_events_scores in response
- [ ] Verify composite_score includes all factors

### 4.3 Navigation Flow

- [ ] Test forward navigation: Step 1 → 2 → 3
- [ ] Test backward navigation: Step 3 → 2 → 1
- [ ] Verify data persists at each step
- [ ] Test direct form submission from Step 1 (should validate)
- [ ] Test form submission from Step 2 (should validate mandatory)

## Phase 5: Error Detection & Fixing

### 5.1 Browser Console Errors

- [ ] Keep Console tab open during all tests
- [ ] Document all JavaScript errors
- [ ] Document all React warnings
- [ ] Document unhandled promise rejections
- [ ] Fix each error:
- [ ] Identify root cause (frontend code)
- [ ] Fix the issue
- [ ] Reload and re-test
- [ ] Verify error is resolved

### 5.2 Network Errors

- [ ] Monitor Network tab for:
- [ ] Failed requests (4xx/5xx)
- [ ] CORS errors
- [ ] Timeout errors
- [ ] Geocoding API errors
- [ ] Fix each error:
- [ ] Check backend logs
- [ ] Fix backend code if needed
- [ ] Fix frontend error handling if needed
- [ ] Re-test and verify

### 5.3 Backend Runtime Errors

- [ ] Monitor backend server logs
- [ ] Document stack traces
- [ ] Document validation errors
- [ ] Fix each error:
- [ ] Check Pydantic model validation
- [ ] Check Swiss Ephemeris calculations
- [ ] Check geocoding integration
- [ ] Re-test and verify

## Phase 6: Linter & Type Checking

### 6.1 Frontend Linting

- [ ] Run `npm run lint` in `frontend-react/`
- [ ] Document all ESLint errors/warnings
- [ ] Fix each issue:
- [ ] Code style issues
- [ ] React hooks violations
- [ ] TypeScript type errors
- [ ] Re-run lint until clean (or document justified exceptions)

### 6.2 Frontend Type Checking

- [ ] Run `npx tsc --noEmit` in `frontend-react/`
- [ ] Document all type errors
- [ ] Fix type mismatches:
- [ ] API response types
- [ ] Component prop types
- [ ] State types
- [ ] Re-run until clean

### 6.3 Backend Linting (if configured)

- [ ] Run `ruff check backend/` (if available)
- [ ] Run `mypy backend/` (if available)
- [ ] Fix issues or document exceptions

## Phase 7: Geocoding & External API Testing

### 7.1 OpenCage API Integration

- [ ] Verify API key is set correctly
- [ ] Test geocoding with various places:
- [ ] `Sialkot, Pakistan` (should succeed)
- [ ] `New York, NY` (should succeed)
- [ ] `London, UK` (should succeed)
- [ ] `xyz123invalid` (should fail gracefully)
- [ ] Verify error handling:
- [ ] UI shows clear error message
- [ ] Form allows submission with confirmation
- [ ] Backend handles geocoding failures

### 7.2 Geocoding in BTR Request

- [ ] Submit BTR request with valid place
- [ ] Verify backend calls geocoding API
- [ ] Verify coordinates used in calculations
- [ ] Verify geocode result included in response

## Phase 8: Edge Cases & Boundary Testing

### 8.1 Date Edge Cases

- [ ] Test very old date: `1900-01-01`
- [ ] Test recent date: `2020-01-01`
- [ ] Test leap year: `2000-02-29`
- [ ] Test invalid date formats

### 8.2 Time Range Edge Cases

- [ ] Test midnight crossing: `23:00` to `01:00`
- [ ] Test very narrow window: `12:00` ± 0.5 hours
- [ ] Test very wide window: `12:00` ± 12 hours
- [ ] Test exact time: `12:00` ± 0 hours (if allowed)

### 8.3 Timezone Edge Cases

- [ ] Test UTC+0
- [ ] Test UTC-12 (extreme negative)
- [ ] Test UTC+14 (extreme positive)
- [ ] Test fractional timezones: `5.5`, `-3.5`

## Phase 9: Documentation & Completion

### 9.1 UAT Documentation

- [ ] Create `docs/uat-btr-ui.md` with test results table:
- [ ] Page/Step
- [ ] Scenario
- [ ] Status (✅/❌)
- [ ] Notes/Fixes
- [ ] Document all bugs found:
- [ ] Symptom
- [ ] Root cause
- [ ] Files changed
- [ ] Verification evidence

### 9.2 Completion Verification

- [ ] All form steps tested with 2+ scenarios each
- [ ] All UI → API mappings verified
- [ ] All API → UI mappings verified
- [ ] No JavaScript/React console errors
- [ ] No network errors (4xx/5xx)
- [ ] Frontend lint passes
- [ ] Frontend type check passes
- [ ] Full end-to-end flow works
- [ ] Geocoding works correctly
- [ ] All edge cases handled

## Success Criteria Checklist

- [ ] Every form step has at least 2 UAT scenarios executed and passed
- [ ] Every input field can be traced: UI control → JSON key → Backend model → UI display
- [ ] No JavaScript/React errors in browser console during normal usage
- [ ] `/api/btr` requests complete without 4xx/5xx errors in valid scenarios
- [ ] Frontend lint & type checks pass (or remaining issues explicitly documented)
- [ ] Full end-to-end user journey runs without blocking issues
- [ ] Geocoding correctly utilizes OpenCage API key
- [ ] Same input dataset produces consistent, stable outputs

## Notes

- Frontend runs on port 3000 (or 5173 if Vite default)
- Backend runs on port 8000
- Vite proxy configured for `/api` → `http://localhost:8000`
- Form has 3 steps (not 9 pages as mentioned in original prompt)
- All fixes must be production-ready (no mocks/placeholders)
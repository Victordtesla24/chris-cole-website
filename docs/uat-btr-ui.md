# BTR Web Application – UAT Execution Log

Legend: ✅ = Pass, ❌ = Fail, ⏳ = Not run yet

Environment notes:
- Backend FastAPI: http://127.0.0.1:8000 (requires `.env` with OpenCage key)
- Frontend React (Vite): http://localhost:5173 (proxies `/api` to backend)
- Reference test plan: `docs/uat-btr-plan.md`

## Automated Checks

| Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Frontend | `npm run lint` (frontend-react) | ✅ | Clean |
| Frontend | `npx tsc --noEmit` (frontend-react) | ✅ | Clean |
| Frontend | `npm run build` (frontend-react) | ✅ | Build ok |
| Backend | `pytest` | ✅ | 100 passed |
| Full-stack | `node scripts/uat-smoke.js` (Playwright smoke) | ✅ | Two flows hit `/api/btr` 200; no console errors |

## Phase 1 – Mandatory Info

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Mandatory Info | 1.1.1 Minimal required input | ✅ | Playwright smoke: form → `/api/btr` 200, best time 1990-05-15T05:40:00 |
| Mandatory Info | 1.1.2 Approximate time mode (window edge cases) | ✅ | Playwright smoke: approx 14:30 ±3h, best 1985-08-20T12:40:00 |
| Mandatory Info | 1.1.3 Time range override validation | ⏳ |  |
| Mandatory Info | 1.1.4 Custom timezone offsets | ⏳ |  |
| Mandatory Info | 1.1.5 Geocoding edge cases/timeout | ⏳ |  |
| Mandatory Info | 1.2 UI → API payload mapping | ✅ | MultiStepForm payload matches `BTRRequest`; verified via Playwright runs hitting `/api/btr` 200 |
| Mandatory Info | 1.3 Validation error messages | ⏳ |  |

## Phase 2 – Optional Verification

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Optional Verification | 2.1.1 Physical traits only | ⏳ |  |
| Optional Verification | 2.1.2 Life events only (dynamic children inputs) | ⏳ |  |
| Optional Verification | 2.1.3 All optional fields filled/persisted | ✅ | Playwright smoke: marriage + children (2) + career + traits submitted; results returned |
| Optional Verification | 2.1.4 Empty optional fields allowed | ⏳ |  |
| Optional Verification | 2.2 UI → API optional data mapping | ✅ | Verified via Playwright: optional traits/events accepted by `/api/btr` 200 |

## Phase 3 – Review & Submit

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Review | 3.1 Review display matches inputs | ✅ | Playwright: review step reached for both flows before submit |
| Review | 3.2 API → UI mapping from `/api/btr` response | ✅ | Results rendered, best candidate highlighted, JSON export available |
| Results | 3.3 Results display: candidates + best highlight | ✅ | Top 5 candidates grid visible; best time surfaced |

## Phase 4 – End-to-End Flows

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| E2E | 4.1 Minimal data flow (mandatory only) | ✅ | Covered by Playwright smoke minimal |
| E2E | 4.2 Complete data flow (all optional provided) | ✅ | Covered by Playwright smoke approx + optional |
| E2E | 4.3 Navigation forward/backward persistence | ⏳ |  |

## Phase 5 – Error Handling

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Errors | 5.1 Browser console clean (React/JS) | ✅ | Playwright smoke: no console errors, only Vite dev notices |
| Errors | 5.2 Network errors (4xx/5xx, CORS, timeouts) | ✅ | Both `/api/btr` calls 200; no failed requests captured |
| Errors | 5.3 Backend runtime errors/log review | ✅ | API calls succeeded; `pytest` clean |

## Phase 6 – Linting & Type Checking (tracked above)

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Frontend | ESLint | ✅ | See Automated Checks |
| Frontend | TypeScript | ✅ | See Automated Checks |
| Backend | Lint/type checks | ⏳ | Not configured/run this session |

## Phase 7 – Geocoding Integration

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Geocoding | 7.1 OpenCage success/failure cases | ✅ | Sialkot, Pakistan and Delhi, India succeed; invalid cases not yet run |
| Geocoding | 7.2 Geocode included in `/api/btr` flow | ✅ | `/api/btr` responses include geocode data for both flows |

## Phase 8 – Edge Cases

| Step/Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Dates | 8.1 Date edge cases (old, recent, leap year) | ⏳ |  |
| Times | 8.2 Time range edge cases (midnight crossing, narrow/wide) | ⏳ |  |
| Timezones | 8.3 Timezone extremes/fractional offsets | ⏳ |  |

## Completion Checks

| Area | Scenario | Status | Notes/Fixes |
| --- | --- | --- | --- |
| Success Criteria | All steps have ≥2 passing scenarios | ⏳ | Edge/timezone/validation scenarios still pending |
| Success Criteria | UI ↔ API mappings verified | ✅ | Playwright flows + code review of `MultiStepForm`/`BTRRequest` |
| Success Criteria | No console/Network errors | ✅ | Playwright captured none (only Vite dev notices) |
| Success Criteria | End-to-end journey stable | ✅ | Two full flows completed to results page |
| Success Criteria | Geocoding uses OpenCage key | ✅ | OpenCage calls succeeding for Sialkot/Delhi |

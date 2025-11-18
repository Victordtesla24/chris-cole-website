# BTR Zero Candidate Root Cause Analysis & Dynamic Questions Implementation

## Stage 1: Comprehensive Root Cause Analysis (RCA)

### Task 1.1: Analyze Zero Candidate Scenarios

- **1.1.a**: Test Case 2.ii.a (DOB/POB + Career/Life Events only, no time range)
  - Simulate request with: DOB=1985-10-24, POB=Pune, Career events only, no `approx_tob` or `time_range_override`
  - Trace through backend phases 0-8 to identify where candidates are rejected
  - Check if default window (00:00-23:59) causes issues with BPHS filters
  - Analyze rejection reasons in `rejections` array to identify patterns

- **1.1.b**: Test Case 2.ii.b (DOB/POB + Time Range Override + Career/Life Events only)
  - Simulate request with: DOB=1985-10-24, POB=Pune, `time_range_override` (e.g., 11:00-15:00), Career events only, no traits
  - Trace through backend phases to see if narrow time window + strict BPHS filters cause zero candidates
  - Check if missing traits/events cause scoring issues that lead to rejection

- **1.1.c**: Review existing root_cause_analysis.md for known issues
  - Check for sunrise/sunset calculation bugs
  - Review strict BPHS mode rejection patterns
  - Identify any Phase-specific failures

### Task 1.2: Identify Dynamic Question Failure Root Cause

- **1.2.a**: Analyze current RecoveryPanel behavior
  - Review `frontend-react/src/components/RecoveryPanel.tsx` - shows generic suggestions, not input-aware
  - Check `backend/main.py:_summarize_rejections_for_response()` - returns rejection stats but no "suggested questions" based on input gaps
  - Identify missing logic to detect what fields are absent from request

- **1.2.b**: Trace error flow for zero candidates
  - User submits minimal input → Backend returns 404 with NO_CANDIDATES → Frontend shows RecoveryPanel
  - Current flow doesn't analyze what's missing to suggest specific questions
  - Need backend to return structured "suggested_questions" array based on input completeness

## Stage 2: RCA Mapping & Research

### Task 2.1: Create Root Cause Analysis Table (RCAT)

Create markdown table documenting:

- **2.i: Dynamic Question Failure**: Frontend shows generic RecoveryPanel; backend doesn't analyze input gaps to suggest specific questions
- **2.ii.a: Zero Candidate Failure (minimal input)**: Full-day search with strict BPHS may reject all candidates; missing time constraints reduce search effectiveness
- **2.ii.b: Zero Candidate Failure (time range only)**: Narrow time window + strict filters may have no valid candidates; missing traits/events reduce scoring confidence

### Task 2.2: Research Solutions

- Research best practices for dynamic form/question generation based on API response analysis
- Review error handling patterns for progressive data collection in multi-step forms
- Study how to structure backend responses to include actionable suggestions

## Stage 3: Code Implementation

### Task 3.1: Backend - Input Gap Analysis & Question Suggestions

**File: `backend/main.py`**

- Add function `_analyze_input_completeness(request: BTRRequest) -> dict[str, Any]`:
  - Checks which optional fields are missing (traits, events, time range)
  - Returns structured suggestions based on what's absent
  - Prioritizes suggestions (e.g., "Add time range" if window is full-day, "Add life events" if none provided)

- Modify `_summarize_rejections_for_response()` to include `suggested_questions`:
  - Merge input gap analysis with rejection pattern analysis
  - Return prioritized list of questions to ask user

- Update NO_CANDIDATES error response to include `suggested_questions` array:
  - Each question has: `field`, `priority`, `message`, `hint`

### Task 3.2: Backend - Improve Zero Candidate Handling

**File: `backend/main.py`**

- Enhance fallback logic in `/api/btr` endpoint:
  - Add Phase 6 logging to track rejection patterns before fallbacks
  - Improve rejection summary to include nearest-miss analysis (closest padekyata, trine, etc.)
  - Consider additional fallback: if all candidates fail trine rule, suggest checking date/location

**File: `backend/btr_core.py`**

- Review `search_candidate_times()` for edge cases:
  - Ensure shodhana is working correctly when enabled
  - Verify palā tolerance relaxation actually helps
  - Check if time window wrapping (midnight) is handled correctly

### Task 3.3: Frontend - Dynamic Question Display

**File: `frontend-react/src/components/RecoveryPanel.tsx`**

- Modify to accept `suggestedQuestions?: Array<{field: string, priority: number, message: string, hint?: string}>`
- Display questions dynamically based on backend suggestions:
  - Show high-priority questions first
  - Pre-fill or highlight relevant form sections
  - Group questions by category (time range, traits, events)

**File: `frontend-react/src/App.tsx`**

- Update error handling to extract `suggested_questions` from error response
- Pass `suggested_questions` to RecoveryPanel component

**File: `frontend-react/src/services/api.ts`**

- Update `calculateBTR()` error handling to extract `suggested_questions` from error detail
- Attach to error object for RecoveryPanel consumption

### Task 3.4: Types Update

**File: `frontend-react/src/types.ts`**

- Add `SuggestedQuestion` interface:
  ```typescript
  interface SuggestedQuestion {
    field: string;
    priority: number;
    message: string;
    hint?: string;
  }
  ```

- Update `NoCandidateErrorDetail` to include `suggested_questions?: SuggestedQuestion[]`

## Stage 4: Testing & Validation

### Task 4.1: Test Case 2.ii.a

- Submit request: DOB=1985-10-24, POB=Pune, Career events only, no time range
- **Expected**: Either finds candidate OR shows RecoveryPanel with dynamic questions suggesting time range
- **Validate**: Questions are relevant to missing input

### Task 4.2: Test Case 2.ii.b

- Submit request: DOB=1985-10-24, POB=Pune, Time range 11:00-15:00, Career events only, no traits
- **Expected**: Either finds candidate OR shows RecoveryPanel with dynamic questions suggesting traits
- **Validate**: Questions prioritize missing high-value fields

### Task 4.3: Test Case 2.i (Dynamic Questions)

- Submit minimal request (DOB/POB only)
- **Expected**: RecoveryPanel shows prioritized questions based on backend analysis
- **Validate**: Questions are context-aware, not generic

### Task 4.4: Create Test Summary Report (TSR)

Document results in markdown table with columns:

- Test Case
- Expected Result
- Actual Result
- Validation Status (PASS/FAIL)
- Evidence (log snippets, code behavior)

## Files to Modify

1. `backend/main.py` - Add input analysis, enhance error responses
2. `backend/btr_core.py` - Review edge cases (if needed)
3. `frontend-react/src/components/RecoveryPanel.tsx` - Dynamic question display
4. `frontend-react/src/App.tsx` - Error handling updates
5. `frontend-react/src/services/api.ts` - Error extraction
6. `frontend-react/src/types.ts` - Type definitions
7. `docs/root_cause_analysis.md` - Update with RCAT findings (or create new)

## Success Criteria

1. RCAT table completed with full error traces
2. Backend returns structured `suggested_questions` in NO_CANDIDATES errors
3. Frontend displays questions dynamically based on backend suggestions
4. Test cases 2.i, 2.ii.a, 2.ii.b all show PASS in TSR
5. Zero candidate scenarios either find candidates OR trigger appropriate dynamic questions
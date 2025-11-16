# **fix-errors — Repeat-Until-Green Loop**

# **Context**
- **Understanding & Strict adherence to testing directory structure** in `/tests/` directory
- **Previous test logs** from `/tests/logs/test-results/`

***STRICTLY NO DUPLICATE/NEW/ADDITIONAL/UNNECESSARY DOCUMENTATION OR FOLDER CREATION ALLOWED*** unless explicitly specified in user request.

# **Objective**
 * **Fix errors until none remain** 
 * **Ship production-grade changes (STRICTLY NO mocks/placeholders/fallbacks in runtime paths)**
 * **Maintain an auditable Error Trail by APPENDING/UPSERTING** `.cursor/memory-bank/currentTaskContext.md` & `.cursor/memory-bank/progressTracking.md` 
 
# **Policy**
 - Use `.cursor/rules/guard-rails.mdc` (always applied).
 - **Research Pass** only via:
   * Official indexed `/docs/` directory (see guard-rails for subdirectories). If a required doc isn't indexed, pause and request adding it, then continue.
   * Internet search using `web_search` tool to find suitable & effective solutions with minimal code changes using credible, authentic, valid and top-rated/highly-reviewed online resources.

# **Verification Commands**
 - Take screenshots of `http://localhost:3002/` & `https://hellochriscole.webflow.io/` & **compare the screenshots** side by side **THOROUGHLY**, & list exact replication discrepancies.
 - Run: `npm run type-check` (TypeScript), `npm run lint` (ESLint), `npm test` (tests), `npm run build` (production build).


## Working checklist (agent updates every cycle)
* [ ] **Parse failures** → rank by dependency/criticality
* [ ] **Pick top unchecked failure**
* [ ] **Root-cause & impact trace (end-to-end)**
* [ ] **Minimal, targeted fix plan (no scope creep)**
* [ ] **Implement fix + add/adjust tests if coverage is insufficient**
* [ ] **Verify: screenshots comparison, tests, type-check, lint, build** (see Verification Commands section)
* [ ] **If same class persists ≥2 attempts → Research Pass** (see Policy section; use official `/docs/` or `web_search` tool) → revise plan
* [ ] **Append/Upsert** to `.cursor/memory-bank/currentTaskContext.md` & `.cursor/memory-bank/progressTracking.md` (create if missing; see guard-rails Error Trail section for required sections)
* [ ] **Mark current failure done** → repeat

## Loop (repeat until all green)
1. **Collect & Rank Failures**
   * Parse test summary; build a failure checklist with hypothesised causes and dependencies.
2. **Root-Cause & Impact Analysis**
   * Trace the flow (UI → service → API → DB/cache). 
   * Identify exact files/functions/lines. 
   * Describe *why* it broke.
3. **Targeted Fix Plan (Minimal Diff)**
   * Propose the smallest safe change set. 
   * Cross-check `/docs/` and invariants.
4. **Implement Fix**
   * Edit only implicated code. Keep patterns consistent. If tests are weak, add/adjust just enough tests to prove the fix.
5. **Verification Gate (must pass)**
   * Run verification commands (see Verification Commands section above: screenshots comparison, type-check, lint, tests, build).
   * If anything fails, capture fresh evidence and loop back to Step 2.
   * If the **same class of error** repeats ≥2 attempts, perform a **Research Pass** (see Policy section):
     * Use only official `/docs/` directory or `web_search` tool; cite the exact section in the Error Trail.
     * Update plan accordingly, then continue at Step 4.
6. **Closure Criteria (for the current failure)**
   * The failure’s tests pass; no regressions; prod build OK; runtime paths free of mocks/placeholders/fallbacks.
   * Append Error Trail entry with: Fix Summary, Files Touched, Why It Works, Verification Evidence.
7. **Next Failure**
   * Move to the next checklist item. 
   * Do **not** declare completion until **all** failures resolved and verification passes.
   

## Outputs each cycle
* **Updated checklist** with current item ✔/✖
* **Verification results** (screenshots comparison, tests, type-check, lint, build) summarized
* **Error Trail append** (see guard-rails Error Trail section for required sections: Symptom, Root Cause, Impacted Modules, Evidence, Fix Summary, Files Touched, Why This Works, Verification Evidence)
* **Append/Upsert** `.cursor/memory-bank/currentTaskContext.md` & `.cursor/memory-bank/progressTracking.md` with all the above latest **Task Output each cycle** including Task Summary at the top & next step checklist.

## Non-negotiables
* **No "green by mocking" in runtime code** (see guard-rails: No Fake Green section).
* **No guessing contracts—align with `/docs/` directory or pause to index the official doc** (see guard-rails: Scope & Evidence section).
* **No "task complete" until **everything** (verification commands: screenshots, tests, type-check, lint, build) is green** (see guard-rails: Completion Policy section).


--- End Command ---
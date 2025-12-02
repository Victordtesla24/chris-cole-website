# BTR Pipeline – Implemented Flow (BPHS-only)

Version 2.1 • Source of truth: `backend/btr_core.py`

This document describes the pipeline that actually runs today. All rules come from **BPHS Chapter 4 (लग्नाध्याय)** and are enforced in code; no extra texts or commentaries are used.

## Inputs (API layer)
- `dob` (YYYY-MM-DD), `pob_text`
- `tz_offset_hours` (float)
- `approx_tob`: `mode` = `unknown` (00:00–23:59) or `approx` with `center` (HH:MM, default 12:00) and `window_hours` (default 3)
- `time_range_override`: `{start, end}` in HH:MM overrides `approx_tob`
- `optional_traits`: height (band or cm/feet/inches), build (band), complexion (band)
- `optional_events`: `marriage` or `marriages`, `children`, `career`, `major` (date-driven)

## Pre-computation
1. **Geocode** via OpenCage → lat/lon (+ timezone hints). (`backend/main.py:257-314`)
2. **Sunrise/Sunset** for the date/location (Swiss Ephemeris). (`backend/btr_core.py:152-214`)
3. **Gulika** day/night from BPHS 4.1–4.3; both lagnas are stored. (`backend/btr_core.py:214-376`)

## Candidate generation
- Search window derived from `approx_tob` or explicit override. (`backend/main.py:342-405`)
- Sweep every **2 minutes** (set at API layer) across the window.
- For each timestamp:
  - Compute sidereal lagna, Sun/Moon/planets, Madhya & Sphuṭa Pranapada, special lagnas, Nisheka. (`backend/btr_core.py:101-615`, `1197-1313`, `1424-1613`)

## Hard filters (mandatory)
- **Trine rule (BPHS 4.10)**: lagna must be 1st/5th/9th from Sphuṭa Pranapada; otherwise candidate marked non-human. (`backend/btr_core.py:676-750`)
- **Padekyatā (BPHS 4.6)**: lagna must align with Pranapada at palā resolution; in strict mode tolerance ≈0.2°. Madhya + Sphuṭa both checked when available.
- **Triple verification (BPHS 4.8)**: purification anchor must be Pranapada else Moon else Gulika/7th from Gulika within the orb (default 2°; 0.5° strict orb).
- Candidate accepted only if all three conditions hold; otherwise optional śodhana may promote it.

## Śodhana refinement (palā-level)
- When `enable_shodhana=True`, rejected candidates are nudged ±1…3 600 palās (24 s each) until the first time that passes all hard filters is found. The applied `shodhana_delta_palas` is returned. (`backend/btr_core.py:1565-1596`)

## Scoring and ordering
- **BPHS score (ordering key / `composite_score`)**  
  `0.4 * trine_pass(0/100) + 0.3 * degree_match + 0.3 * combined_verification`
- **Heuristic score (reported only)**  
  `0.4 * traits_overall + 0.4 * events_overall + 0.2 * gestation_score`
- Candidates are sorted by BPHS score when `bphs_only_ordering=True` (API default). (`backend/btr_core.py:1507-1563`)

## Optional heuristics
- **Physical traits (BPHS Ch.2)**: height/build/complexion scored from lagna sign/planets. (`backend/btr_core.py:833-1017`)
- **Life events**:  
  - Marriage → D-9 7th lord + dasha alignment  
  - Children → D-7 5th lord + dasha alignment  
  - Career → D-10 10th lord strength + dasha alignment (BPHS 12.211)  
  - Major events → dasha alignment heuristic  
  (`backend/btr_core.py:1019-1195`)
- **Nisheka (BPHS 4.12-16)**: gestation months from Saturn/Gulika/lagna; realism scored. (`backend/btr_core.py:563-615`)

## Response envelope
- `engine_version`, `geocode`, `search_config` (step_minutes=2, window), `candidates[]`, `best_candidate`, `rejections[]`, `notes` (BPHS summary). (`backend/main.py:325-416`)
- Each candidate includes lagna/pranapada deltas, purification anchor, special lagnas, Nisheka, BPHS + heuristic scores, optional trait/event scores, and śodhana offset when used.

## Operational notes
- Swiss Ephemeris uses Lahiri ayanamsa globally at import time.
- `frontend-react/dist` must exist before the API starts; otherwise `RuntimeError` is raised on import. (`backend/main.py:66-83`)
- Step size is currently hard-coded at the API layer; adjust there if you need coarser/finer sweeps. (`backend/main.py:396-404`)

## File map
- API + models: `backend/main.py`
- Core astro + BPHS logic: `backend/btr_core.py`
- Config/env loading: `backend/config.py`
- Tests: `tests/test_btr_core.py`, `tests/test_main.py`

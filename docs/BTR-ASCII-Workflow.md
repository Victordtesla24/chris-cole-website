# BTR ASCII Workflow (matches current code)

```
╔══════════════════════════════════════════════════════════════╗
║        BPHS BIRTH TIME RECTIFICATION – IMPLEMENTED FLOW       ║
╚══════════════════════════════════════════════════════════════╝

[INPUT]
  • dob (YYYY-MM-DD)
  • pob_text
  • tz_offset_hours
  • approx_tob: unknown OR approx(center, window_hours)
  • time_range_override (optional)
  • optional_traits (height/build/complexion)
  • optional_events (marriage/marriages, children, career, major)
          │
          ▼
[GEOCODE]
  OpenCage → lat/lon (+ timezone hints)
          │
          ▼
[PREP]
  • Sunrise/Sunset (Swiss Ephemeris)
  • Gulika day/night (BPHS 4.1–4.3)
          │
          ▼
[TIME SEARCH]
  2-minute sweep across window
  ↓
  Per timestamp:
    - Lagna, Sun/Moon/planets (sidereal, Lahiri)
    - Madhya & Sphuṭa Pranapada
    - Special lagnas (Bhava/Hora/Ghati/Varnada)
    - Nisheka lagna + gestation check
          │
          ▼
[BPHS HARD FILTERS]
  • Trine rule (BPHS 4.10) – mandatory
  • Padekyatā (BPHS 4.6) – palā resolution (~0.2° strict)
  • Purification anchor (BPHS 4.8):
       Pranapada → Moon → Gulika/7th
  If rejected and śodhana enabled:
       palā-by-palā adjustments (±1…3600 palās)
          │
          ▼
[ACCEPTED CANDIDATE]
  • BPHS score (ordering key = composite_score)
  • Purification anchor + deltas
  • Special lagnas, Nisheka
  • Optional scores: traits, life events, gestation, śodhana offset
          │
          ▼
[RESPONSE]
  - Sorted candidates (BPHS score)
  - best_candidate convenience
  - rejections with non-human classification & reason
```

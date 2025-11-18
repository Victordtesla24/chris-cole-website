# BPHS Birth Time Rectification (BTR) Prototype

A FastAPI + Swiss Ephemeris backend with a static React (Vite) frontend. The engine implements only the Birth Time Rectification rules that are explicitly present in **Brihat Parashara Hora Shastra (BPHS) – Chapter 4** and serves two endpoints: `/api/geocode` and `/api/btr`.

## Current Implementation (code facts)

- **Strict BPHS filters**: Trine rule (BPHS 4.10) + padekyatā degree equality (BPHS 4.6) enforced at palā granularity (~0.2° in `strict_bphs` mode) + purification anchor (BPHS 4.8). Non-human classifications are returned with rejection reasons.  
- **Gulika + Pranapada**: Day/night Gulika from sunrise/sunset (BPHS 4.1–4.3). Both Madhya (4.5) and Sphuṭa (4.7) Pranapada are computed; Sphuṭa is used for filtering, Madhya is reported.  
- **Search resolution**: 2‑minute sweep across the requested window (`backend/main.py:342-405`) with optional palā‑by‑palā śodhana up to 3 600 palās (24 s each) when strict filters fail (`backend/btr_core.py:150-210`).  
- **Outputs per candidate**: BPHS score (ordering key), Sphuṭa/Madhya Pranapada deltas, purification anchor, special lagnas (Bhava/Hora/Ghati/Varnada), Nisheka lagna + gestation check, optional trait and life‑event scores, optional śodhana offsets.  
- **Scoring**: `composite_score` equals the BPHS score (40% trine, 30% degree match, 30% purification). Physical traits, life events, and gestation heuristics are computed and exposed but **not used for ordering** when `bphs_only_ordering=True` (API default).  
- **Frontend requirement**: `frontend-react/dist` **must exist**; the backend raises at import time if the build is missing (`backend/main.py:66-83`).  
- **Geocoding**: OpenCage API; response includes `tz_offset_hours` and `timezone_name` when available (`backend/main.py:257-314`).

## Architecture

- **Backend**: Python 3.10+ with FastAPI
- **Astro Engine**: Swiss Ephemeris (pyswisseph) with Lahiri Ayanamsa
- **Geocoding**: OpenCage API
- **Frontend**: React + TypeScript (Vite) built into `frontend-react/dist` and served by FastAPI

## Installation

### Prerequisites

- Python 3.10 or higher
- Node.js 18+ and npm (for frontend)
- OpenCage API key ([Get one here](https://opencagedata.com/api))

### Local Setup

1. **Clone the repository**:
```bash
git clone <repository-url>
cd btr-demo
```

2. **Create a virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Create `.env` file** in the root directory:
```bash
OPENCAGE_API_KEY=your_api_key_here
EPHE_PATH=  # Optional: path to Swiss Ephemeris data files
```

5. **Build the frontend (required even for API-only use)**:
```bash
cd frontend-react
npm install
npm run build
cd ..
```
`backend/main.py` will raise a runtime error if `frontend-react/dist/index.html` is missing.

6. **Run the backend server**:
```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`

7. **Optional: run the frontend dev server**:
```bash
cd frontend-react
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default port)

**Note**: The frontend proxies API requests to `http://localhost:8000` automatically.

## API Endpoints

### GET `/api/geocode?q=<place>`

Geocode a place name to latitude/longitude using OpenCage.

**Example**:
```bash
curl "http://localhost:8000/api/geocode?q=Sialkot,%20Pakistan"
```

**Response**:
```json
{
  "lat": 32.4945,
  "lon": 74.5229,
  "formatted": "Sialkot, Punjab, Pakistan",
  "tz_offset_hours": 5.0,
  "timezone_name": "Asia/Karachi"
}
```

### POST `/api/btr`

Perform BPHS-based birth time rectification.

**Request body** (required unless noted):
```json
{
  "dob": "1997-12-18",
  "pob_text": "Sialkot, Pakistan",
  "tz_offset_hours": 5.0,
  "approx_tob": {
    "mode": "approx",         // "unknown" covers full 00:00–23:59
    "center": "11:00",        // HH:MM, default "12:00"
    "window_hours": 3.0       // +/- hours, default 3
  },
  "time_range_override": null, // {"start": "08:00", "end": "14:00"} if you want to override approx_tob
  "optional_traits": {
    "height": "TALL",          // or height_cm/feet/inches, build/build_band, complexion/complexion_tone
    "build": "ATHLETIC",
    "complexion": "WHEATISH"
  },
  "optional_events": {
    "marriage": {"date": "2020-05-15"},
    "marriages": [{"date": "2020-05-15"}],
    "children": {"count": 1, "dates": ["2021-08-20"]},
    "career": ["2018-06-01", "2022-03-15"],
    "major": [{"date": "2022-01-01", "title": "Relocation"}]
  }
}
```

**Response shape (trimmed)**:
```json
{
  "engine_version": "bphs-btr-prototype-v1",
  "geocode": { "lat": 32.4945, "lon": 74.5229, "formatted": "Sialkot, Punjab, Pakistan" },
  "search_config": {
    "step_minutes": 2,
    "time_window_used": { "start_local": "08:00", "end_local": "14:00" }
  },
  "candidates": [
    {
      "time_local": "1997-12-18T11:23:00",
      "lagna_deg": 247.2,
      "pranapada_deg": 248.0,
      "madhya_pranapada_deg": 247.8,
      "delta_pp_deg": 0.8,
      "passes_trine_rule": true,
      "purification_anchor": "pranapada",
      "verification_scores": {
        "degree_match": 84.0,
        "gulika_alignment": 72.0,
        "moon_alignment": 68.0,
        "combined_verification": 84.0,
        "passes_padekyata_sphuta": true,
        "passes_padekyata_madhya": true
      },
      "bphs_score": 85.2,
      "heuristic_score": 40.0,
      "special_lagnas": {...},
      "nisheka": {...},
      "physical_traits_scores": {...},
      "life_events_scores": {...},
      "composite_score": 85.2
    }
  ],
  "best_candidate": { ... },
  "rejections": [
    {
      "time_local": "1997-12-18T10:45:00",
      "lagna_deg": 240.0,
      "pranapada_deg": 260.0,
      "passes_trine_rule": false,
      "passes_purification": false,
      "non_human_classification": "pashu",
      "rejection_reason": "Non-human per BPHS 4.10-4.11 (pashu)"
    }
  ]
}
```

## BPHS Methodology

**Important**: All methods are based strictly on BPHS Chapter 4 verses. No other texts or commentaries are used.

### 1. Gulika Calculation (BPHS 4.1-4.3)

- Divide day/night duration into 8 equal parts (khandas)
- Assign each khanda to planets starting from weekday lord
- Saturn's khanda = Gulika period
- Gulika Lagna = Ascendant at Gulika midpoint

### 2. Pranapada Calculation

**Method 1 - Madhya Pranapada (BPHS 4.5)**:
```
1. Multiply ghatis × 4
2. Divide palas ÷ 15
3. Add both
4. Divide by 12 → Rashi
5. Remainder × 2 → Degrees
```

**Method 2 - Sphuta Pranapada (BPHS 4.7)** - **Primary Method**:
```
1. Convert Ishta Kala to total palas
2. Divide by 15 → Rashi fraction
3. Add to Sun based on Sun's rashi nature:
   - Chara (Movable): Add to Sun
   - Sthira (Fixed): Add to 9th from Sun
   - Dvisvabhava (Dual): Add to 5th from Sun
```

### 3. Hard Filters

**Trine Rule (BPHS 4.10) – mandatory**  
Lagna must be 1st/5th/9th from Pranapada or the candidate is classified as non-human.

**Degree matching (BPHS 4.6)**  
Padekyatā enforced at palā resolution (~0.2° in strict mode). Both Sphuṭa and Madhya Pranapada must align when provided.

**Triple verification (BPHS 4.8)**  
Purification anchor must be Pranapada else Moon else Gulika (or its 7th); otherwise rejected.

### 4. Enhanced Scoring System

**BPHS Score (ordering key)**  
`0.4 * trine_pass (0/100) + 0.3 * degree_match + 0.3 * combined_verification`

**Heuristic Score (reported only)**  
`0.4 * traits_overall + 0.4 * events_overall + 0.2 * gestation_score` (not used for ordering when `bphs_only_ordering=True`).

**Physical Traits Scoring (BPHS Chapter 2)**:
- Height: Based on lagna sign (Large/Medium/Small body types)
- Build: Based on lagnesh and planets in lagna (Athletic/Slim/Heavy)
- Complexion: Based on planets in lagna (Fair/Wheatish/Dark)

**Life Events Verification (optional heuristics)**:
- Marriage: D-9 7th house + Vimshottari dasha alignment.
- Children: D-7 5th house + dasha alignment.
- Career: D-10 10th lord strength + dasha alignment.
- Major events: dasha alignment heuristic only.

## Testing

Run all tests:
```bash
pytest tests/
```

Specific files:
```bash
pytest tests/test_btr_core.py
pytest tests/test_main.py
```

With coverage:
```bash
pytest --cov=backend tests/
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions on free-tier hosting platforms (Render, Railway, etc.).

## Limitations & Notes

- Prototype engine; BPHS-only filters are strict and may reject broad windows if padekyatā fails.
- `composite_score` mirrors the BPHS score; trait/event/gestation heuristics are informational only by default.
- Search step is fixed at 2 minutes from the API entry-point; palā‑level śodhana can promote nearby times.
- Swiss Ephemeris data files ship with pyswisseph; set `EPHE_PATH` only when using a custom ephemeris location.
- Free-tier platforms may time out if the search window is very wide.
- OpenCage API has free-tier limits (~2,500 requests/day).
- Node.js 18+ is needed for frontend builds; the backend will refuse to start without a built `frontend-react/dist`.

## Troubleshooting

### Issue: "OPENCAGE_API_KEY is not configured"
**Solution**: Set the `OPENCAGE_API_KEY` environment variable or create a `.env` file with your API key.

### Issue: Tests fail with "swisseph not found"
**Solution**: Ensure pyswisseph is installed: `pip install pyswisseph`

### Issue: No candidates found
**Possible reasons**:
- Time range too narrow
- All candidates failed BPHS trine rule (BPHS 4.10) - not human birth per BPHS
- Step size is fixed at 2 minutes via the API; widen the window or adjust `step_minutes` in `backend/main.py` if experimenting

### Issue: Build fails on deployment platform
**Solution**: 
- Ensure Python 3.10+ is specified
- Check that all dependencies in `requirements.txt` are compatible
- Some platforms may need: `pip install --upgrade pip setuptools wheel` before installing requirements

## BPHS Compliance

This implementation follows strict BPHS-only compliance (verses 4.1–4.3, 4.5–4.8, 4.10–4.11, 4.12–4.16, 4.18–4.28) with explicit verse references in `backend/btr_core.py`. Supporting docs:
- Verse translations: `docs/BPHS-BTR-Exact-Verses.md`
- Implementation plan: `docs/BTR-Pipeline-Implementation-Plan.md`
- Workflow: `docs/BTR-ASCII-Workflow.md`

## References

- **Primary Source**: Brihat Parashara Hora Shastra (बृहत्पाराशरहोराशास्त्र) - Chapter 4: लग्नाध्याय
- **Verse Documentation**: See `docs/BPHS-BTR-Exact-Verses.md` for exact Sanskrit verses and translations
- **Implementation Plan**: See `docs/BTR-Pipeline-Implementation-Plan.md` for detailed pipeline
- **Workflow**: See `docs/BTR-ASCII-Workflow.md` for end-to-end process flow

## License

This project is for educational and research purposes.

---

**॥ श्री गणेशाय नमः ॥**  
**॥ ॐ तत्सत् ॥**

# BPHS Birth Time Rectification (BTR) Prototype

A minimal but accurate web application for Birth Time Rectification based strictly on **Brihat Parashara Hora Shastra (BPHS)** verses from Chapter 4 - लग्नाध्याय (Lagna Adhyaya).

## Overview

This prototype implements the canonical BPHS-based rectification methods:

1. **Gulika Calculation** (BPHS 4.1-4.3) - Primary verification method
2. **Pranapada Calculation** (BPHS 4.5, 4.7) - Primary rectification metric
   - Method 1: Madhya Pranapada (Rough)
   - Method 2: Sphuta Pranapada (Accurate) - **Used for rectification**
3. **Hard BPHS Filters**:
   - Trine Rule (BPHS 4.10) - **Mandatory** for human births
   - Degree Matching (BPHS 4.6)
   - Triple Verification (BPHS 4.8)
4. **Special Lagnas** (BPHS 4.18-28) - Secondary verification
   - Bhava Lagna
   - Hora Lagna
   - Ghati Lagna
   - Varnada Lagna
5. **Nisheka Lagna** (BPHS 4.12-16) - Gestation verification

## Architecture

- **Backend**: Python 3.10+ with FastAPI
- **Astro Engine**: Swiss Ephemeris (pyswisseph) with Lahiri Ayanamsa
- **Geocoding**: OpenCage API
- **Frontend**: Plain HTML/CSS/JavaScript (no frameworks)

## Installation

### Prerequisites

- Python 3.10 or higher
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

5. **Run the backend server**:
```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`

6. **Open the frontend**:
   - Navigate to `http://localhost:8000` in your browser
   - Or open `frontend/index.html` directly (may have CORS issues)

## API Endpoints

### GET `/api/geocode?q=<place>`

Geocode a place name to get latitude/longitude using OpenCage API.

**Example**:
```bash
curl "http://localhost:8000/api/geocode?q=Sialkot,%20Pakistan"
```

**Response**:
```json
{
  "lat": 32.4945,
  "lon": 74.5229,
  "formatted": "Sialkot, Punjab, Pakistan"
}
```

**Error Responses**:
- `404`: Location not found
- `500`: OpenCage API key not configured or API error

### POST `/api/btr`

Perform birth time rectification using BPHS methods.

**Request Body** (all fields required except optional_*):
```json
{
  "dob": "1997-12-18",
  "pob_text": "Sialkot, Pakistan",
  "tz_offset_hours": 5.0,
  "approx_tob": {
    "mode": "unknown",
    "center": null,
    "window_hours": null
  },
  "time_range_override": null,
  "optional_traits": {
    "height": "TALL",
    "build": "ATHLETIC",
    "complexion": "WHEATISH"
  },
  "optional_events": {
    "marriage": {
      "date": "2020-05-15"
    },
    "children": {
      "count": 1,
      "dates": ["2021-08-20"]
    },
    "career": ["2018-06-01", "2022-03-15"]
  }
}
```

**Request with approximate time**:
```json
{
  "dob": "1997-12-18",
  "pob_text": "Delhi, India",
  "tz_offset_hours": 5.5,
  "approx_tob": {
    "mode": "approx",
    "center": "11:00",
    "window_hours": 3.0
  },
  "time_range_override": null,
  "optional_traits": null,
  "optional_events": null
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/btr \
  -H "Content-Type: application/json" \
  -d '{
    "dob": "1997-12-18",
    "pob_text": "Sialkot, Pakistan",
    "tz_offset_hours": 5.0,
    "approx_tob": {
      "mode": "approx",
      "center": "11:00",
      "window_hours": 3.0
    }
  }'
```

**Response**:
```json
{
  "engine_version": "bphs-btr-prototype-v1",
  "geocode": {
    "lat": 32.4945,
    "lon": 74.5229,
    "formatted": "Sialkot, Punjab, Pakistan"
  },
  "search_config": {
    "step_minutes": 10,
    "time_window_used": {
      "start_local": "08:00",
      "end_local": "14:00"
    }
  },
  "candidates": [
    {
      "time_local": "1997-12-18T11:23:00",
      "lagna_deg": 247.2,
      "pranapada_deg": 248.0,
      "delta_pp_deg": 0.8,
      "passes_trine_rule": true,
      "verification_scores": {
        "degree_match": 84.0,
        "gulika_alignment": 72.0,
        "moon_alignment": 68.0,
        "combined_verification": 84.0
      },
      "special_lagnas": {
        "bhava_lagna": 285.5,
        "hora_lagna": 312.3,
        "ghati_lagna": 298.7,
        "varnada_lagna": 45.0
      },
      "nisheka": {
        "nisheka_lagna_deg": 217.2,
        "gestation_months": 9.0,
        "is_realistic": true,
        "gestation_score": 100.0
      }
    }
  ],
  "best_candidate": { ... }
}
```

## BPHS Methodology

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

**Trine Rule (BPHS 4.10)** - **MANDATORY**:
- Birth Lagna must be in 1st, 5th, or 9th from Pranapada
- If not satisfied → Rejected (not human birth per BPHS)

**Degree Matching (BPHS 4.6)**:
- Lagna degrees ≈ Pranapada degrees
- Tolerance: ±2° (configurable)

**Triple Verification (BPHS 4.8)**:
- Must satisfy at least one:
  - Pranapada alignment
  - Gulika alignment
  - Moon alignment

## Testing

Run all tests:
```bash
pytest tests/
```

Run specific test file:
```bash
pytest tests/test_btr_core.py
pytest tests/test_main.py
```

Run with verbose output:
```bash
pytest -v tests/
```

Run with coverage:
```bash
pytest --cov=backend tests/
```

## Example Usage

### Example 1: Unknown Birth Time (Full 24h Search)

```bash
curl -X POST http://localhost:8000/api/btr \
  -H "Content-Type: application/json" \
  -d '{
    "dob": "1990-05-15",
    "pob_text": "Mumbai, India",
    "tz_offset_hours": 5.5,
    "approx_tob": {
      "mode": "unknown"
    }
  }'
```

This will search the entire 24-hour period (00:00 to 23:59) for valid birth times.

### Example 2: Approximate Time Known

```bash
curl -X POST http://localhost:8000/api/btr \
  -H "Content-Type: application/json" \
  -d '{
    "dob": "1985-08-20",
    "pob_text": "London, UK",
    "tz_offset_hours": 0.0,
    "approx_tob": {
      "mode": "approx",
      "center": "14:30",
      "window_hours": 2.0
    }
  }'
```

This searches from 12:30 to 16:30 (2 hours before and after 14:30).

### Example 3: Explicit Time Range

```bash
curl -X POST http://localhost:8000/api/btr \
  -H "Content-Type: application/json" \
  -d '{
    "dob": "1992-03-10",
    "pob_text": "New York, USA",
    "tz_offset_hours": -5.0,
    "approx_tob": {
      "mode": "unknown"
    },
    "time_range_override": {
      "start": "08:00",
      "end": "12:00"
    }
  }'
```

This overrides the approximate time settings and searches only from 08:00 to 12:00.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions on free-tier hosting platforms (Render, Railway, etc.).

## Limitations & Notes

- This is a **prototype** for educational and research purposes
- Advanced scoring by physical traits and life events is collected but not yet used for filtering (stored for future analysis)
- Step size for time search is configurable (default: 10 minutes in code, can be adjusted)
- Swiss Ephemeris data files are included with pyswisseph package; no separate download needed
- Free-tier hosting platforms may have timeout limits for long searches (full 24h with 2-minute steps)
- OpenCage API has free tier limits: 2,500 requests/day

## Troubleshooting

### Issue: "OPENCAGE_API_KEY is not configured"
**Solution**: Set the `OPENCAGE_API_KEY` environment variable or create a `.env` file with your API key.

### Issue: Tests fail with "swisseph not found"
**Solution**: Ensure pyswisseph is installed: `pip install pyswisseph`

### Issue: No candidates found
**Possible reasons**:
- Time range too narrow
- All candidates failed BPHS trine rule (BPHS 4.10) - not human birth per BPHS
- Step size too large (try smaller steps like 2-5 minutes)

### Issue: Build fails on deployment platform
**Solution**: 
- Ensure Python 3.10+ is specified
- Check that all dependencies in `requirements.txt` are compatible
- Some platforms may need: `pip install --upgrade pip setuptools wheel` before installing requirements

## References

- **Primary Source**: Brihat Parashara Hora Shastra (बृहत्पाराशरहोराशास्त्र)
- **Verse Documentation**: See `docs/BPHS-BTR-Exact-Verses.md`
- **Implementation Plan**: See `docs/BTR-Pipeline-Implementation-Plan.md`
- **Workflow**: See `docs/BTR-ASCII-Workflow.md`

## License

This project is for educational and research purposes.

---

**॥ श्री गणेशाय नमः ॥**  
**॥ ॐ तत्सत् ॥**

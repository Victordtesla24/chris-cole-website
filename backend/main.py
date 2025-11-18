# Backend main entry point

"""FastAPI server for BPHS-based Birth Time Rectification.

This module exposes two endpoints:

  * GET /api/geocode?q=<place>
    Resolve a place name to latitude, longitude and formatted address using the
    OpenCage geocoding API.

  * POST /api/btr
    Perform birth time rectification on the supplied birth details using
    BPHS rules and Swiss Ephemeris.
"""

import os
import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator, ConfigDict
import httpx

from . import config
from . import btr_core

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    if not config.OPENCAGE_API_KEY:
        import warnings
        warnings.warn(
            "OPENCAGE_API_KEY is not configured. Geocoding will fail. "
            "Set OPENCAGE_API_KEY environment variable or add it to .env file.",
            UserWarning
        )
    if config.EPHE_PATH:
        import os
        if not os.path.exists(config.EPHE_PATH):
            import warnings
            warnings.warn(
                f"EPHE_PATH '{config.EPHE_PATH}' does not exist. "
                "Swiss Ephemeris will use default paths.",
                UserWarning
            )
    yield
    # Shutdown (if needed in future)

app = FastAPI(title="BPHS BTR Prototype", version="1.0.0", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS if hasattr(config, 'CORS_ORIGINS') else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files - require React production build
react_build_path = Path(__file__).parent.parent / "frontend-react" / "dist"
react_index_path = react_build_path / "index.html"
if not react_index_path.exists():
    raise RuntimeError(
        f"React production build is missing at '{react_index_path}'. "
        "Build the frontend with `npm install && npm run build` inside frontend-react/"
    )

app.mount("/assets", StaticFiles(directory=str(react_build_path / "assets")), name="assets")

@app.get("/")
async def read_root():
    """Serve the React production frontend."""
    if not react_index_path.exists():
        raise HTTPException(status_code=500, detail="React frontend not found. Build assets before deployment.")
    return FileResponse(str(react_index_path))

# ---------------------------------------------------------------------------
# Pydantic models for request/response
# ---------------------------------------------------------------------------

class ApproxTob(BaseModel):
    mode: str = Field(..., description="Mode of approximate time: 'unknown' or 'approx'")
    center: Optional[str] = Field(None, description="Center time (HH:MM) when mode='approx'")
    window_hours: Optional[float] = Field(3.0, description="Window +/- hours when mode='approx'")

    @field_validator('mode')
    @classmethod
    def validate_mode(cls, v):
        if v not in ('unknown', 'approx'):
            raise ValueError("approx_tob.mode must be 'unknown' or 'approx'")
        return v

class TimeRangeOverride(BaseModel):
    start: str = Field(..., description="Start time (HH:MM)")
    end: str = Field(..., description="End time (HH:MM)")

class PhysicalTraitsModel(BaseModel):
    height: Optional[str] = None  # Legacy band
    height_cm: Optional[float] = Field(None, ge=0)
    height_feet: Optional[float] = Field(None, ge=0)
    height_inches: Optional[float] = Field(None, ge=0)
    height_band: Optional[str] = None
    build: Optional[str] = None
    build_band: Optional[str] = None
    body_frame: Optional[str] = None
    complexion: Optional[str] = None
    complexion_tone: Optional[str] = None
    notes: Optional[str] = None

class MarriageEventModel(BaseModel):
    date: str
    place: Optional[str] = None
    spouse_name: Optional[str] = None
    notes: Optional[str] = None

class ChildEventModel(BaseModel):
    date: str
    gender: Optional[str] = None
    notes: Optional[str] = None

class CareerEventModel(BaseModel):
    date: str
    role: Optional[str] = None
    description: Optional[str] = None

class MajorEventModel(BaseModel):
    date: str
    title: str
    description: Optional[str] = None

class LifeEventsModel(BaseModel):
    marriage: Optional[MarriageEventModel] = None  # Legacy single marriage
    marriages: Optional[List[MarriageEventModel]] = None
    children: Optional[Any] = None  # Accept legacy dict or list of child events
    career: Optional[Any] = None    # Accept list of career events or date strings
    major: Optional[List[MajorEventModel]] = None
    model_config = ConfigDict(extra='allow')

class BTRRequest(BaseModel):
    dob: str = Field(..., description="Date of birth in YYYY-MM-DD")
    pob_text: str = Field(..., description="Place of birth text")
    tz_offset_hours: float = Field(..., description="Time zone offset from UTC in hours")
    approx_tob: ApproxTob = Field(..., description="Approximate time of birth details")
    time_range_override: Optional[TimeRangeOverride] = Field(None, description="Explicit time range override")
    optional_traits: Optional[PhysicalTraitsModel] = None
    optional_events: Optional[LifeEventsModel] = None

class SpecialLagnas(BaseModel):
    bhava_lagna: float
    hora_lagna: float
    ghati_lagna: float
    varnada_lagna: float

class Nisheka(BaseModel):
    nisheka_lagna_deg: float
    gestation_months: float
    is_realistic: bool
    gestation_score: float

class PhysicalTraitsScore(BaseModel):
    height: Optional[float] = None
    build: Optional[float] = None
    complexion: Optional[float] = None
    overall: Optional[float] = None

class LifeEventsScore(BaseModel):
    marriage: Optional[float] = None
    children: Optional[float] = None
    career: Optional[float] = None
    major: Optional[float] = None
    overall: Optional[float] = None

class BTRCandidate(BaseModel):
    time_local: str
    lagna_deg: float
    pranapada_deg: float
    delta_pp_deg: float
    passes_trine_rule: bool
    purification_anchor: Optional[str] = None
    bphs_score: Optional[float] = None
    verification_scores: Dict[str, float]
    special_lagnas: Optional[SpecialLagnas] = None
    nisheka: Optional[Nisheka] = None
    composite_score: Optional[float] = None
    shodhana_delta_palas: Optional[int] = None
    physical_traits_scores: Optional[PhysicalTraitsScore] = None
    life_events_scores: Optional[LifeEventsScore] = None

class RejectedCandidate(BaseModel):
    time_local: str
    lagna_deg: float
    pranapada_deg: float
    passes_trine_rule: bool
    passes_purification: bool
    non_human_classification: Optional[str] = None
    rejection_reason: Optional[str] = None

class BTRResponse(BaseModel):
    engine_version: str
    geocode: Dict[str, Any]
    search_config: Dict[str, Any]
    candidates: List[BTRCandidate]
    best_candidate: Optional[BTRCandidate]
    rejections: Optional[List[RejectedCandidate]] = None
    notes: Optional[str] = None

# ---------------------------------------------------------------------------
# Utility functions
# ---------------------------------------------------------------------------

def _normalize_traits_for_scoring(traits: Optional[PhysicalTraitsModel]) -> Optional[Dict[str, Any]]:
    """Map rich trait input into the bands expected by the scorer."""
    if traits is None:
        return None

    data = traits.model_dump(exclude_none=True)
    height_band = str(data.get('height_band') or data.get('height') or '').upper() or None
    build_band = str(data.get('build_band') or data.get('build') or '').upper() or None
    complexion_band = str(data.get('complexion_tone') or data.get('complexion') or '').upper() or None

    if not height_band and 'height_cm' in data:
        try:
            val = float(data['height_cm'])
            if val >= 175:
                height_band = 'TALL'
            elif val <= 160:
                height_band = 'SHORT'
            else:
                height_band = 'MEDIUM'
        except (TypeError, ValueError):
            height_band = None

    normalized = {
        **({} if height_band is None else {'height': height_band, 'height_band': height_band}),
        **({} if build_band is None else {'build': build_band, 'build_band': build_band}),
        **({} if complexion_band is None else {'complexion': complexion_band, 'complexion_tone': complexion_band}),
    }
    for key in ('height_cm', 'height_feet', 'height_inches', 'body_frame', 'notes'):
        if key in data:
            normalized[key] = data[key]
    return normalized or None

def _normalize_events_for_scoring(events: Optional[LifeEventsModel]) -> Optional[Dict[str, Any]]:
    """Preserve structured life events while keeping legacy keys for scoring."""
    if events is None:
        return None
    data = events.model_dump(exclude_none=True)
    return data or None

async def opencage_geocode(place: str) -> Dict[str, Any]:
    """Resolve a place name using the OpenCage API.

    Args:
        place: Free‑text place description.

    Returns:
        Dict with keys 'lat', 'lon', 'formatted', and optional timezone info.
    """
    api_key = config.OPENCAGE_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENCAGE_API_KEY is not configured.")
    url = "https://api.opencagedata.com/geocode/v1/json"
    params = {'q': place, 'key': api_key, 'limit': 1}
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=10.0)
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="OpenCage API request timed out.")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"OpenCage API request failed: {str(e)}")
        
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=f"OpenCage API error: {resp.text}")
        
        try:
            data = resp.json()
        except ValueError as e:
            raise HTTPException(status_code=502, detail=f"Invalid JSON response from OpenCage API: {str(e)}")
        
        if not data.get('results'):
            raise HTTPException(status_code=404, detail="Location not found.")
        
        result = data['results'][0]
        try:
            lat = float(result['geometry']['lat'])
            lon = float(result['geometry']['lng'])
            formatted = str(result.get('formatted', ''))
            if not formatted:
                formatted = f"{lat}, {lon}"
            tz_data = result.get('annotations', {}).get('timezone', {}) or {}
            tz_offset_hours = None
            try:
                tz_offset_hours = round(float(tz_data.get('offset_sec', 0)) / 3600.0, 2)
            except (TypeError, ValueError):
                tz_offset_hours = None
            tz_name = tz_data.get('name')
        except (KeyError, ValueError, TypeError) as e:
            raise HTTPException(status_code=502, detail=f"Invalid response format from OpenCage API: {str(e)}")
        
        return {
            'lat': lat,
            'lon': lon,
            'formatted': formatted,
            'tz_offset_hours': tz_offset_hours,
            'timezone_name': tz_name
        }

# ---------------------------------------------------------------------------
# API endpoints
# ---------------------------------------------------------------------------

@app.get("/api/geocode")
async def geocode(q: str = Query(..., description="Place name to geocode")):
    """Geocode a place using OpenCage."""
    geodata = await opencage_geocode(q)
    return geodata

@app.post("/api/btr", response_model=BTRResponse)
async def btr(request: BTRRequest):
    """Perform BPHS-based birth time rectification."""
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Received BTR request: dob={request.dob}, pob={request.pob_text}, tz={request.tz_offset_hours}, mode={request.approx_tob.mode}")
    # Parse date of birth
    try:
        dob_date = datetime.datetime.strptime(request.dob, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format for dob. Use YYYY-MM-DD.")

    # Geocode the place
    geocode_result = await opencage_geocode(request.pob_text)
    latitude = geocode_result['lat']
    longitude = geocode_result['lon']

    # Determine search window
    if request.time_range_override:
        start_time = request.time_range_override.start
        end_time = request.time_range_override.end
    else:
        if request.approx_tob.mode == "unknown":
            start_time = "00:00"
            end_time = "23:59"
        else:
            center = request.approx_tob.center or "12:00"
            window = request.approx_tob.window_hours or 3.0
            try:
                center_parts = center.split(':')
                if len(center_parts) != 2:
                    raise ValueError("Time format must be HH:MM")
                center_hour, center_min = int(center_parts[0]), int(center_parts[1])
                if not (0 <= center_hour < 24 and 0 <= center_min < 60):
                    raise ValueError("Hour must be 0-23 and minute must be 0-59")
            except (ValueError, IndexError) as e:
                raise HTTPException(status_code=400, detail=f"Invalid time format for center: {center}. Use HH:MM format. {str(e)}")
            start_dt = datetime.datetime.combine(dob_date, datetime.time(center_hour, center_min)) - datetime.timedelta(hours=window)
            end_dt = datetime.datetime.combine(dob_date, datetime.time(center_hour, center_min)) + datetime.timedelta(hours=window)
            start_time = start_dt.strftime("%H:%M")
            end_time = end_dt.strftime("%H:%M")

    # Precompute sunrise/sunset and gulika
    try:
        sunrise_local, sunset_local = btr_core.compute_sunrise_sunset(dob_date, latitude, longitude, request.tz_offset_hours)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate sunrise/sunset: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in sunrise/sunset calculation: {str(e)}")
    
    try:
        gulika_info = btr_core.calculate_gulika(dob_date, latitude, longitude, request.tz_offset_hours)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate Gulika: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in Gulika calculation: {str(e)}")

    traits_for_scoring = _normalize_traits_for_scoring(request.optional_traits)
    events_for_scoring = _normalize_events_for_scoring(request.optional_events)

    # Search candidate times at BPHS-aligned resolution (2 minutes)
    step_minutes = 2
    try:
        candidates, rejections = btr_core.search_candidate_times(
            dob=dob_date,
            latitude=latitude,
            longitude=longitude,
            tz_offset=request.tz_offset_hours,
            start_time_str=start_time,
            end_time_str=end_time,
            step_minutes=step_minutes,
            strict_bphs=True,
            enable_shodhana=True,
            bphs_only_ordering=True,
            collect_rejections=True,
            sunrise_local=sunrise_local,
            sunset_local=sunset_local,
            gulika_info=gulika_info,
            optional_traits=traits_for_scoring,
            optional_events=events_for_scoring
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to search candidate times: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in candidate search: {str(e)}")

    # Candidates are already sorted by composite_score in search_candidate_times
    if not candidates:
        raise HTTPException(
            status_code=404,
            detail="No valid birth time candidates found. This may indicate: "
                   "1) No times in the search window satisfy BPHS trine rule (4.10), "
                   "2) Invalid date/location, or 3) Calculation error."
        )
    
    # Convert to Pydantic models, handling optional fields
    candidate_models = []
    for c in candidates:
        try:
            candidate_dict = {
                'time_local': c['time_local'],
                'lagna_deg': c['lagna_deg'],
                'pranapada_deg': c['pranapada_deg'],
                'delta_pp_deg': c['delta_pp_deg'],
                'passes_trine_rule': c['passes_trine_rule'],
                'purification_anchor': c.get('purification_anchor'),
                'bphs_score': c.get('bphs_score'),
                'shodhana_delta_palas': c.get('shodhana_delta_palas'),
                'verification_scores': c['verification_scores']
            }
            if 'special_lagnas' in c:
                candidate_dict['special_lagnas'] = SpecialLagnas(**c['special_lagnas'])
            if 'nisheka' in c:
                candidate_dict['nisheka'] = Nisheka(**c['nisheka'])
            if 'composite_score' in c:
                candidate_dict['composite_score'] = c['composite_score']
            if 'physical_traits_scores' in c:
                candidate_dict['physical_traits_scores'] = PhysicalTraitsScore(**c['physical_traits_scores'])
            if 'life_events_scores' in c:
                candidate_dict['life_events_scores'] = LifeEventsScore(**c['life_events_scores'])
            candidate_models.append(BTRCandidate(**candidate_dict))
        except (KeyError, ValueError, TypeError) as e:
            raise HTTPException(
                status_code=500,
                detail=f"Invalid candidate data structure: {str(e)}"
            )
    
    rejection_models: List[RejectedCandidate] = []
    for r in rejections:
        try:
            rejection_models.append(RejectedCandidate(**r))
        except (KeyError, ValueError, TypeError) as e:
            raise HTTPException(
                status_code=500,
                detail=f"Invalid rejection data structure: {str(e)}"
            )
    
    best_candidate = candidate_models[0] if candidate_models else None

    # Generate BPHS methodology notes
    methodology_notes = (
        "BPHS Birth Time Rectification Methodology:\n"
        "Source: Brihat Parashar Hora Shastra - Chapter 4 (लग्नाध्याय)\n\n"
        "Key Verses Implemented:\n"
        "- Gulika Calculation: BPHS 4.1-4.3 (गुलिक गणना)\n"
        "- Pranapada (Madhya): BPHS 4.5 (घटी चतुर्गुणा...)\n"
        "- Pranapada (Sphuta): BPHS 4.7 (स्वेष्टकालं पलीकृत्य...)\n"
        "- Degree Matching: BPHS 4.6 (लग्नांशप्राणांशपदैक्यता)\n"
        "- Triple Verification: BPHS 4.8 (विना प्राणपदाच्छुद्धो...)\n"
        "- Trine Rule (MANDATORY): BPHS 4.10 (प्राणपदं को राशि से त्रिकोण...)\n"
        "- Special Lagnas: BPHS 4.18-28 (Bhava, Hora, Ghati, Varnada)\n"
        "- Nisheka Lagna: BPHS 4.12-16 (Conception verification)\n\n"
        "All candidates must pass the Trine Rule (BPHS 4.10) for human birth verification. "
        "Candidates are scored based on degree matching, Gulika/Moon alignment, "
        "and optional physical traits/life events verification."
    )

    response = BTRResponse(
        engine_version="bphs-btr-prototype-v1",
        geocode=geocode_result,
        search_config={
            "step_minutes": step_minutes,
            "time_window_used": {
                "start_local": start_time,
                "end_local": end_time
            }
        },
        candidates=candidate_models,
        best_candidate=best_candidate,
        rejections=rejection_models or None,
        notes=methodology_notes
    )
    return response

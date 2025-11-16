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
from pydantic import BaseModel, Field, field_validator
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

# Mount static files (frontend)
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")

@app.get("/")
async def read_root():
    """Serve the frontend index.html"""
    index_path = frontend_path / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "Frontend not found. API available at /docs"}

@app.get("/styles.css")
async def get_styles():
    """Serve the CSS file"""
    css_path = frontend_path / "styles.css"
    if css_path.exists():
        return FileResponse(str(css_path), media_type="text/css")
    raise HTTPException(status_code=404, detail="CSS file not found")

@app.get("/app.js")
async def get_app_js():
    """Serve the JavaScript file"""
    js_path = frontend_path / "app.js"
    if js_path.exists():
        return FileResponse(str(js_path), media_type="application/javascript")
    raise HTTPException(status_code=404, detail="JavaScript file not found")

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

class BTRRequest(BaseModel):
    dob: str = Field(..., description="Date of birth in YYYY-MM-DD")
    pob_text: str = Field(..., description="Place of birth text")
    tz_offset_hours: float = Field(..., description="Time zone offset from UTC in hours")
    approx_tob: ApproxTob = Field(..., description="Approximate time of birth details")
    time_range_override: Optional[TimeRangeOverride] = Field(None, description="Explicit time range override")
    optional_traits: Optional[Dict[str, Any]] = None
    optional_events: Optional[Dict[str, Any]] = None

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

class BTRCandidate(BaseModel):
    time_local: str
    lagna_deg: float
    pranapada_deg: float
    delta_pp_deg: float
    passes_trine_rule: bool
    verification_scores: Dict[str, float]
    special_lagnas: Optional[SpecialLagnas] = None
    nisheka: Optional[Nisheka] = None

class BTRResponse(BaseModel):
    engine_version: str
    geocode: Dict[str, Any]
    search_config: Dict[str, Any]
    candidates: List[BTRCandidate]
    best_candidate: Optional[BTRCandidate]
    notes: Optional[str] = None

# ---------------------------------------------------------------------------
# Utility functions
# ---------------------------------------------------------------------------

async def opencage_geocode(place: str) -> Dict[str, Any]:
    """Resolve a place name using the OpenCage API.

    Args:
        place: Free‑text place description.

    Returns:
        Dict with keys 'lat', 'lon', 'formatted'.
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
        except (KeyError, ValueError, TypeError) as e:
            raise HTTPException(status_code=502, detail=f"Invalid response format from OpenCage API: {str(e)}")
        
        return {'lat': lat, 'lon': lon, 'formatted': formatted}

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

    # Search candidate times at a default resolution (10 minutes)
    step_minutes = 10
    try:
        candidates = btr_core.search_candidate_times(
            dob=dob_date,
            latitude=latitude,
            longitude=longitude,
            tz_offset=request.tz_offset_hours,
            start_time_str=start_time,
            end_time_str=end_time,
            step_minutes=step_minutes,
            sunrise_local=sunrise_local,
            sunset_local=sunset_local,
            gulika_info=gulika_info
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to search candidate times: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error in candidate search: {str(e)}")

    # Sort and wrap candidates
    if not candidates:
        raise HTTPException(
            status_code=404,
            detail="No valid birth time candidates found. This may indicate: "
                   "1) No times in the search window satisfy BPHS trine rule (4.10), "
                   "2) Invalid date/location, or 3) Calculation error."
        )
    
    candidates_sorted = sorted(
        candidates,
        key=lambda x: x['verification_scores']['combined_verification'],
        reverse=True
    )
    # Convert to Pydantic models, handling optional fields
    candidate_models = []
    for c in candidates_sorted:
        try:
            candidate_dict = {
                'time_local': c['time_local'],
                'lagna_deg': c['lagna_deg'],
                'pranapada_deg': c['pranapada_deg'],
                'delta_pp_deg': c['delta_pp_deg'],
                'passes_trine_rule': c['passes_trine_rule'],
                'verification_scores': c['verification_scores']
            }
            if 'special_lagnas' in c:
                candidate_dict['special_lagnas'] = SpecialLagnas(**c['special_lagnas'])
            if 'nisheka' in c:
                candidate_dict['nisheka'] = Nisheka(**c['nisheka'])
            candidate_models.append(BTRCandidate(**candidate_dict))
        except (KeyError, ValueError, TypeError) as e:
            raise HTTPException(
                status_code=500,
                detail=f"Invalid candidate data structure: {str(e)}"
            )
    
    best_candidate = candidate_models[0] if candidate_models else None

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
        notes=None
    )
    return response
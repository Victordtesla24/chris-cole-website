"""Tests for BTR refinement logic."""

import datetime
import pytest
from fastapi.testclient import TestClient
from backend import main as backend_main
from backend import btr_core
from backend.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_refinement_triggered_low_score(client, monkeypatch):
    """Test that a candidate score < 95% triggers refinement questions."""
    
    # Mock dependencies
    async def fake_geocode(place: str, request_id=None):
        return {
            "lat": 28.61,
            "lon": 77.20,
            "formatted": "Delhi, India",
            "tz_offset_hours": 5.5,
            "timezone_name": "Asia/Kolkata"
        }

    monkeypatch.setattr(backend_main, "opencage_geocode", fake_geocode)
    
    # Mock astronomical calculations
    monkeypatch.setattr(
        btr_core,
        "compute_sunrise_sunset",
        lambda *args, **kwargs: (
            datetime.datetime(2024, 1, 15, 7, 0, 0),
            datetime.datetime(2024, 1, 15, 17, 30, 0)
        )
    )
    
    monkeypatch.setattr(
        btr_core,
        "calculate_gulika",
        lambda *args, **kwargs: {
            "day_gulika_deg": 100.0,
            "night_gulika_deg": 280.0,
            "day_gulika_time_local": datetime.datetime(2024, 1, 15, 10, 0, 0),
            "night_gulika_time_local": datetime.datetime(2024, 1, 15, 22, 0, 0)
        }
    )

    # Mock search to return a candidate with < 95% score
    def fake_search(**kwargs):
        candidate = {
            "time_local": "2024-01-15T12:00:00",
            "lagna_deg": 10.0,
            "pranapada_deg": 10.0,
            "delta_pp_deg": 0.5, # Slightly off
            "passes_trine_rule": True,
            "verification_scores": {
                "degree_match": 80.0, # Not perfect
                "gulika_alignment": 70.0,
                "moon_alignment": 60.0,
                "combined_verification": 70.0,
                "passes_padekyata_sphuta": True,
                "passes_padekyata_madhya": True
            },
            "bphs_score": 85.0,
            "heuristic_score": 80.0,
            "composite_score": 83.5, # < 95%
            "special_lagnas": {
                "bhava_lagna": 0.0,
                "hora_lagna": 0.0,
                "ghati_lagna": 0.0,
                "varnada_lagna": 0.0
            },
            "nisheka": {
                "nisheka_lagna_deg": 0.0,
                "gestation_months": 9.0,
                "is_realistic": True,
                "gestation_score": 100.0
            },
            "physical_traits_scores": {
                "overall": 70.0,
                "accuracy": {"some": "data"} # Nested dict to test pydantic
            }
        }
        return [candidate], []

    monkeypatch.setattr(btr_core, "search_candidate_times", lambda **kwargs: fake_search(**kwargs))

    request_data = {
        "dob": "15-01-2024",
        "pob_text": "Delhi",
        "tz_offset_hours": 5.5,
        "approx_tob": {
            "mode": "approx",
            "center": "12:00",
            "window_hours": 2.0
        },
        "optional_traits": {
            "height": "MEDIUM"
        }
    }

    response = client.post("/api/btr", json=request_data)
    assert response.status_code == 200
    data = response.json()
    
    # Verify refinement flags
    assert data["needs_refinement"] is True
    assert data["suggested_questions"] is not None
    assert len(data["suggested_questions"]) > 0
    
    # Verify that nested dict in traits score was preserved/handled
    candidate = data["best_candidate"]
    assert candidate["physical_traits_scores"]["overall"] == 70.0
    # With extra='allow', unexpected fields should be present
    assert "accuracy" in candidate["physical_traits_scores"]

def test_refinement_not_triggered_high_score(client, monkeypatch):
    """Test that a candidate score >= 95% does NOT trigger refinement."""
    
    # Mock dependencies (similar to above)
    async def fake_geocode(place: str, request_id=None):
        return {
            "lat": 28.61, "lon": 77.20, "formatted": "Delhi", "tz_offset_hours": 5.5
        }
    monkeypatch.setattr(backend_main, "opencage_geocode", fake_geocode)
    monkeypatch.setattr(btr_core, "compute_sunrise_sunset", lambda *args, **kwargs: (datetime.datetime.now(), datetime.datetime.now()))
    monkeypatch.setattr(btr_core, "calculate_gulika", lambda *args, **kwargs: {"day_gulika_deg":0,"night_gulika_deg":0})

    # Mock search to return a candidate with > 95% score
    def fake_search(**kwargs):
        candidate = {
            "time_local": "2024-01-15T12:00:00",
            "lagna_deg": 10.0,
            "pranapada_deg": 10.0,
            "delta_pp_deg": 0.0,
            "passes_trine_rule": True,
            "verification_scores": {"degree_match": 100.0, "combined_verification": 100.0, "passes_padekyata_sphuta": True, "passes_padekyata_madhya": True, "gulika_alignment": 100.0, "moon_alignment": 100.0},
            "bphs_score": 100.0,
            "composite_score": 98.0, # > 95%
            "special_lagnas": {"bhava_lagna":0,"hora_lagna":0,"ghati_lagna":0,"varnada_lagna":0},
            "nisheka": {"nisheka_lagna_deg":0,"gestation_months":9,"is_realistic":True,"gestation_score":100},
            "physical_traits_scores": {}
        }
        return [candidate], []

    monkeypatch.setattr(btr_core, "search_candidate_times", lambda **kwargs: fake_search(**kwargs))

    request_data = {
        "dob": "15-01-2024", "pob_text": "Delhi", "tz_offset_hours": 5.5,
        "approx_tob": {"mode": "approx", "center": "12:00", "window_hours": 2.0}
    }

    response = client.post("/api/btr", json=request_data)
    data = response.json()
    
    assert data["needs_refinement"] is False
    # suggested_questions might still be present if input was incomplete, but let's check
    # With incomplete input (no events), _analyze_input_completeness will run.
    # But needs_refinement should be false based on score.
    # Wait, logic says: if score < 95, needs_refinement = True. Else False.
    

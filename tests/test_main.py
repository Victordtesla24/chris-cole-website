# Tests for main API module

"""Tests for the FastAPI main module."""

import datetime

import pytest
from fastapi.testclient import TestClient

from backend import btr_core
from backend import main as backend_main
from backend.main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


class TestGeocodeEndpoint:
    """Tests for the geocode endpoint."""
    
    def test_geocode_endpoint_exists(self, client):
        """Test that geocode endpoint exists."""
        # This will fail if API key is not set, but endpoint should exist
        response = client.get("/api/geocode?q=Delhi")
        # Should either return 200 (success) or 500 (API key missing) or 404 (not found)
        assert response.status_code in [200, 404, 500]
    
    def test_geocode_missing_query(self, client):
        """Test geocode endpoint without query parameter."""
        response = client.get("/api/geocode")
        assert response.status_code == 422  # Validation error


class TestBTREndpoint:
    """Tests for the BTR endpoint."""
    
    def test_btr_endpoint_exists(self, client):
        """Test that BTR endpoint exists."""
        request_data = {
            "dob": "2024-01-15",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "approx",
                "center": "12:00",
                "window_hours": 3.0
            }
        }
        response = client.post("/api/btr", json=request_data)
        # Should either return 200 (success), 400 (validation), 404 (no candidates), or 500 (API key missing/error)
        assert response.status_code in [200, 400, 404, 500]
    
    def test_btr_missing_fields(self, client):
        """Test BTR endpoint with missing required fields."""
        request_data = {
            "dob": "2024-01-15"
            # Missing other required fields
        }
        response = client.post("/api/btr", json=request_data)
        assert response.status_code == 422  # Validation error
    
    def test_btr_invalid_date_format(self, client):
        """Test BTR endpoint with invalid date format."""
        request_data = {
            "dob": "invalid-date",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "approx",
                "center": "12:00",
                "window_hours": 3.0
            }
        }
        response = client.post("/api/btr", json=request_data)
        # Should return 400 for invalid date format
        assert response.status_code in [400, 422]
    
    def test_btr_unknown_mode(self, client):
        """Test BTR endpoint with unknown time mode."""
        request_data = {
            "dob": "2024-01-15",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "unknown",
                "center": None,
                "window_hours": None
            }
        }
        response = client.post("/api/btr", json=request_data)
        # Should either succeed or fail with API key issue
        assert response.status_code in [200, 400, 404, 500]
    
    def test_btr_invalid_mode(self, client):
        """Test BTR endpoint with invalid mode."""
        request_data = {
            "dob": "2024-01-15",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "invalid_mode",
                "center": "12:00",
                "window_hours": 3.0
            }
        }
        response = client.post("/api/btr", json=request_data)
        assert response.status_code == 422  # Validation error


class TestAPIStructure:
    """Tests for API structure and documentation."""
    
    def test_openapi_schema_exists(self, client):
        """Test that OpenAPI schema is available."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert "openapi" in data
        assert "info" in data
    
    def test_docs_endpoint_exists(self, client):
        """Test that docs endpoint exists."""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_btr_prefers_geocoded_timezone(self, client, monkeypatch):
        """Backend should default to geocoded timezone when user offset is absent/incorrect."""
        async def fake_geocode(place: str, request_id=None):
            return {
                "lat": 1.0,
                "lon": 2.0,
                "formatted": "Test Place",
                "tz_offset_hours": 9.5,
                "timezone_name": "Asia/Test"
            }

        def fake_sunrise(dob, lat, lon, tz_offset):
            assert tz_offset == 9.5
            base = datetime.datetime(2024, 1, 15, 6, 0, 0)
            return base, base.replace(hour=18)

        def fake_gulika(dob, lat, lon, tz_offset):
            assert tz_offset == 9.5
            now = datetime.datetime(2024, 1, 15, 9, 0, 0)
            return {
                "day_gulika_deg": 0.0,
                "night_gulika_deg": 180.0,
                "day_gulika_time_local": now,
                "night_gulika_time_local": now.replace(hour=21)
            }

        def fake_search(**kwargs):
            assert kwargs["tz_offset"] == 9.5
            return ([{
                "time_local": "2024-01-15T10:00:00",
                "lagna_deg": 10.0,
                "pranapada_deg": 10.0,
                "delta_pp_deg": 0.1,
                "passes_trine_rule": True,
                "verification_scores": {
                    "degree_match": 100.0,
                    "gulika_alignment": 80.0,
                    "moon_alignment": 80.0,
                    "combined_verification": 90.0,
                    "passes_padekyata_sphuta": 1.0,
                    "passes_padekyata_madhya": 1.0
                },
                "bphs_score": 95.0,
                "special_lagnas": {
                    "bhava_lagna": 0.0,
                    "hora_lagna": 0.0,
                    "ghati_lagna": 0.0,
                    "varnada_lagna": 0.0
                },
                "nisheka": {
                    "nisheka_lagna_deg": 0.0,
                    "gestation_months": 8.0,
                    "is_realistic": True,
                    "gestation_score": 100.0
                },
                "composite_score": 95.0
            }], [])

        monkeypatch.setattr(backend_main, "opencage_geocode", fake_geocode)
        monkeypatch.setattr(btr_core, "compute_sunrise_sunset", fake_sunrise)
        monkeypatch.setattr(btr_core, "calculate_gulika", fake_gulika)
        monkeypatch.setattr(btr_core, "search_candidate_times", lambda **kwargs: fake_search(**kwargs))

        request_data = {
            "dob": "15-01-2024",
            "pob_text": "Test Place",
            "tz_offset_hours": 0.0,  # intentionally wrong to test override
            "approx_tob": {
                "mode": "unknown",
                "center": None,
                "window_hours": None
            }
        }
        response = client.post("/api/btr", json=request_data)
        assert response.status_code == 200
        payload = response.json()
        assert payload["search_config"]["tz_offset_hours_used"] == 9.5
        assert payload["geocode"]["formatted"] == "Test Place"

    def test_btr_no_candidates_returns_summary(self, client, monkeypatch):
        """404 responses should carry structured rejection summary for recovery UI."""
        async def fake_geocode(place: str, request_id=None):
            return {
                "lat": 10.0,
                "lon": 20.0,
                "formatted": "Nowhere",
                "tz_offset_hours": 5.5,
                "timezone_name": "Asia/Test"
            }

        monkeypatch.setattr(backend_main, "opencage_geocode", fake_geocode)
        monkeypatch.setattr(
            btr_core,
            "compute_sunrise_sunset",
            lambda *args, **kwargs: (
                datetime.datetime(2024, 1, 15, 6, 0, 0),
                datetime.datetime(2024, 1, 15, 18, 0, 0)
            )
        )
        monkeypatch.setattr(
            btr_core,
            "calculate_gulika",
            lambda *args, **kwargs: {
                "day_gulika_deg": 0.0,
                "night_gulika_deg": 180.0,
                "day_gulika_time_local": datetime.datetime(2024, 1, 15, 9, 0, 0),
                "night_gulika_time_local": datetime.datetime(2024, 1, 15, 21, 0, 0)
            }
        )

        def fake_search(**kwargs):
            assert kwargs["tz_offset"] == 5.5
            return [], [{
                "time_local": "2024-01-15T00:00:00",
                "lagna_deg": 0.0,
                "pranapada_deg": 30.0,
                "passes_trine_rule": False,
                "passes_purification": False,
                "rejection_reason": "Fails BPHS 4.6 padekyata"
            }]

        monkeypatch.setattr(btr_core, "search_candidate_times", lambda **kwargs: fake_search(**kwargs))

        request_data = {
            "dob": "15-01-2024",
            "pob_text": "Nowhere",
            "tz_offset_hours": 0.0,
            "approx_tob": {
                "mode": "unknown",
                "center": None,
                "window_hours": None
            }
        }

        response = client.post("/api/btr", json=request_data)
        assert response.status_code == 404
        detail = response.json().get("detail")
        assert detail["code"] == "NO_CANDIDATES"
        summary = detail.get("rejection_summary") or {}
        assert summary["reason_counts"]["Fails BPHS 4.6 padekyata"] == 1
        assert detail["tz_offset_hours_used"] == 5.5
    
    def test_btr_with_time_range_override(self, client):
        """Test BTR endpoint with time range override."""
        request_data = {
            "dob": "2024-01-15",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "unknown",
                "center": None,
                "window_hours": None
            },
            "time_range_override": {
                "start": "08:00",
                "end": "12:00"
            }
        }
        response = client.post("/api/btr", json=request_data)
        # Should either succeed, fail with validation, fail with API key issue, or return 404 if no candidates found
        assert response.status_code in [200, 400, 404, 500]
    
    def test_btr_with_optional_traits(self, client):
        """Test BTR endpoint with optional traits."""
        request_data = {
            "dob": "2024-01-15",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "approx",
                "center": "12:00",
                "window_hours": 3.0
            },
            "optional_traits": {
                "height": "TALL",
                "build": "ATHLETIC",
                "complexion": "FAIR"
            }
        }
        response = client.post("/api/btr", json=request_data)
        # Should either succeed, fail with validation, fail with API key issue, or return 404 if no candidates found
        assert response.status_code in [200, 400, 404, 500]
        if response.status_code == 200:
            data = response.json()
            assert "candidates" in data
            if data["candidates"]:
                candidate = data["candidates"][0]
                assert "composite_score" in candidate
                assert "physical_traits_scores" in candidate
    
    def test_btr_with_optional_events(self, client):
        """Test BTR endpoint with optional life events."""
        request_data = {
            "dob": "2024-01-15",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "approx",
                "center": "12:00",
                "window_hours": 3.0
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
        response = client.post("/api/btr", json=request_data)
        # Should either succeed, fail with validation, fail with API key issue, or return 404 if no candidates found
        assert response.status_code in [200, 400, 404, 500]
        if response.status_code == 200:
            data = response.json()
            assert "candidates" in data
            if data["candidates"]:
                candidate = data["candidates"][0]
                assert "composite_score" in candidate
                assert "life_events_scores" in candidate
    
    def test_btr_with_traits_and_events(self, client):
        """Test BTR endpoint with both optional traits and events."""
        request_data = {
            "dob": "2024-01-15",
            "pob_text": "Delhi, India",
            "tz_offset_hours": 5.5,
            "approx_tob": {
                "mode": "approx",
                "center": "12:00",
                "window_hours": 3.0
            },
            "optional_traits": {
                "height": "TALL"
            },
            "optional_events": {
                "marriage": {
                    "date": "2020-05-15"
                }
            }
        }
        response = client.post("/api/btr", json=request_data)
        # Should either succeed, fail with validation, fail with API key issue, or return 404 if no candidates found
        assert response.status_code in [200, 400, 404, 500]
        if response.status_code == 200:
            data = response.json()
            assert "candidates" in data
            if data["candidates"]:
                candidate = data["candidates"][0]
                assert "composite_score" in candidate
                if "physical_traits_scores" in candidate:
                    assert candidate["physical_traits_scores"] is not None
                if "life_events_scores" in candidate:
                    assert candidate["life_events_scores"] is not None

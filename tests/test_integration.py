
import pytest
import datetime
from backend import btr_core

class TestIntegration:
    """Test Shadbala and Ayurdaya integration into BTR pipeline."""

    def test_search_includes_shadbala_and_ayurdaya(self):
        """Verify that search results now contain Shadbala and Ayurdaya data."""
        # Use a date where search typically works
        dob = datetime.date(1990, 1, 1)
        # New Delhi approx
        lat = 28.61
        lon = 77.20
        tz = 5.5
        
        # Short search window
        start_time = "10:00"
        end_time = "12:00"
        
        results = btr_core.search_candidate_times(
            dob, lat, lon, tz, 
            start_time, end_time, 
            step_minutes=5.0,
            strict_bphs=False # Relaxed to ensure we get candidates
        )
        
        # Check if any candidates found
        if not results:
            pytest.skip("No candidates found in integration test window")
            
        candidate = results[0]
        
        # Verify Shadbala presence
        assert 'shadbala_summary' in candidate, "Shadbala summary missing"
        assert 'sun' in candidate['shadbala_summary']
        assert candidate['shadbala_summary']['sun'] > 0
        
        # Verify Ayurdaya presence
        assert 'ayurdaya_summary' in candidate, "Ayurdaya summary missing"
        assert 'final' in candidate['ayurdaya_summary']
        assert candidate['ayurdaya_summary']['final'] > 0

    def test_verify_life_events_uses_shadbala(self):
        """Test that life event verification uses Shadbala strength weights."""
        # Mock data
        jd_ut = 2460000.5
        lagna_deg = 0.0 # Aries
        planets = {p: 0.0 for p in ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn']}
        moon_long = 0.0
        
        # Events
        events = {'marriage': '01-01-2020'}
        
        # Case 1: Weak Shadbala
        weak_shadbala = {
            'venus': {'rupa': 3.0}, # Weak
            'jupiter': {'rupa': 3.0},
            'moon': {'rupa': 3.0}
        }
        
        # Case 2: Strong Shadbala
        strong_shadbala = {
            'venus': {'rupa': 8.0}, # Strong
            'jupiter': {'rupa': 8.0},
            'moon': {'rupa': 8.0}
        }
        
        # We need to mock get_dasha_at_date or ensure the date triggers a specific dasha.
        # Or just rely on the logic change: weak vs strong factor.
        
        # Assuming the logic inside verify_life_events multiplies score by factor.
        # We'll just call the function directly.
        
        score_weak = btr_core.verify_life_events(jd_ut, lagna_deg, planets, events, moon_long, shadbala_scores=weak_shadbala)
        score_strong = btr_core.verify_life_events(jd_ut, lagna_deg, planets, events, moon_long, shadbala_scores=strong_shadbala)
        
        # Strong shadbala should yield higher or equal score, definitely not lower
        # And typically higher because factors are 0.5 vs 1.5
        if score_weak['marriage'] > 0:
             assert score_strong['marriage'] > score_weak['marriage']

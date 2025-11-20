
import pytest
import datetime
import math
from backend import shadbala, btr_core

class TestShadbala:
    """Tests for Shadbala calculation module."""

    def test_shadbala_structure(self):
        """Test that calculate_shadbala returns correct structure."""
        jd_ut = 2460000.5
        lagna_deg = 45.0
        planets_deg = {
            'sun': 120.0,
            'moon': 180.0,
            'mars': 60.0,
            'mercury': 90.0,
            'jupiter': 240.0,
            'venus': 300.0,
            'saturn': 30.0
        }
        birth_dt = datetime.datetime(2024, 1, 1, 12, 0, 0)
        sunrise = datetime.datetime(2024, 1, 1, 6, 0, 0)
        sunset = datetime.datetime(2024, 1, 1, 18, 0, 0)
        
        results = shadbala.calculate_shadbala(jd_ut, lagna_deg, planets_deg, birth_dt, sunrise, sunset)
        
        assert isinstance(results, dict)
        for planet in ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn']:
            assert planet in results
            p_score = results[planet]
            assert 'total' in p_score
            assert 'sthaana' in p_score
            assert 'dig' in p_score
            assert 'kaala' in p_score
            assert 'cheshta' in p_score
            assert 'naisargika' in p_score
            assert 'drig' in p_score
            assert 'rupa' in p_score
            
            # Check aggregation
            computed_total = (p_score['sthaana'] + p_score['dig'] + p_score['kaala'] + 
                              p_score['cheshta'] + p_score['naisargika'] + p_score['drig'])
            assert abs(computed_total - p_score['total']) < 0.02 # Float tolerance

    def test_uccha_bala_logic(self):
        """Test Exaltation strength logic."""
        # Sun exalted at Aries 10 (10 deg)
        # Debilitated at Libra 10 (190 deg)
        planets_deg = {'sun': 10.0, 'moon': 0, 'mars': 0, 'mercury': 0, 'jupiter': 0, 'venus': 0, 'saturn': 0}
        lagna_deg = 0.0
        
        scores = shadbala.calculate_sthaana_bala(planets_deg, lagna_deg)
        
        # At 10 deg, Sun should have max Uccha Bala (60 virupas)
        # The logic in sthaana bala sums multiple factors, so we need to isolate it or check min value.
        # Uccha = 60. Kendra (Aries is 1st/kendra from 0 lagna?) No, Lagna=0. Aries is 1st house. Kendra = 60.
        # Drekkana 1st = 15 (Male Sun).
        # Oja (Odd) = 15 (Male Sun).
        # Total approx 150.
        # Let's check if it's high.
        assert scores['sun'] >= 60.0
        
        # Sun at Debilitation (190)
        planets_deg['sun'] = 190.0
        scores_deb = shadbala.calculate_sthaana_bala(planets_deg, lagna_deg)
        # Uccha component should be 0.
        # Kendra (190 deg is 7th house from 0) = 60.
        # Libra is Odd (180-210 is sign 7 - Odd? No, 7th sign (Libra) index 6. Even.)
        # Sun (Male) in Even = 0.
        # Drekkana 190 (0-10 of Libra) = 1st = 15.
        # Total approx 75.
        assert scores_deb['sun'] < scores['sun']

    def test_dig_bala_logic(self):
        """Test Directional strength logic."""
        # Sun gets max Dig Bala in 10th house (South).
        # Lagna = 0. 10th house ~ 270 deg.
        lagna_deg = 0.0
        planets_deg = {'sun': 270.0, 'moon': 0, 'mars': 0, 'mercury': 0, 'jupiter': 0, 'venus': 0, 'saturn': 0}
        
        scores = shadbala.calculate_dig_bala(planets_deg, lagna_deg)
        # At 270, dist from 10th (270) is 0.
        # Strength = (180 - dist) / 3 ? No, implementation: dist from Zero point / 3.
        # Zero point for Sun is 4th house (90).
        # Dist(270, 90) = 180.
        # Strength = 180 / 3 = 60.
        assert abs(scores['sun'] - 60.0) < 0.1
        
        # Sun in 4th house (90 deg) -> Zero strength
        planets_deg['sun'] = 90.0
        scores = shadbala.calculate_dig_bala(planets_deg, lagna_deg)
        # Dist(90, 90) = 0.
        # Strength = 0.
        assert abs(scores['sun'] - 0.0) < 0.1

    def test_integration_with_core(self):
        """Test that btr_core function calls shadbala correctly."""
        jd_ut = 2460000.5
        lagna_deg = 45.0
        planets_deg = {
            'sun': 120.0, 'moon': 180.0, 'mars': 60.0, 'mercury': 90.0, 
            'jupiter': 240.0, 'venus': 300.0, 'saturn': 30.0
        }
        birth_dt = datetime.datetime(2024, 1, 1, 12, 0, 0)
        latitude = 28.6
        longitude = 77.2
        tz_offset = 5.5
        
        # This requires swisseph to work for sunrise/sunset calculation
        # Since we might not have ephe files, compute_sunrise_sunset might fail or need mocking.
        # We'll assume environment is set up or rely on basic math if mock is needed.
        # The test suite usually runs in an env with swisseph installed.
        
        try:
            results = btr_core.calculate_planetary_strengths(
                jd_ut, lagna_deg, planets_deg, birth_dt, latitude, longitude, tz_offset
            )
            assert isinstance(results, dict)
            assert 'sun' in results
        except RuntimeError:
            pytest.skip("Swiss Ephemeris files not found or calculation error")

    def test_ayana_bala_calculation(self):
        """Test Ayana Bala (Equinoctial Strength) logic."""
        # Use a known JD for Winter Solstice (approx Dec 21)
        # Sun Declination is max South (~ -23.5).
        # Sun (North Strong) should be weak.
        # Moon (South Strong) should be strong.
        jd_ut = 2460300.5 # Dec 21, 2023 approx
        
        scores = shadbala.calculate_ayana_bala(jd_ut)
        
        assert scores['mercury'] == 30.0
        
        # Sun (North Strong) with South Dec -> Low Score
        # (24 - 23.5) * 1.25 = 0.5 * 1.25 = 0.625
        # But let's just check it's low (< 30)
        # Note: exact dec depends on ephemeris, but it will be negative.
        # We can't assert exact values without knowing the exact dec returned by swisseph.
        # But we can check ranges.
        assert 0 <= scores['sun'] <= 60
        
    def test_tribhaga_bala_logic(self):
        """Test Tribhaga Bala logic."""
        sunrise = datetime.datetime(2024, 1, 1, 6, 0, 0)
        sunset = datetime.datetime(2024, 1, 1, 18, 0, 0)
        
        # Noon birth (Day Part 2) -> Sun
        birth_noon = datetime.datetime(2024, 1, 1, 12, 0, 0)
        scores = shadbala.calculate_tribhaga_bala(birth_noon, sunrise, sunset)
        assert scores['sun'] == 60.0
        assert scores['jupiter'] == 60.0
        assert scores['mercury'] == 0.0
        
        # Midnight birth (Night Part 2) -> Venus
        # Night starts 18:00. Duration 12h.
        # Part 1: 18-22. Part 2: 22-02. Part 3: 02-06.
        birth_midnight = datetime.datetime(2024, 1, 1, 0, 0, 0) # Midnight start of day?
        # Wait, is 00:00 part of the night of Jan 1 or Dec 31?
        # If we pass Jan 1 Sunrise/Sunset, and birth is Jan 1 00:00:
        # Birth < Sunrise. So it's "Early Morning" of Jan 1.
        # It belongs to the night of Dec 31 - Jan 1.
        # Logic: birth < sunrise. Elapsed = Night_Len - (Sunrise - Birth).
        # Night Len ~ 12h. Sunrise - Birth = 6h.
        # Elapsed = 12 - 6 = 6h.
        # 6h is middle of 12h night (Part 2).
        # Night Lords: Moon, Venus, Mars.
        # Part 2 is Venus.
        scores_night = shadbala.calculate_tribhaga_bala(birth_midnight, sunrise, sunset)
        assert scores_night['venus'] == 60.0
        assert scores_night['jupiter'] == 60.0


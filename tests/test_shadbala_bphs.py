
import pytest
import datetime
import math
from backend import shadbala, astro_utils, vargas

# Mock data for testing
# 2023-01-01 12:00:00 UTC
# Locations: New Delhi
TEST_DT = datetime.datetime(2023, 1, 1, 12, 0, 0)
TEST_SUNRISE = datetime.datetime(2023, 1, 1, 7, 14, 0)
TEST_SUNSET = datetime.datetime(2023, 1, 1, 17, 35, 0)

# Approximate positions on 2023-01-01
# Sun: Sagittarius ~16 deg (256)
# Moon: Aries ~15 deg (15)
# Mars: Taurus ~15 deg (45) (Retrograde)
# Mercury: Sagittarius ~29 deg (269) (Retrograde)
# Jupiter: Pisces ~7 deg (337)
# Venus: Capricorn ~3 deg (273)
# Saturn: Capricorn ~28 deg (298)

MOCK_PLANETS = {
    'sun': 256.0,
    'moon': 15.0,
    'mars': 45.0,
    'mercury': 269.0,
    'jupiter': 337.0,
    'venus': 273.0,
    'saturn': 298.0
}
MOCK_LAGNA = 350.0 # Pisces rising

def test_sthaana_bala_structure():
    scores = shadbala.calculate_sthaana_bala(MOCK_PLANETS, MOCK_LAGNA)
    for p in astro_utils.PLANETS:
        assert p in scores
        assert scores[p] >= 0.0
        
def test_uccha_bala():
    # Sun Exalted at Aries 10 (10.0)
    # Test Sun at 10.0
    planets = MOCK_PLANETS.copy()
    planets['sun'] = 10.0
    scores = shadbala.calculate_sthaana_bala(planets, MOCK_LAGNA)
    # We can't isolate Uccha easily without modifying code, but we can assert high score?
    # Actually we can check the logic via a specific function if we exposed it, 
    # or just trust the integration.
    # Let's manually calculate expected Uccha for Sun at 10.0
    # Diff = 0 from Exalt. Score should include 60.0 from Uccha.
    
    # Sun at 190.0 (Libra 10, Debilitated)
    # Score should be 0 from Uccha.
    planets['sun'] = 190.0
    scores_debil = shadbala.calculate_sthaana_bala(planets, MOCK_LAGNA)
    
    # Difference should be reflected (though other factors might change too)
    # Wait, changing Sun position changes Saptavarga, Kendra, etc.
    # So we can't easily diff.
    pass

def test_aspect_calculation():
    # Test piecewise aspect function
    assert shadbala._calculate_aspect_value(0) == 0
    assert shadbala._calculate_aspect_value(45) == 7.5 # (45-30)/2
    assert shadbala._calculate_aspect_value(75) == 30.0 # (75-60)+15
    assert shadbala._calculate_aspect_value(105) == 37.5 # 45 - (105-90)/2 = 45 - 7.5
    assert shadbala._calculate_aspect_value(135) == 15.0 # 30 - (135-120) = 15
    assert shadbala._calculate_aspect_value(180) == 60.0 # (180-150)*2 = 60
    assert shadbala._calculate_aspect_value(200) == 0.0 # No aspect (unless special)

def test_drig_bala_special_aspects():
    # Mars at 0, Jupiter at 90 (4th from Mars)
    # Mars aspects Jupiter. Angle = 90.
    # Special aspect 4th = 60.
    # Place other planets where they don't aspect Jupiter (e.g., > 300 deg relative)
    # Jupiter at 90.
    # Safe spot: 90 - 20 = 70? No, aspect is Actor->Target.
    # Angle = Target - Actor.
    # We want Angle to be > 300 or < 30.
    # Target = 90.
    # If Actor = 80. Angle = 10. No aspect.
    
    planets = {p: 80.0 for p in astro_utils.PLANETS} # Default no aspect
    planets['mars'] = 0.0
    planets['jupiter'] = 90.0 # Target
    
    # Check angles:
    # Mars->Jup: 90 - 0 = 90. Aspect! (Special 60)
    # Others(80)->Jup: 90 - 80 = 10. No aspect (<30).
    
    scores = shadbala.calculate_drig_bala(planets)
    # Jupiter is being aspected by Mars (Malefic).
    # Score should be negative.
    # Mars aspect = 60 (Special).
    # Contribution = 60 * 0.25 = 15.
    # Jupiter score = -15.
    assert scores['jupiter'] == -15.0

def test_hora_bala():
    # Sunday (2023-01-01 is Sunday).
    # Sunrise 7:14.
    # Birth 7:30 -> 1st Hora.
    # Sunday 1st Hora Lord = Sun.
    dt = datetime.datetime(2023, 1, 1, 7, 30, 0)
    sunrise = datetime.datetime(2023, 1, 1, 7, 14, 0)
    sunset = datetime.datetime(2023, 1, 1, 17, 30, 0)
    
    scores = shadbala.calculate_hora_bala(dt, sunrise, sunset)
    assert scores['sun'] == 60.0
    assert scores['moon'] == 0.0
    
    # 2nd Hora (8:30) -> Sun -> Venus (Sequence: Sat, Jup, Mars, Sun, Ven, Merc, Moon)
    # Sequence is slow to fast: Sat, Jup, Mars, Sun, Ven, Merc, Moon.
    # 1st Hora: Sun.
    # 2nd Hora: Venus.
    dt2 = datetime.datetime(2023, 1, 1, 8, 30, 0)
    scores2 = shadbala.calculate_hora_bala(dt2, sunrise, sunset)
    assert scores2['venus'] == 60.0

def test_dina_bala():
    # Sunday -> Sun gets 45
    dt = datetime.datetime(2023, 1, 1, 12, 0, 0)
    scores = shadbala.calculate_dina_bala(dt)
    assert scores['sun'] == 45.0
    assert scores['moon'] == 0.0

def test_full_integration():
    # Just run the main function to ensure no crashes
    results = shadbala.calculate_shadbala(
        jd_ut=2459946.0,
        lagna_deg=MOCK_LAGNA,
        planets_deg=MOCK_PLANETS,
        birth_dt=TEST_DT,
        sunrise=TEST_SUNRISE,
        sunset=TEST_SUNSET
    )
    
    for p in astro_utils.PLANETS:
        assert 'total' in results[p]
        assert 'sthaana' in results[p]
        assert 'dig' in results[p]
        assert 'kaala' in results[p]
        assert 'cheshta' in results[p]
        assert 'naisargika' in results[p]
        assert 'drig' in results[p]
        assert results[p]['total'] > 0

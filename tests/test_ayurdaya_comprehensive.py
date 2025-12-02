
import pytest
from backend import ayurdaya

class TestAyurdayaComprehensive:

    def test_lagna_contribution_pindayu(self):
        """Test that Lagna contributes Navamsa years in Pindayu."""
        # Lagna at 45 degrees (Taurus 15).
        # Navamsa span = 3.333...
        # Years = 45 / 3.333... = 13.5 years.
        lagna_deg = 45.0
        planets = {'sun': 0, 'moon': 0, 'mars': 0, 'mercury': 0, 'jupiter': 0, 'venus': 0, 'saturn': 0}
        
        res = ayurdaya.calculate_pindayu(planets, lagna_deg)
        
        assert 'lagna' in res
        expected_years = 45.0 / (3 + 20/60.0)
        assert abs(res['lagna'] - expected_years) < 0.01

    def test_krurodaya_harana_malefic_in_lagna(self):
        """Test Krurodaya Harana: Malefic in Lagna reduces Lagna years by 50%."""
        # Lagna: 10 deg (Aries). House 1 (10 to 40).
        # Sun: 15 deg (Aries). House 1. Malefic.
        # Krurodaya should apply.
        lagna_deg = 10.0
        planets = {'sun': 15.0, 'moon': 180, 'mars': 180, 'mercury': 180, 'jupiter': 180, 'venus': 180, 'saturn': 180}
        speeds = {'sun': 1.0}
        
        # Raw years
        # Lagna contribution: 10 / 3.333 = 3.0 years.
        raw_years = {'lagna': 3.0, 'sun': 10.0, 'moon':0, 'mars':0, 'mercury':0, 'jupiter':0, 'venus':0, 'saturn':0}
        
        # Apply Harana
        # Sun is in House 1. Malefic.
        # Lagna should be reduced by 50%.
        # Sun also in House 1. House 1 safe from Vyayadi.
        
        net_years = ayurdaya.apply_haranas(raw_years, planets, lagna_deg, speeds)
        
        assert abs(net_years['lagna'] - 1.5) < 0.01 # 3.0 * 0.5

    def test_krurodaya_harana_no_malefic(self):
        """Test Krurodaya Harana: No Malefic in Lagna, no reduction."""
        lagna_deg = 10.0
        # Sun in 2nd house (45 deg).
        planets = {'sun': 45.0, 'moon': 180, 'mars': 180, 'mercury': 180, 'jupiter': 180, 'venus': 180, 'saturn': 180}
        speeds = {'sun': 1.0}
        
        raw_years = {'lagna': 3.0, 'sun': 10.0}
        
        net_years = ayurdaya.apply_haranas(raw_years, planets, lagna_deg, speeds)
        
        assert abs(net_years['lagna'] - 3.0) < 0.01

    def test_final_longevity_averaging(self):
        """Test that final longevity averages the three systems."""
        # Mocking raw calcs implicitly by checking the logic flow
        # We can just integration test with dummy values if we trust the sub-functions.
        # But better to trust the real calculation path.
        
        # Setup a case where systems produce different values.
        # Using default calc.
        jd_ut = 2460000.5
        lagna_deg = 0.0
        # All planets at 0 Aries.
        planets = {p: 0.0 for p in ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn']}
        
        # Pindayu: Sun at 0 (Debil - 10? No Exalt is Aries 10).
        # Sun at 0 Aries. Exaltation at 10 Aries.
        # Diff 10. Very close to Exaltation. Almost Max years.
        
        # Nisargayu: Similar.
        
        # Amsayu: 0 deg / 3.33 = 0 years.
        
        # We expect Pindayu/Nisargayu to be high, Amsayu to be 0.
        # Result should be average.
        
        # NOTE: We need swisseph available. If not, this might fail in some envs.
        # Assuming env has it as per system info.
        
        try:
            res = ayurdaya.calculate_final_longevity(jd_ut, lagna_deg, planets)
            p = res['pindayu_years']
            n = res['nisargayu_years']
            a = res['amsayu_years']
            final = res['final_longevity']
            
            assert abs(final - (p + n + a)/3.0) < 0.01
            assert a == 0.0 # Lagna 0, Planets 0
            assert p > 0
        except RuntimeError:
            pytest.skip("Swiss Ephemeris not available")


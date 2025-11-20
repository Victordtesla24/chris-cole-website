
import pytest
from backend import ayurdaya, btr_core

class TestAyurdaya:
    """Tests for Longevity calculation module."""

    def test_ayurdaya_integration(self):
        """Test that btr_core correctly exposes ayurdaya calculation."""
        jd_ut = 2460000.5
        lagna_deg = 45.0
        planets = {
            'sun': 120.0, 'moon': 180.0, 'mars': 60.0, 'mercury': 90.0, 
            'jupiter': 240.0, 'venus': 300.0, 'saturn': 30.0
        }
        
        # Note: calculate_final_longevity calls swisseph for speeds.
        # If swisseph is not set up in test env, we might need to mock it or expect failure.
        # But typically test env has swisseph.
        
        try:
            result = btr_core.calculate_longevity_span(jd_ut, lagna_deg, planets)
            assert isinstance(result, dict)
            assert 'final_longevity' in result
            assert 'pindayu_years' in result
            assert 'nisargayu_years' in result
            assert 'amsayu_years' in result
            assert result['final_longevity'] > 0
        except RuntimeError:
            pytest.skip("Swiss Ephemeris not available")

    def test_pindayu_logic(self):
        """Verify Pindayu calculation basics."""
        # Sun Exalted (Aries 10) -> Max Years (19)
        # Lagna not used for planetary pindayu directly, but function takes it.
        planets = {'sun': 10.0, 'moon': 0, 'mars': 0, 'mercury': 0, 'jupiter': 0, 'venus': 0, 'saturn': 0}
        res = ayurdaya.calculate_pindayu(planets, 0.0)
        assert abs(res['sun'] - 19.0) < 0.1
        
        # Sun Debilitated (Libra 10 -> 190 deg) -> Half Years (9.5)
        planets['sun'] = 190.0
        res = ayurdaya.calculate_pindayu(planets, 0.0)
        assert abs(res['sun'] - 9.5) < 0.1

    def test_amsayu_logic(self):
        """Verify Amsayu (Navamsa) calculation."""
        # Sun at Pisces 27 (357 deg).
        # Amsayu = 357 / 3.333 = 107.1 years.
        planets = {'sun': 357.0}
        res = ayurdaya.calculate_amsayu(planets, 0.0)
        assert abs(res['sun'] - 107.1) < 0.5

    def test_harana_combustion(self):
        """Verify Astangata Harana (Combustion Reduction)."""
        # Planet combust by Sun.
        # Sun at 100, Mars at 105 (Diff 5 < 17). Combust.
        # Mars should lose 1/2 of its years.
        planets = {'sun': 100.0, 'mars': 105.0, 'moon':0, 'mercury':0, 'jupiter':0, 'venus':0, 'saturn':0}
        lagna = 0.0
        speeds = {'mars': 1.0} # Direct
        
        # Raw years (arbitrary for test function)
        raw_years = {'mars': 10.0, 'sun': 10.0, 'moon':0, 'mercury':0, 'jupiter':0, 'venus':0, 'saturn':0}
        
        # Note: House Harana applies too if not controlled. 
        # Mars at 105 (Cancer, 4th from 0 Aries). 4th house has no reduction.
        # Sun at 100 (Cancer, 4th). No reduction.
        # So only combustion applies.
        
        net_years = ayurdaya.apply_haranas(raw_years, planets, lagna, speeds)
        
        # Mars: 10 * 0.5 = 5.0
        # If it failed, maybe another reduction applied? 
        # Or house calculation was wrong? 105 deg is Cancer. Lagna 0 is Aries. 
        # Cancer is 4th house. 12,11,10,9,8,7 have reductions. 4 does not.
        assert abs(net_years['mars'] - 5.0) < 0.1
        
        # Venus exempt from combustion reduction
        # But we must ensure Venus is NOT in enemy sign to verify combustion exemption isolation.
        # Venus at 105 (Cancer) is in Moon's sign. Venus is Enemy to Moon.
        # So Venus loses 1/3 from Satru Kshetra if we don't fix it.
        # Make Venus Retrograde to exempt from Satru Kshetra?
        # Or move Venus to Friend sign.
        # Friend of Venus: Mercury, Saturn.
        # Sun at 100 (Cancer).
        # Can we move Venus to Gemini (Mercury)? 60-90.
        # If Venus at 89, Sun at 100. Diff 11. Venus Combust orb is 10. Not Combust.
        # We need Venus close to Sun.
        # Let's put both in Gemini (Friend of Venus).
        # Sun at 70 (Gemini). Venus at 75 (Gemini). Diff 5. Combust.
        # Gemini Lord Mercury. Venus-Mercury are Friends. No Satru Harana.
        
        planets['sun'] = 70.0
        planets['venus'] = 75.0
        raw_years['venus'] = 10.0
        speeds['venus'] = 1.0 # Not retro
        # House check: Gemini 70. Aries 0. 3rd House. No Vyayadi.
        
        net_years = ayurdaya.apply_haranas(raw_years, planets, lagna, speeds)
        # Venus: Combustion (exempt) -> 0. Satru (Friend) -> 0. Vyayadi (3rd) -> 0.
        # Result: 10.0
        assert abs(net_years['venus'] - 10.0) < 0.1

    def test_harana_enemy_sign(self):
        """Verify Satru Kshetra Harana."""
        # Sun (Leo Lord) in Saturn's sign (Aquarius 300-330) -> Enemy.
        # Sun at 315 (Aquarius). Lagna 0 (Aries).
        # Aquarius is 11th house. 
        # 11th house has Vyayadi Harana! Malefic in 11th loses 1/2.
        # Satru Harana loses 1/3.
        # Max reduction applies. Max(1/2, 1/3) = 1/2.
        # So Sun loses 1/2, not 1/3.
        
        # To test Satru Harana isolation, place in enemy sign that is NOT 12,11,10,9,8,7.
        # Houses 1, 2, 3, 4, 5, 6 are safe from Vyayadi.
        # Sun (Leo Lord). Enemy: Venus, Saturn.
        # Venus signs: Taurus (2nd), Libra (7th - reduction).
        # Saturn signs: Cap (10th - reduction), Aqua (11th - reduction).
        # So place Sun in Taurus (2nd house).
        # Sun in Taurus (30-60). Say 45 deg.
        # Taurus Lord is Venus. Sun-Venus are enemies.
        # Sun is not Retrograde.
        # Sun in 2nd house -> No Vyayadi.
        
        planets = {'sun': 45.0, 'saturn': 0, 'moon':0, 'mars':0, 'mercury':0, 'jupiter':0, 'venus':0}
        lagna = 0.0
        speeds = {'sun': 1.0} # Direct
        raw_years = {'sun': 18.0, 'saturn':0, 'moon':0, 'mars':0, 'mercury':0, 'jupiter':0, 'venus':0}
        
        # Note: 45 deg is Taurus. Lord Venus.
        # Sun relationship to Venus: -1 (Enemy).
        # House 2. No Vyayadi.
        # Only Satru Harana should apply (1/3).
        
        net_years = ayurdaya.apply_haranas(raw_years, planets, lagna, speeds)
        
        # 18 * (1 - 1/3) = 18 * 2/3 = 12.
        assert abs(net_years['sun'] - 12.0) < 0.1

    def test_selection_logic(self):
        """Test BPHS selection logic based on Shadbala."""
        # Mock data
        jd_ut = 2460000.5
        lagna_deg = 0.0 # Aries
        planets = {
            'sun': 10.0, 'moon': 120.0, 'mars': 200.0, 
            'mercury': 50.0, 'jupiter': 300.0, 'venus': 150.0, 'saturn': 10.0
        }
        
        # Case 1: Sun strongest -> Pindayu
        shadbala_rupas = {'sun': 10.0, 'moon': 5.0, 'mars': 5.0}
        res = ayurdaya.calculate_final_longevity(jd_ut, lagna_deg, planets, shadbala_rupas)
        assert res['selected_system'] == 'pindayu'
        assert res['final_longevity'] == res['pindayu_years']
        
        # Case 2: Moon strongest -> Nisargayu
        shadbala_rupas = {'sun': 5.0, 'moon': 10.0, 'mars': 5.0}
        res = ayurdaya.calculate_final_longevity(jd_ut, lagna_deg, planets, shadbala_rupas)
        assert res['selected_system'] == 'nisargayu'
        assert res['final_longevity'] == res['nisargayu_years']
        
        # Case 3: Lagna Lord (Mars for Aries) strongest -> Amsayu
        shadbala_rupas = {'sun': 5.0, 'moon': 5.0, 'mars': 10.0}
        res = ayurdaya.calculate_final_longevity(jd_ut, lagna_deg, planets, shadbala_rupas)
        assert res['selected_system'] == 'amsayu'
        assert res['final_longevity'] == res['amsayu_years']
        
        # Case 4: No Shadbala -> Average
        res = ayurdaya.calculate_final_longevity(jd_ut, lagna_deg, planets)
        assert res['selected_system'] == 'average'
        avg = (res['pindayu_years'] + res['nisargayu_years'] + res['amsayu_years']) / 3.0
        assert abs(res['final_longevity'] - avg) < 0.01


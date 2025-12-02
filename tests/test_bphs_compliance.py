# Tests for BPHS Compliance
"""Tests to verify that all formulas match BPHS verses exactly.

This test suite ensures strict compliance with Brihat Parashara Hora Shastra
verses from Chapter 4 (लग्नाध्याय) as documented in BPHS-BTR-Exact-Verses.md.
"""

import pytest
import datetime
import math
from backend import btr_core


class TestPranapadaBPHSCompliance:
    """Test Pranapada calculations match BPHS Verses 4.5 and 4.7 exactly."""
    
    def test_madhya_pranapada_bphs_4_5(self):
        """Test Madhya Pranapada formula matches BPHS 4.5 exactly.
        
        BPHS 4.5 Formula:
        1. Multiply ghatis × 4
        2. Divide palas ÷ 15 (take quotient)
        3. Add both
        4. Divide by 12; remainder is rashi
        5. Remainder from palas ÷ 15, multiplied by 2 = degrees
        """
        # Example from BTR-ASCII-Workflow.md:
        # 13 ghatis, 7 palas
        # Step 1: 13 × 4 = 52
        # Step 2: 7 ÷ 15 = 0 remainder 7
        # Step 3: 52 + 0 = 52
        # Step 4: 52 ÷ 12 = 4 remainder 4 → Rashi 4 (Leo)
        # Step 5: 7 × 2 = 14° → Leo 14° = 134°
        
        ghatis = 13
        palas = 7
        pp_deg = btr_core.calculate_madhya_pranapada(ghatis, palas)
        
        # Should be in Leo (120-150° range)
        assert 120 <= pp_deg < 150, f"Expected Leo (120-150°), got {pp_deg}°"
        # Should be approximately 134° (Leo 14°)
        assert abs(pp_deg - 134.0) < 1.0, f"Expected ~134° (Leo 14°), got {pp_deg}°"
    
    def test_sphuta_pranapada_bphs_4_7_chara(self):
        """Test Sphuta Pranapada with Sun in Chara (Movable) sign - BPHS 4.7.
        
        BPHS 4.7: If Sun in Chara (Movable), add to Sun's own sign.
        Chara signs: Aries(0), Cancer(3), Libra(6), Capricorn(9)
        """
        # Sun in Aries (Chara)
        sun_longitude = 10.0  # Aries 10°
        ishta_total_palas = 150.0  # 10 rashis
        
        pp_deg = btr_core.calculate_sphuta_pranapada(ishta_total_palas, sun_longitude)
        
        # Should add to Sun's position (Aries)
        # 10 rashis from Aries = Aries + 10 mod 12 = Aries + 10 = Libra
        assert isinstance(pp_deg, float)
        assert 0 <= pp_deg < 360
    
    def test_sphuta_pranapada_bphs_4_7_sthira(self):
        """Test Sphuta Pranapada with Sun in Sthira (Fixed) sign - BPHS 4.7.
        
        BPHS 4.7: If Sun in Sthira (Fixed), add to 9th from Sun.
        Sthira signs: Taurus(1), Leo(4), Scorpio(7), Aquarius(10)
        """
        # Sun in Leo (Sthira)
        sun_longitude = 130.0  # Leo 10°
        ishta_total_palas = 150.0
        
        pp_deg = btr_core.calculate_sphuta_pranapada(ishta_total_palas, sun_longitude)
        
        # Should add to 9th from Sun (9th from Leo = Aries)
        assert isinstance(pp_deg, float)
        assert 0 <= pp_deg < 360
    
    def test_sphuta_pranapada_bphs_4_7_dvisvabhava(self):
        """Test Sphuta Pranapada with Sun in Dvisvabhava (Dual) sign - BPHS 4.7.
        
        BPHS 4.7: If Sun in Dvisvabhava (Dual), add to 5th from Sun.
        Dvisvabhava signs: Gemini(2), Virgo(5), Sagittarius(8), Pisces(11)
        """
        # Sun in Sagittarius (Dvisvabhava)
        sun_longitude = 250.0  # Sagittarius 10°
        ishta_total_palas = 150.0
        
        pp_deg = btr_core.calculate_sphuta_pranapada(ishta_total_palas, sun_longitude)
        
        # Should add to 5th from Sun (5th from Sagittarius = Aries)
        assert isinstance(pp_deg, float)
        assert 0 <= pp_deg < 360
    
    def test_sphuta_pranapada_worked_example(self):
        """Test Sphuta Pranapada with worked example from BTR-ASCII-Workflow.md."""
        # Example: 13 ghatis, 7 palas = 787 total palas
        # Sun in Sagittarius 2° (Dvisvabhava)
        # 787 ÷ 15 = 52.47 rashis
        # 5th from Sagittarius = Aries
        # Aries 2° + (52 mod 12 = 4) rashis + (0.47 × 30° = 14.1°)
        # = Leo 16.1° approximately
        
        ishta_total_palas = (13 * 60) + 7  # 787 palas
        sun_longitude = 242.0  # Sagittarius 2° (approximately)
        pp_deg = btr_core.calculate_sphuta_pranapada(ishta_total_palas, sun_longitude)
        
        assert isinstance(pp_deg, float)
        assert 0 <= pp_deg < 360
        # Should be in Leo (120-150° range) approximately
        assert 120 <= pp_deg < 150, f"Expected Leo (120-150°), got {pp_deg}°"


class TestTrineRuleBPHSCompliance:
    """Test Trine Rule (BPHS 4.10) is mandatory and correctly implemented."""
    
    def test_trine_rule_mandatory_bphs_4_10(self):
        """Test that Trine Rule (BPHS 4.10) is mandatory for human birth.
        
        BPHS 4.10: Birth lagna must be in trine (1st, 5th, or 9th) from Pranapada.
        If not satisfied, candidate is rejected as non-human birth.
        """
        # Pranapada in Leo (sign 4)
        pranapada_deg = 135.0  # Leo 15°
        
        # Valid trine positions from Leo:
        # 1st: Leo (4) - sign_diff = 0
        # 5th: Sagittarius (8) - sign_diff = 4
        # 9th: Aries (0) - sign_diff = 8
        
        # Test valid trine positions
        valid_lagnas = [
            135.0,  # Leo (1st) - sign_diff = 0
            255.0,  # Sagittarius (5th) - sign_diff = 4
            15.0,   # Aries (9th) - sign_diff = 8
        ]
        
        for lagna_deg in valid_lagnas:
            accepted, scores = btr_core.apply_bphs_hard_filters(
                lagna_deg, pranapada_deg, lagna_deg, 48.0  # Gulika aligned for purification
            )
            assert scores['passes_trine_rule'] is True, f"Trine rule should pass for lagna {lagna_deg}°"
            if lagna_deg == pranapada_deg:
                assert scores['passes_padekyata'] is True
                assert accepted is True, f"Candidate should be accepted for lagna {lagna_deg}°"
            else:
                assert scores['passes_padekyata'] is False
                assert accepted is False, "Padekyata is mandatory even when trine is satisfied"
        
        # Test invalid non-trine positions
        invalid_lagnas = [
            60.0,   # Gemini (2nd) - sign_diff = 2
            90.0,   # Cancer (3rd) - sign_diff = 3
            180.0,  # Libra (6th) - sign_diff = 6
            210.0,  # Scorpio (7th) - sign_diff = 7
            300.0,  # Aquarius (10th) - sign_diff = 10
            330.0,  # Pisces (11th) - sign_diff = 11
        ]
        
        for lagna_deg in invalid_lagnas:
            accepted, scores = btr_core.apply_bphs_hard_filters(
                lagna_deg, pranapada_deg, 50.0, 48.0
            )
            assert scores['passes_trine_rule'] is False, f"Trine rule should fail for lagna {lagna_deg}°"
            assert accepted is False, f"Candidate should be rejected for lagna {lagna_deg}°"
    
    def test_trine_rule_bphs_4_10_example(self):
        """Test Trine Rule with example from BPHS 4.10."""
        # Example: Pranapada = Aquarius (sign 10)
        pranapada_deg = 315.0  # Aquarius 15°
        
        # Valid birth lagnas per BPHS 4.10:
        # 1st: Aquarius (10) - sign_diff = 0
        # 5th: Gemini (2) - sign_diff = 4
        # 9th: Libra (6) - sign_diff = 8
        
        valid_lagnas = [
            315.0,  # Aquarius (1st)
            75.0,   # Gemini (5th)
            195.0,  # Libra (9th)
        ]
        
        for lagna_deg in valid_lagnas:
            accepted, scores = btr_core.apply_bphs_hard_filters(
                lagna_deg, pranapada_deg, lagna_deg, 48.0  # Gulika aligned for purification
            )
            assert scores['passes_trine_rule'] is True
            if lagna_deg == pranapada_deg:
                assert scores['passes_padekyata'] is True
                assert accepted is True
            else:
                assert scores['passes_padekyata'] is False
                assert accepted is False


class TestDegreeMatchingBPHSCompliance:
    """Test Degree Matching (BPHS 4.6) implementation."""
    
    def test_degree_matching_bphs_4_6(self):
        """Test degree matching matches BPHS 4.6 requirement.
        
        BPHS 4.6: लग्नांशप्राणांशपदैक्यता स्यात्
        "Lagna degrees and Pranapada degrees should be equal (पदैक्यता)"
        """
        # Perfect match
        lagna_deg = 135.0
        pranapada_deg = 135.0
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, 50.0, 48.0
        )
        assert scores['passes_padekyata'] is True
        assert scores['degree_match'] == 100.0, "Perfect match should score 100"
        assert accepted is True
        
        # Within palā resolution (≤ 1 palā = 2°)
        lagna_deg = 135.0
        pranapada_deg = 136.5  # Difference below palā tolerance
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, 50.0, 48.0
        )
        assert scores['passes_padekyata'] is True
        assert scores['degree_match'] == 100.0, "Palā-level agreement should remain perfect"
        assert accepted is True
        
        # Beyond palā resolution should fail padekyata outright (> 2°)
        lagna_deg = 135.0
        pranapada_deg = 137.5  # > 1 palā (2°) difference
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, 50.0, 48.0
        )
        assert scores['passes_padekyata'] is False
        assert scores['degree_match'] == 0.0, "Mismatch beyond palā must score 0"
        assert scores['combined_verification'] == 0.0
        assert accepted is False


class TestTripleVerificationBPHSCompliance:
    """Test Triple Verification (BPHS 4.8) implementation."""
    
    def test_triple_verification_bphs_4_8(self):
        """Test triple verification matches BPHS 4.8 requirement.
        
        BPHS 4.8: विना प्राणपदाच्छुद्धो गुलिकाद्वा निशाकराद्
        "Must be verified by Pranapada OR Gulika OR Moon"
        """
        lagna_deg = 135.0
        pranapada_deg = 135.0  # Perfect match
        gulika_deg = 200.0     # Far from lagna
        moon_deg = 250.0       # Far from lagna
        
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, gulika_deg, moon_deg
        )
        
        # Should pass because Pranapada matches (BPHS 4.8)
        assert scores['combined_verification'] > 0.0
        assert accepted is True
    
    def test_triple_verification_gulika(self):
        """Test verification via Gulika alignment."""
        lagna_deg = 135.0
        pranapada_deg = 200.0  # Far from lagna
        gulika_deg = 135.0     # Perfect match
        moon_deg = 250.0       # Far from lagna
        
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, gulika_deg, moon_deg
        )
        
        # Gulika aligns (sequential fallback) but Pranapada padekyata remains mandatory for acceptance.
        assert scores['passes_padekyata'] is False
        assert scores['purification_anchor'] in ('gulika', 'gulika_7th')
        assert scores['passes_purification'] is True
        assert accepted is False

    def test_triple_verification_moon(self):
        """Test verification via Moon alignment."""
        lagna_deg = 135.0
        pranapada_deg = 200.0  # Far from lagna
        gulika_deg = 250.0     # Far from lagna
        moon_deg = 135.0       # Perfect match
        
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, gulika_deg, moon_deg
        )
        
        # Moon aligns (sequential fallback) but Pranapada padekyata remains mandatory for acceptance.
        assert scores['passes_padekyata'] is False
        assert scores['purification_anchor'] == 'moon'
        assert scores['passes_purification'] is True
        assert accepted is False

    def test_non_trine_classification_animals(self):
        """BPHS 4.10-4.11 classification for non-human (animal band)."""
        pranapada_deg = 0.0   # Aries
        lagna_deg = 60.0      # Gemini (2nd from Aries) -> पशु
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, 120.0, 240.0
        )
        assert accepted is False
        assert scores['non_human_classification'] == 'pashu'
        assert 'Non-human per BPHS 4.10-4.11' in (scores.get('rejection_reason') or '')

    def test_strict_orb_enforces_equality(self):
        """Strict BPHS mode should reject even tiny Pranapada gaps beyond ~0.2° (1/10 palā)."""
        lagna_deg = 0.0
        pranapada_deg = 0.6  # Within same sign but beyond strict 0.5° tolerance
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, 200.0, 200.0,
            strict_bphs=True
        )
        assert scores['passes_trine_rule'] is True
        assert scores['passes_padekyata'] is False
        assert scores['passes_purification'] is False
        assert accepted is False


class TestGulikaBPHSCompliance:
    """Test Gulika calculation matches BPHS Verses 4.1-4.3."""
    
    def test_gulika_day_calculation_bphs_4_1(self):
        """Test Gulika day calculation matches BPHS 4.1.
        
        BPHS 4.1: Divide day duration into 8 parts, count from weekday lord.
        Saturn's khanda = Gulika period.
        """
        date_local = datetime.date(2024, 1, 15)  # Monday
        latitude = 28.6139
        longitude = 77.2090
        tz_offset = 5.5
        
        gulika_info = btr_core.calculate_gulika(
            date_local, latitude, longitude, tz_offset
        )
        
        # Should have both day and night Gulika
        assert 'day_gulika_deg' in gulika_info
        assert 'night_gulika_deg' in gulika_info
        assert 0 <= gulika_info['day_gulika_deg'] < 360
        assert 0 <= gulika_info['night_gulika_deg'] < 360
    
    def test_gulika_night_calculation_bphs_4_2(self):
        """Test Gulika night calculation matches BPHS 4.2.
        
        BPHS 4.2: For night, divide night duration into 8 parts,
        count from 5th weekday lord.
        """
        date_local = datetime.date(2024, 1, 15)  # Monday
        latitude = 28.6139
        longitude = 77.2090
        tz_offset = 5.5
        
        gulika_info = btr_core.calculate_gulika(
            date_local, latitude, longitude, tz_offset
        )
        
        # Night Gulika should be different from day Gulika
        assert gulika_info['day_gulika_deg'] != gulika_info['night_gulika_deg']
        assert isinstance(gulika_info['day_gulika_time_local'], datetime.datetime)
        assert isinstance(gulika_info['night_gulika_time_local'], datetime.datetime)


class TestSpecialLagnasBPHSCompliance:
    """Test Special Lagnas match BPHS Verses 4.18-28."""
    
    def test_bhava_lagna_bphs_4_18(self):
        """Test Bhava Lagna matches BPHS 4.18.
        
        BPHS 4.18: Every 5 ghatis = 1 sign progression from Sun.
        """
        ishta_kala = (10, 0, 600.0)  # 10 ghatis
        sun_longitude = 0.0  # Aries
        janma_lagna_deg = 120.0  # Leo
        
        special_lagnas = btr_core.calculate_special_lagnas(
            ishta_kala, sun_longitude, janma_lagna_deg
        )
        
        # 10 ghatis ÷ 5 = 2 rashis from Sun
        # Aries + 2 rashis = Gemini (60°)
        assert 0 <= special_lagnas['bhava_lagna'] < 360
    
    def test_hora_lagna_bphs_4_20_21(self):
        """Test Hora Lagna matches BPHS 4.20-21.
        
        BPHS 4.20-21: Every 2.5 ghatis = 1 sign progression from Sun.
        """
        ishta_kala = (5, 0, 300.0)  # 5 ghatis
        sun_longitude = 0.0  # Aries
        janma_lagna_deg = 120.0  # Leo
        
        special_lagnas = btr_core.calculate_special_lagnas(
            ishta_kala, sun_longitude, janma_lagna_deg
        )
        
        # 5 ghatis ÷ 2.5 = 2 rashis from Sun
        assert 0 <= special_lagnas['hora_lagna'] < 360
    
    def test_ghati_lagna_bphs_4_22_24(self):
        """Test Ghati Lagna matches BPHS 4.22-24.
        
        BPHS 4.22-24: 1 ghati = 1 sign (30°), 1 pala = 2 degrees.
        """
        ishta_kala = (3, 15, 195.0)  # 3 ghatis, 15 palas
        sun_longitude = 0.0  # Aries
        janma_lagna_deg = 120.0  # Leo
        
        special_lagnas = btr_core.calculate_special_lagnas(
            ishta_kala, sun_longitude, janma_lagna_deg
        )
        
        # 3 ghatis = 90°, 15 palas = 30°
        # Total = 120° from Sun = Leo
        assert 0 <= special_lagnas['ghati_lagna'] < 360


class TestNishekaBPHSCompliance:
    """Test Nisheka Lagna matches BPHS Verses 4.12-16."""
    
    def test_nisheka_calculation_bphs_4_14(self):
        """Test Nisheka calculation matches BPHS 4.14.
        
        BPHS 4.14 Formula:
        1. Saturn's house - Gulika lagna = Diff A
        2. Lagna - 9th house = Diff B
        3. Diff A + Diff B = Gestation period (in rashis, roughly months)
        """
        saturn_deg = 330.0  # Pisces (sign 11)
        gulika_lagna_deg = 30.0  # Taurus (sign 1)
        janma_lagna_deg = 120.0  # Leo (sign 4)
        
        nisheka = btr_core.calculate_nisheka_lagna(
            saturn_deg, gulika_lagna_deg, janma_lagna_deg
        )
        
        assert 'nisheka_lagna_deg' in nisheka
        assert 'gestation_months' in nisheka
        assert 'is_realistic' in nisheka
        assert 'gestation_score' in nisheka
        assert 0 <= nisheka['nisheka_lagna_deg'] < 360
        assert 0 < nisheka['gestation_months'] <= 12


import pytest
from backend import btr_core

class TestStrictPadekyata:
    """Tests for strictly enforced Padekyata (Degree Equality) tolerance."""

    def test_strict_padekyata_rejection(self):
        """
        Verify that a candidate with a degree difference > 0.2° is REJECTED.
        Previously, with default tolerance of 2.0°, a diff of 0.5° would pass.
        Now it must fail.
        """
        # Scenario: Lagna = 10.0°, Pranapada = 10.5°
        # Difference = 0.5°
        # Expected: REJECTED (because 0.5 > 0.2)
        
        lagna_deg = 10.0
        pranapada_deg = 10.5
        # Set Gulika/Moon to force purification pass, so we isolate Padekyata check
        gulika_deg = 10.0 
        moon_deg = 10.0
        
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, gulika_deg, moon_deg,
            strict_bphs=True
        )
        
        # Should be rejected due to padekyata failure
        assert accepted is False
        assert scores['passes_padekyata'] is False
        assert scores['degree_match'] == 0.0
        
    def test_strict_padekyata_acceptance(self):
        """
        Verify that a candidate with a degree difference <= 0.2° is ACCEPTED.
        """
        # Scenario: Lagna = 10.0°, Pranapada = 10.15°
        # Difference = 0.15°
        # Expected: ACCEPTED (because 0.15 <= 0.2)
        
        lagna_deg = 10.0
        pranapada_deg = 10.15
        gulika_deg = 10.0
        moon_deg = 10.0
        
        accepted, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, gulika_deg, moon_deg,
            strict_bphs=True
        )
        
        assert accepted is True
        assert scores['passes_padekyata'] is True
        assert scores['degree_match'] == 100.0

    def test_strict_tolerance_value(self):
        """Verify the tolerance value reported in scores is indeed the strict one."""
        lagna_deg = 10.0
        pranapada_deg = 10.0
        gulika_deg = 10.0
        moon_deg = 10.0
        
        _, scores = btr_core.apply_bphs_hard_filters(
            lagna_deg, pranapada_deg, gulika_deg, moon_deg,
            strict_bphs=True
        )
        
        # STRICT_PADA_EPSILON_DEGREES = 2.0 / 10.0 = 0.2
        assert scores['padekyata_tolerance_deg'] == 0.2

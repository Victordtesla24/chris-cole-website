
import pytest
from backend import btr_core

class TestCanonicalVargas:
    """Tests for verifying canonical BPHS logic for specific Vargas."""

    def test_d9_navamsa_triplicity(self):
        """Verify D-9 Navamsa Triplicity logic."""
        # Movable (Aries 0°): Start Aries. 0°->Aries.
        res = btr_core.calculate_divisional_chart(0.0, {'p': 1.0}, 9)
        # 1.0 deg / (30/9) = 1.0 / 3.33 = 0.3 -> Segment 0.
        # Start Aries (0). Target = 0+0 = 0 (Aries).
        assert int(res['p'] / 30.0) == 0

        # Fixed (Leo 120°): Start 9th (Aries).
        # Leo is sign 4. 4%3 = 1 (Fixed).
        # Start = (4 + 8) % 12 = 0 (Aries).
        # 120.0 is start of Leo. 121.0 deg.
        # 1 deg in Leo -> Segment 0.
        # Target = 0 + 0 = 0 (Aries).
        res = btr_core.calculate_divisional_chart(0.0, {'p': 121.0}, 9)
        assert int(res['p'] / 30.0) == 0

        # Dual (Sagittarius 240°): Start 5th (Aries).
        # Sag is sign 8. 8%3 = 2 (Dual).
        # Start = (8 + 4) % 12 = 0 (Aries).
        # 241.0 deg -> Segment 0.
        res = btr_core.calculate_divisional_chart(0.0, {'p': 241.0}, 9)
        assert int(res['p'] / 30.0) == 0
        
        # Test 2nd Navamsa of Fixed Sign (Leo)
        # Segment 1 (3°20' to 6°40'). Let's take 5°.
        # Start = Aries (0). Target = 0+1 = 1 (Taurus).
        res = btr_core.calculate_divisional_chart(0.0, {'p': 125.0}, 9)
        assert int(res['p'] / 30.0) == 1

    def test_d16_shodasamsa_logic(self):
        """Verify D-16 Shodasamsa logic (Movable/Fixed/Dual)."""
        # Movable (Aries): Start Aries (0).
        # 0.5 deg (Segment 0). Target = 0.
        res = btr_core.calculate_divisional_chart(0.0, {'p': 0.5}, 16)
        assert int(res['p'] / 30.0) == 0
        
        # Fixed (Taurus): Start Leo (4).
        # Taurus (Sign 1).
        # 30.5 deg (Taurus 0.5 deg). Segment 0.
        # Target = (4 + 0) = 4 (Leo).
        res = btr_core.calculate_divisional_chart(0.0, {'p': 30.5}, 16)
        assert int(res['p'] / 30.0) == 4
        
        # Fixed (Taurus): Segment 1.
        # 30/16 = 1.875 deg per segment.
        # Test at 2.0 deg in Taurus (32.0 deg).
        # Segment 1.
        # Target = (4 + 1) = 5 (Virgo).
        res = btr_core.calculate_divisional_chart(0.0, {'p': 32.0}, 16)
        assert int(res['p'] / 30.0) == 5

    def test_d45_akshayavedamsa_logic(self):
        """Verify D-45 Logic (Movable/Fixed/Dual)."""
        # Movable (Aries): Start Aries(0).
        # 0.1 deg. Segment 0. Target 0.
        res = btr_core.calculate_divisional_chart(0.0, {'p': 0.1}, 45)
        assert int(res['p'] / 30.0) == 0
        
        # Fixed (Leo): Start Leo(4).
        # 120.1 deg. Segment 0. Target 4.
        res = btr_core.calculate_divisional_chart(0.0, {'p': 120.1}, 45)
        assert int(res['p'] / 30.0) == 4
        
        # Dual (Sagittarius): Start Sagittarius(8).
        # 240.1 deg. Segment 0. Target 8.
        res = btr_core.calculate_divisional_chart(0.0, {'p': 240.1}, 45)
        assert int(res['p'] / 30.0) == 8


import pytest
from backend import btr_core

class TestShodasaVargas:
    """Tests for full 16-Varga (Shodasa Vargas) implementation."""

    def test_all_16_charts_generated(self):
        """Verify that calculate_shodasa_vargas returns all 16 required charts."""
        lagna_deg = 45.0
        planets = {
            'sun': 120.0,
            'moon': 180.0,
            'mars': 60.0,
            'mercury': 90.0,
            'jupiter': 240.0,
            'venus': 300.0,
            'saturn': 30.0,
            'rahu': 150.0,
            'ketu': 330.0
        }
        
        vargas = btr_core.calculate_shodasa_vargas(lagna_deg, planets)
        
        expected_keys = [
            'D-1', 'D-2', 'D-3', 'D-4', 'D-7', 'D-9', 'D-10', 'D-12',
            'D-16', 'D-20', 'D-24', 'D-27', 'D-30', 'D-40', 'D-45', 'D-60'
        ]
        
        for key in expected_keys:
            assert key in vargas, f"Missing varga chart: {key}"
            assert 'lagna' in vargas[key]
            assert 'sun' in vargas[key]

    def test_d2_hora_logic(self):
        """Verify Parashara D-2 Hora logic (Odd: Sun/Moon, Even: Moon/Sun)."""
        # Sun in Aries 5° (Odd sign, < 15°) -> Sun Hora (Leo)
        res = btr_core.calculate_divisional_chart(0.0, {'sun': 5.0}, 2)
        sun_sign = int(res['sun'] / 30.0)
        assert sun_sign == 4 # Leo (Index 4)
        
        # Moon in Aries 20° (Odd sign, >= 15°) -> Moon Hora (Cancer)
        res = btr_core.calculate_divisional_chart(0.0, {'moon': 20.0}, 2)
        moon_sign = int(res['moon'] / 30.0)
        assert moon_sign == 3 # Cancer (Index 3)
        
        # Sun in Taurus 5° (Even sign, < 15°) -> Moon Hora (Cancer)
        res = btr_core.calculate_divisional_chart(0.0, {'sun': 35.0}, 2)
        sun_sign = int(res['sun'] / 30.0)
        assert sun_sign == 3 # Cancer
        
        # Moon in Taurus 20° (Even sign, >= 15°) -> Sun Hora (Leo)
        res = btr_core.calculate_divisional_chart(0.0, {'moon': 50.0}, 2)
        moon_sign = int(res['moon'] / 30.0)
        assert moon_sign == 4 # Leo

    def test_d30_trimsamsa_logic(self):
        """Verify Parashara D-30 Trimsamsa logic."""
        # Odd Sign (Aries):
        # 0-5: Mars (Aries)
        # 5-10: Saturn (Aquarius)
        # 10-18: Jupiter (Sagittarius)
        # 18-25: Mercury (Gemini)
        # 25-30: Venus (Libra)
        
        # Test 3° (Mars/Aries)
        res = btr_core.calculate_divisional_chart(0.0, {'p': 3.0}, 30)
        assert int(res['p'] / 30.0) == 0 # Aries
        
        # Test 8° (Saturn/Aquarius)
        res = btr_core.calculate_divisional_chart(0.0, {'p': 8.0}, 30)
        assert int(res['p'] / 30.0) == 10 # Aquarius
        
        # Even Sign (Taurus):
        # 0-5: Venus (Taurus)
        # 5-12: Mercury (Virgo)
        # 12-20: Jupiter (Pisces)
        
        # Test 33° (Taurus 3°) -> Venus (Taurus)
        res = btr_core.calculate_divisional_chart(0.0, {'p': 33.0}, 30)
        assert int(res['p'] / 30.0) == 1 # Taurus
        
        # Test 38° (Taurus 8°) -> Mercury (Virgo)
        res = btr_core.calculate_divisional_chart(0.0, {'p': 38.0}, 30)
        assert int(res['p'] / 30.0) == 5 # Virgo

    def test_d60_shashtiamsa_precision(self):
        """Verify D-60 calculation handles mapping correctly."""
        # 10 deg 0 min -> 20th Shashtiamsa (index 20, start from 0?)
        # 0-0.5 is segment 0.
        # 10.0 / 0.5 = 20. So segment 20 (21st part).
        # Absolute mapping: Int(AbsDeg / 0.5) % 12.
        # 10.0 maps to index 20 % 12 = 8 (Sagittarius).
        res = btr_core.calculate_divisional_chart(0.0, {'p': 10.0}, 60)
        assert int(res['p'] / 30.0) == 8

    def test_d16_shodasamsa_logic(self):
        """Verify D-16 Shodasamsa logic (Aries, Leo, Sagittarius start).
        BPHS 6.15: 'Ajasimhahayagvito' -> Starts from Aries, Leo, Sagittarius.
        Movable (1,4,7,10) -> Starts from Aries.
        Fixed (2,5,8,11) -> Starts from Leo.
        Dual (3,6,9,12) -> Starts from Sagittarius.
        """
        # Movable Sign (Aries): Should start from Aries
        # 0 degrees (1st Shodasamsa) -> Aries
        res = btr_core.calculate_divisional_chart(0.0, {'p': 0.5}, 16)
        assert int(res['p'] / 30.0) == 0 # Aries

        # Fixed Sign (Taurus): Should start from Leo
        # 30 degrees (1st Shodasamsa of Taurus) -> Leo
        res = btr_core.calculate_divisional_chart(0.0, {'p': 30.5}, 16)
        assert int(res['p'] / 30.0) == 4 # Leo

        # Dual Sign (Gemini): Should start from Sagittarius
        # 60 degrees (1st Shodasamsa of Gemini) -> Sagittarius
        res = btr_core.calculate_divisional_chart(0.0, {'p': 60.5}, 16)
        assert int(res['p'] / 30.0) == 8 # Sagittarius

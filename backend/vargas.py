"""Divisional Charts (Varga Charts) Calculation Module.

This module implements the calculation of the 16 Divisional Charts (Shodasa Vargas)
as defined in Brihat Parashara Hora Shastra (BPHS).
"""

import math
from typing import Dict

def calculate_divisional_chart(lagna_deg: float, planets: Dict[str, float], division: int) -> Dict[str, float]:
    """Calculate divisional chart positions for all planets.
    
    BPHS Reference: Divisional charts used for specific life areas.
    Supports standard Parasara method for 16 Vargas (Shodasa Vargas).
    
    Special rules handled:
    - D-2 (Hora): Sun/Moon ruled based on odd/even signs.
    - D-30 (Trimsamsa): Complex degree ranges based on odd/even signs.
    - D-1 to D-60: Standard regular divisions for others.
    
    Args:
        lagna_deg: Ascendant longitude in degrees.
        planets: Dict of planet longitudes (sun, moon, mars, etc.).
        division: Division number (1-60).
        
    Returns:
        Dict with divisional chart positions for lagna and all planets.
    """
    divisional_positions = {}
    
    # Combine lagna into the items to process to avoid code duplication
    items = planets.copy()
    items['lagna'] = lagna_deg
    
    for name, deg in items.items():
        sign = int(math.floor(deg / 30.0)) % 12
        deg_in_sign = deg % 30.0
        is_odd = (sign % 2 == 0)  # Aries=0 (Odd), Taurus=1 (Even)
        
        varga_deg = 0.0
        
        if division == 1:
            # D-1: Rashi (Root)
            varga_deg = deg
            
        elif division == 2:
            # D-2: Hora (Parasara)
            # Odd signs: 0-15 -> Sun (Leo), 15-30 -> Moon (Cancer)
            # Even signs: 0-15 -> Moon (Cancer), 15-30 -> Sun (Leo)
            is_first_half = deg_in_sign < 15.0
            
            if is_odd:
                # Odd: Sun first, Moon second
                target_sign = 4 if is_first_half else 3 # Leo=4, Cancer=3
            else:
                # Even: Moon first, Sun second
                target_sign = 3 if is_first_half else 4
                
            # Place in middle of sign for visualization or just start?
            # Usually vargas are mapped to a sign. We'll map to 15 deg of that sign.
            varga_deg = (target_sign * 30.0) + 15.0
            
        elif division == 30:
            # D-30: Trimsamsa (Parasara)
            # Odd Signs: 
            # 0-5: Mars (Aries), 5-10: Saturn (Aquarius), 10-18: Jupiter (Sagittarius), 
            # 18-25: Mercury (Gemini), 25-30: Venus (Libra)
            # Even Signs: 
            # 0-5: Venus (Taurus), 5-12: Mercury (Virgo), 12-20: Jupiter (Pisces), 
            # 20-25: Saturn (Capricorn), 25-30: Mars (Scorpio)
            
            target_sign = 0
            
            if is_odd:
                if deg_in_sign < 5: target_sign = 0 # Aries (Mars)
                elif deg_in_sign < 10: target_sign = 10 # Aquarius (Saturn)
                elif deg_in_sign < 18: target_sign = 8 # Sagittarius (Jupiter)
                elif deg_in_sign < 25: target_sign = 2 # Gemini (Mercury)
                else: target_sign = 6 # Libra (Venus)
            else:
                if deg_in_sign < 5: target_sign = 1 # Taurus (Venus)
                elif deg_in_sign < 12: target_sign = 5 # Virgo (Mercury)
                elif deg_in_sign < 20: target_sign = 11 # Pisces (Jupiter)
                elif deg_in_sign < 25: target_sign = 9 # Capricorn (Saturn)
                else: target_sign = 7 # Scorpio (Mars)
                
            varga_deg = (target_sign * 30.0) + 15.0
            
        else:
            # Standard Regular Divisions (D-3 to D-60 excluding specials)
            division_size = 30.0 / division
            segment = int(math.floor(deg_in_sign / division_size)) # 0 to division-1
            if segment >= division: segment = division - 1
            
            target_sign = 0
            
            if division == 3:
                # D-3: Drekkana (Sign, 5th, 9th)
                target_sign = (sign + (segment * 4)) % 12
                
            elif division == 4:
                # D-4: Chaturthamsa (Sign, 4th, 7th, 10th)
                target_sign = (sign + (segment * 3)) % 12
                
            elif division == 7:
                # D-7: Saptamsa (Odd: Sign, Even: 7th)
                start_sign = sign if is_odd else (sign + 6) % 12
                target_sign = (start_sign + segment) % 12
                
            elif division == 9:
                # D-9: Navamsa (Movable: Sign, Fixed: 9th, Dual: 5th)
                if sign % 3 == 0:   # Movable
                    start_sign = sign
                elif sign % 3 == 1: # Fixed
                    start_sign = (sign + 8) % 12
                else:               # Dual
                    start_sign = (sign + 4) % 12
                target_sign = (start_sign + segment) % 12
                
            elif division == 10:
                # D-10: Dasamsa (Odd: Sign, Even: 9th)
                start_sign = sign if is_odd else (sign + 8) % 12
                target_sign = (start_sign + segment) % 12
                
            elif division == 12:
                # D-12: Dwadasamsa (Start from Sign)
                target_sign = (sign + segment) % 12
                
            elif division == 16:
                # D-16: Shodasamsa (Aja-Simha-Haya: 1, 5, 9)
                # Chara (Movable): Aries, Sthira (Fixed): Leo, Dvisvabhava (Dual): Sag
                if sign % 3 == 0:   # Movable
                    start_sign = 0
                elif sign % 3 == 1: # Fixed
                    start_sign = 4
                else:               # Dual
                    start_sign = 8
                target_sign = (start_sign + segment) % 12
                    
            elif division == 20:
                # D-20: Vimsamsa (Movable: Aries, Fixed: Sagittarius, Dual: Leo)
                if sign % 3 == 0:   # Movable
                    start_sign = 0
                elif sign % 3 == 1: # Fixed
                    start_sign = 8
                else:               # Dual
                    start_sign = 4
                target_sign = (start_sign + segment) % 12
                
            elif division == 24:
                # D-24: Siddhamsa (Odd: Leo, Even: Cancer)
                start_sign = 4 if is_odd else 3
                target_sign = (start_sign + segment) % 12
                
            elif division == 27:
                # D-27: Nakshatramsa (Fire: Aries, Earth: Cancer, Air: Libra, Water: Capricorn)
                element = sign % 4
                start_sign = (element * 3) % 12
                target_sign = (start_sign + segment) % 12
                
            elif division == 40:
                # D-40: Khavedamsa (Odd: Aries, Even: Libra)
                start_sign = 0 if is_odd else 6
                target_sign = (start_sign + segment) % 12
                
            elif division == 45:
                # D-45: Akshayavedamsa (Movable: Aries, Fixed: Leo, Dual: Sagittarius)
                if sign % 3 == 0:   # Movable
                    start_sign = 0
                elif sign % 3 == 1: # Fixed
                    start_sign = 4
                else:               # Dual
                    start_sign = 8
                target_sign = (start_sign + segment) % 12
                
            elif division == 60:
                # D-60: Shashtiamsa (Start from Sign)
                target_sign = (sign + segment) % 12
                
            else:
                # Generic Fallback
                target_sign = (sign + segment) % 12
                
            # Calculate degree within the varga sign
            deg_in_segment = deg_in_sign % division_size
            varga_deg_in_sign = (deg_in_segment / division_size) * 30.0
            varga_deg = (target_sign * 30.0) + varga_deg_in_sign
            
        divisional_positions[name] = varga_deg % 360.0
    
    return divisional_positions

def calculate_shodasa_vargas(lagna_deg: float, planets: Dict[str, float]) -> Dict[str, Dict[str, float]]:
    """Calculate all 16 Parashari Divisional Charts (Shodasa Vargas).
    
    Charts calculated:
    D-1 (Rashi), D-2 (Hora), D-3 (Drekkana), D-4 (Chaturthamsa), 
    D-7 (Saptamsa), D-9 (Navamsa), D-10 (Dasamsa), D-12 (Dwadasamsa),
    D-16 (Shodasamsa), D-20 (Vimsamsa), D-24 (Siddhamsa), 
    D-27 (Nakshatramsa), D-30 (Trimsamsa), D-40 (Khavedamsa), 
    D-45 (Akshayavedamsa), D-60 (Shashtiamsa).
    
    Args:
        lagna_deg: Ascendant longitude.
        planets: Dictionary of planet longitudes.
        
    Returns:
        Dict keyed by division name (e.g. 'D-1', 'D-9') containing chart positions.
    """
    divisions = {
        'D-1': 1,
        'D-2': 2,
        'D-3': 3,
        'D-4': 4,
        'D-7': 7,
        'D-9': 9,
        'D-10': 10,
        'D-12': 12,
        'D-16': 16,
        'D-20': 20,
        'D-24': 24,
        'D-27': 27,
        'D-30': 30,
        'D-40': 40,
        'D-45': 45,
        'D-60': 60
    }
    
    vargas = {}
    for name, div_num in divisions.items():
        vargas[name] = calculate_divisional_chart(lagna_deg, planets, div_num)
        
    return vargas

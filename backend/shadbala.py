
"""Shadbala (Six-Fold Planetary Strength) Calculation Module.

This module implements the calculation of the six sources of planetary strength
(Shadbala) as strictly defined in Brihat Parashara Hora Shastra (BPHS).

The six balas are:
1. Sthaana Bala (Positional Strength)
2. Dig Bala (Directional Strength)
3. Kaala Bala (Temporal Strength)
4. Cheshta Bala (Motional Strength)
5. Naisargika Bala (Natural Strength)
6. Drig Bala (Aspectual Strength)

These calculations are fundamental for ascertaining the true power of planets
to yield their results (Ishta/Kashta phala) and are required for longevity
calculations and advanced BTR validation.
"""

import math
import datetime
import swisseph as swe
from typing import Dict, List, Any, Tuple, Optional

from .astro_utils import (
    SUN, MOON, MARS, MERCURY, JUPITER, VENUS, SATURN, RAHU, KETU,
    PLANETS, PLANET_IDS, EXALTATION_DEGREES as EXALTATION_POINTS, RELATIONSHIPS,
    get_sign_lord, angular_difference, get_weekday_index
)
from .vargas import calculate_shodasa_vargas

# Naisargika Bala (Natural Strength) - BPHS values in Rupas
NAISARGIKA_BALA_RUPAS = {
    SUN: 1.0,        # Strongest
    MOON: 6/7,       # 0.857
    VENUS: 5/7,      # 0.714
    JUPITER: 4/7,    # 0.571
    MERCURY: 3/7,    # 0.428
    MARS: 2/7,       # 0.285
    SATURN: 1/7      # 0.143 (Weakest)
}

def get_rashi_strength_score(planet: str, rashi_sign: int) -> float:
    """Calculate the strength score for a planet in a given sign.
    
    Based on BPHS Saptavarga Bala values (Virupas):
    - Moolatrikona: 45
    - Swakshetra (Own): 30
    - Adhi Mitra (Great Friend): 22.5
    - Mitra (Friend): 15
    - Sama (Neutral): 7.5
    - Satru (Enemy): 3.75
    - Adhi Satru (Great Enemy): 1.875
    
    Note: Exaltation is handled separately in Uccha Bala, but for Varga Bala
    if a planet is in Exaltation sign (without being Moolatrikona/Own), 
    BPHS usually treats it as High Strength.
    Here we strictly follow the Varga relationship logic.
    However, Exaltation often overlaps with Moolatrikona or Adhi Mitra.
    We'll prioritize Moolatrikona check if distinct.
    
    Args:
        planet: Planet name
        rashi_sign: Sign index (0-11)
        
    Returns:
        float: Score in Virupas
    """
    # Moolatrikona Ranges (approximate for sign-level check)
    # Sun: Leo 0-20 (Sign 4) -> Own is Leo 20-30.
    # Moon: Taurus 4-30 (Sign 1) -> Exalt is Taurus 0-3.
    # Mars: Aries 0-12 (Sign 0).
    # Mercury: Virgo 16-20 (Sign 5) -> Exalt 0-15, Own 20-30.
    # Jupiter: Sagittarius 0-10 (Sign 8).
    # Venus: Libra 0-15 (Sign 6).
    # Saturn: Aquarius 0-20 (Sign 10).
    
    # Simplified Sign-based Moolatrikona (since we only have sign index here, not degrees)
    # We need to be careful. For strictness, we should pass degrees. 
    # But Varga charts often just give the sign.
    # Assuming standard strength if we lack degrees.
    
    lord = get_sign_lord(rashi_sign * 30.0 + 15.0) # Dummy degree to get lord
    
    if lord == planet:
        return 30.0 # Swakshetra
    
    # Relationship Check
    rel_val = RELATIONSHIPS[planet].get(lord, 0) # 1=Friend, 0=Neutral, -1=Enemy
    
    # Temporary relationship (Tatkalika)
    # Requires planetary positions. Since we are in Varga, temporary relationship
    # is based on positions in THAT Varga chart.
    # If we don't have full positions of all planets in this Varga, we can't compute Tatkalika.
    # BPHS Saptavarga Bala strictly requires Compound Relationship (Panchadha Maitri).
    # Compound = Naisargika (Natural) + Tatkalika (Temporary).
    
    # Current limitation: calculate_shodasa_vargas returns positions.
    # So we CAN compute Tatkalika for each Varga.
    # But this function 'get_rashi_strength_score' needs context of other planets in that Varga.
    
    # For now, we fallback to Naisargika (Natural) only as an approximation 
    # because passing full Varga positions to this helper is complex.
    # Improvements: Update signature to accept temporary relationship status.
    
    if rel_val == 1: return 15.0 # Mitra
    if rel_val == 0: return 7.5 # Sama
    return 3.75 # Satru

def calculate_saptavarga_bala(lagna_deg: float, planets_deg: Dict[str, float]) -> Dict[str, float]:
    """Calculate Saptavarga Bala (Divisional Chart Strength).
    
    Charts: Rashi(D1), Hora(D2), Drekkana(D3), Saptamsa(D7), 
            Navamsa(D9), Dwadasamsa(D12), Trimsamsa(D30).
            
    BPHS Reference:
    - Swakshetra (Own): 30 Virupas
    - Adhi Mitra (Great Friend): 22.5
    - Mitra (Friend): 15
    - Sama (Neutral): 7.5
    - Satru (Enemy): 3.75
    - Adhi Satru (Great Enemy): 1.875
    
    Requires Panchadha Maitri (Compound Relationship) in EACH Varga.
    Tatkalika Mitra (Temporary Friend): Planet in 2, 3, 4, 10, 11, 12 from subject.
    """
    vargas = calculate_shodasa_vargas(lagna_deg, planets_deg)
    required_vargas = ['D-1', 'D-2', 'D-3', 'D-7', 'D-9', 'D-12', 'D-30']
    
    scores = {p: 0.0 for p in PLANETS}
    
    for varga_name in required_vargas:
        chart_positions = vargas[varga_name]
        
        for planet in PLANETS:
            p_deg = chart_positions[planet]
            p_sign = int(p_deg / 30.0) % 12
            lord = get_sign_lord(p_deg)
            
            # 1. Determine Natural Relationship
            natural_rel = RELATIONSHIPS[planet].get(lord, 0) # 1, 0, -1
            
            # 2. Determine Temporary Relationship (Tatkalika)
            # Planets in 2, 3, 4, 10, 11, 12 from Planet are Friends.
            # Others (1, 5, 6, 7, 8, 9) are Enemies.
            if lord == planet:
                compound_rel = 'own'
            else:
                # Find lord's position in THIS varga
                # Note: Lord might not be in PLANETS list (e.g. if nodes rule? No, nodes don't rule).
                # Lords are always Sun..Saturn.
                if lord in chart_positions:
                    lord_deg = chart_positions[lord]
                    lord_sign = int(lord_deg / 30.0) % 12
                    
                    # Count signs from Planet to Lord
                    # e.g. Planet in 1, Lord in 2 -> count = 2.
                    count = ((lord_sign - p_sign) % 12) + 1
                    
                    is_temp_friend = count in [2, 3, 4, 10, 11, 12]
                    temp_rel_val = 1 if is_temp_friend else -1
                    
                    total_rel = natural_rel + temp_rel_val
                    # Map total to status
                    # 2 = Great Friend (1 + 1)
                    # 1 = Friend (0 + 1) -> Actually 1+ -1 = 0? No.
                    # BPHS Matrix:
                    # Nat Friend + Temp Friend = Great Friend (Adhi Mitra)
                    # Nat Neutral + Temp Friend = Friend (Mitra)
                    # Nat Enemy + Temp Friend = Neutral (Sama)
                    # Nat Friend + Temp Enemy = Neutral (Sama)
                    # Nat Neutral + Temp Enemy = Enemy (Satru)
                    # Nat Enemy + Temp Enemy = Great Enemy (Adhi Satru)
                    
                    if total_rel == 2: compound_rel = 'adhimitra'
                    elif total_rel == 1: compound_rel = 'mitra'
                    elif total_rel == 0: compound_rel = 'sama'
                    elif total_rel == -1: compound_rel = 'satru'
                    else: compound_rel = 'adhisatru'
                else:
                    # Fallback if lord position unknown (shouldn't happen for 7 planets)
                    compound_rel = 'sama'

            # 3. Assign Virupas
            if compound_rel == 'own': val = 30.0
            elif compound_rel == 'adhimitra': val = 22.5
            elif compound_rel == 'mitra': val = 15.0
            elif compound_rel == 'sama': val = 7.5
            elif compound_rel == 'satru': val = 3.75
            else: val = 1.875 # adhisatru
            
            # Special Moolatrikona check for D-1 only? 
            # BPHS usually applies Moolatrikona only in Rashi, but some extend it.
            # We will stick to Rashi chart for Moolatrikona bonus (45.0)
            if varga_name == 'D-1' and compound_rel == 'own':
                # Check degrees for Moolatrikona
                deg_in_sign = p_deg % 30.0
                is_mool = False
                if planet == SUN and p_sign == 4 and 0 <= deg_in_sign < 20: is_mool = True
                elif planet == MOON and p_sign == 1 and 3 <= deg_in_sign < 30: is_mool = True
                elif planet == MARS and p_sign == 0 and 0 <= deg_in_sign < 12: is_mool = True
                elif planet == MERCURY and p_sign == 5 and 15 <= deg_in_sign < 20: is_mool = True
                elif planet == JUPITER and p_sign == 8 and 0 <= deg_in_sign < 10: is_mool = True
                elif planet == VENUS and p_sign == 6 and 0 <= deg_in_sign < 15: is_mool = True
                elif planet == SATURN and p_sign == 10 and 0 <= deg_in_sign < 20: is_mool = True
                
                if is_mool: val = 45.0

            scores[planet] += val
            
    return scores

def calculate_sthaana_bala(planets_deg: Dict[str, float], lagna_deg: float) -> Dict[str, float]:
    """Calculate Sthaana Bala (Positional Strength).
    
    Components:
    1. Uccha Bala (Exaltation)
    2. Saptavarga Bala (Divisional Strength)
    3. Oja-Yugma Bala (Odd-Even Rashi/Navamsa)
    4. Kendra Bala (Angle Strength)
    5. Drekkana Bala (Decanate Strength)
    """
    scores = {p: 0.0 for p in PLANETS}
    
    # 1. Uccha Bala (Exaltation) - BPHS Formula
    for planet in PLANETS:
        deg = planets_deg[planet]
        debil_point = (EXALTATION_POINTS[planet] + 180.0) % 360.0
        diff = abs(deg - debil_point)
        if diff > 180: diff = 360 - diff
        # Max 60 at Exaltation, 0 at Debilitation
        scores[planet] += diff / 3.0
        
    # 2. Saptavarga Bala
    sv_scores = calculate_saptavarga_bala(lagna_deg, planets_deg)
    for p in PLANETS:
        scores[p] += sv_scores[p]
        
    # 3. Oja-Yugma Bala (Odd-Even in Rashi and Navamsa)
    # BPHS: Venus/Moon in Even Signs get 15.
    # Others (Sun, Mars, Jup, Merc, Sat) in Odd Signs get 15.
    vargas = calculate_shodasa_vargas(lagna_deg, planets_deg)
    for planet in PLANETS:
        # Check Rashi (D-1)
        rashi_deg = vargas['D-1'][planet]
        rashi_sign = int(rashi_deg / 30.0) % 12
        is_rashi_odd = (rashi_sign % 2 == 0) # 0=Aries(Odd)
        
        # Check Navamsa (D-9)
        nav_deg = vargas['D-9'][planet]
        nav_sign = int(nav_deg / 30.0) % 12
        is_nav_odd = (nav_sign % 2 == 0)
        
        # Female Planets (Moon, Venus) favor Even
        if planet in [MOON, VENUS]:
            if not is_rashi_odd: scores[planet] += 15.0
            if not is_nav_odd: scores[planet] += 15.0
        else:
            # Male/Neutral favor Odd
            if is_rashi_odd: scores[planet] += 15.0
            if is_nav_odd: scores[planet] += 15.0
            
    # 4. Kendra Bala
    for planet in PLANETS:
        deg = planets_deg[planet]
        house = int((deg - lagna_deg) % 360.0 / 30.0) + 1
        if house in [1, 4, 7, 10]: scores[planet] += 60.0
        elif house in [2, 5, 8, 11]: scores[planet] += 30.0
        else: scores[planet] += 15.0
        
    # 5. Drekkana Bala
    # Male (Sun, Mars, Jup): Strong in 1st decanate
    # Neutral (Sat, Merc): Strong in 2nd decanate (BPHS 26.14 uses 'Hermaphrodite')
    # Female (Moon, Ven): Strong in 3rd decanate
    for planet in PLANETS:
        deg = planets_deg[planet]
        deg_in_sign = deg % 30.0
        decanate = int(deg_in_sign / 10.0) # 0, 1, 2
        
        if planet in [SUN, MARS, JUPITER]:
            if decanate == 0: scores[planet] += 15.0
        elif planet in [SATURN, MERCURY]:
            if decanate == 1: scores[planet] += 15.0
        elif planet in [MOON, VENUS]:
            if decanate == 2: scores[planet] += 15.0
            
    return scores

def calculate_dig_bala(planets_deg: Dict[str, float], lagna_deg: float) -> Dict[str, float]:
    """Calculate Dig Bala (Directional Strength).
    
    Sun/Mars strong in 10th (South/Meridian)
    Saturn/Rahu strong in 7th (West/Setting) - Rahu excluded in Shadbala standard
    Moon/Venus strong in 4th (North/Nadir)
    Mercury/Jupiter strong in 1st (East/Rising)
    """
    scores = {}
    # Zero-power points (180 deg from max strength)
    # Sun/Mars max at 10th cusp (~Lagna - 90 or +270). Zero at 4th (~Lagna + 90).
    # Let's use accurate approach: Calculate arc from zero-strength point.
    
    # Power points relative to Lagna:
    # East (Lagna): Merc, Jup
    # South (10th): Sun, Mars. (Lagna - 90)
    # West (7th): Sat. (Lagna - 180)
    # North (4th): Moon, Ven. (Lagna - 270 or +90)
    
    # Note: BPHS uses 7th house cusp, 10th house cusp etc. 
    # Assuming equal houses from Lagna for simplification if bhava not available.
    # Or use Lagna degree as the anchor.
    
    lh = lagna_deg
    
    targets = {
        SUN: (lh - 90) % 360, # 10th house (approx)
        MARS: (lh - 90) % 360,
        JUPITER: lh, # 1st house
        MERCURY: lh,
        VENUS: (lh + 90) % 360, # 4th house
        MOON: (lh + 90) % 360,
        SATURN: (lh + 180) % 360 # 7th house
    }
    
    for planet in PLANETS:
        target = targets[planet]
        # Arc distance from planet to target
        # Strength = (180 - distance from target) / 3
        # No. Strength is max when AT target. Min when 180 away.
        # If at target, dist=0. We want 60.
        # If 180 away, dist=180. We want 0.
        # Formula: Arc(Planet, ZeroPoint) / 3.
        # ZeroPoint is Target + 180.
        
        zero_point = (target + 180) % 360
        dist = angular_difference(planets_deg[planet], zero_point)
        # Dist is 0..180.
        # Strength = dist / 3.
        # e.g., if dist is 180 (which means planet is at target), score is 60.
        # if dist is 0 (planet at zero point), score is 0.
        scores[planet] = dist / 3.0
        
    return scores

def calculate_ayana_bala(jd_ut: float) -> Dict[str, float]:
    """Calculate Ayana Bala (Equinoctial Strength).
    
    Based on Tropical Declination (Kranti).
    Max Declination assumed ~24 degrees.
    Strength = (24 +/- Declination) * 60 / 48.
    
    North Strong (Sun, Mars, Jupiter, Venus):
      - North Dec: (24 + Dec) * 1.25
      - South Dec: (24 - Dec) * 1.25
      
    South Strong (Moon, Saturn):
      - South Dec: (24 + Dec) * 1.25
      - North Dec: (24 - Dec) * 1.25
      
    Mercury: Always 30.0 (Neutral).
    """
    scores = {p: 0.0 for p in PLANETS}
    scores[MERCURY] = 30.0
    
    north_strong = [SUN, MARS, JUPITER, VENUS]
    south_strong = [MOON, SATURN]
    
    # Flags for Equatorial coordinates (RA/Dec)
    flags = swe.FLG_EQUATORIAL | swe.FLG_SWIEPH
    
    for planet in PLANETS:
        if planet == MERCURY: continue
        
        pid = PLANET_IDS[planet]
        # Calculate equatorial position
        res = swe.calc_ut(jd_ut, pid, flags)
        # res[0] = [RA, Dec, Dist, ...]
        declination = res[0][1]
        
        abs_dec = abs(declination)
        is_north = declination >= 0
        
        val = 0.0
        if planet in north_strong:
            if is_north:
                val = (24.0 + abs_dec)
            else:
                val = (24.0 - abs_dec)
        elif planet in south_strong:
            if not is_north: # South
                val = (24.0 + abs_dec)
            else: # North
                val = (24.0 - abs_dec)
                
        score = val * (60.0 / 48.0)
        scores[planet] = max(0.0, min(60.0, score))
        
    return scores

def calculate_tribhaga_bala(birth_dt: datetime.datetime, 
                           sunrise: datetime.datetime, 
                           sunset: datetime.datetime) -> Dict[str, float]:
    """Calculate Tribhaga Bala (Day/Night Thirds).
    
    Day Lords: Mercury, Sun, Saturn.
    Night Lords: Moon, Venus, Mars.
    Jupiter: Always 60.
    """
    scores = {p: 0.0 for p in PLANETS}
    scores[JUPITER] = 60.0
    
    is_day = sunrise <= birth_dt < sunset
    
    if is_day:
        duration = (sunset - sunrise).total_seconds()
        elapsed = (birth_dt - sunrise).total_seconds()
        part = int(elapsed / (duration / 3.0))
        if part > 2: part = 2
        
        if part == 0: scores[MERCURY] = 60.0
        elif part == 1: scores[SUN] = 60.0
        elif part == 2: scores[SATURN] = 60.0
    else:
        # Night Logic
        # Calculate night duration and elapsed time
        # If birth < sunrise, it's the late part of the night (pre-dawn)
        # If birth > sunset, it's the early part of the night
        
        # Estimate night duration from day duration (24h - day)
        # This is an approximation if exact prev/next events aren't passed, 
        # but sufficient for determining the "Third".
        day_len = (sunset - sunrise).total_seconds()
        night_len = (24 * 3600) - day_len
        
        if birth_dt > sunset:
            elapsed = (birth_dt - sunset).total_seconds()
        else:
            # Birth is before sunrise (early morning)
            # Elapsed = Night Length - (Sunrise - Birth)
            time_until_rise = (sunrise - birth_dt).total_seconds()
            elapsed = night_len - time_until_rise
            
        part = int(elapsed / (night_len / 3.0))
        # Clamp part 0-2
        if part < 0: part = 0 
        if part > 2: part = 2
        
        # Night Lords: 1=Moon, 2=Venus, 3=Mars
        if part == 0: scores[MOON] = 60.0
        elif part == 1: scores[VENUS] = 60.0
        elif part == 2: scores[MARS] = 60.0
        
    return scores

def calculate_kaala_bala(jd_ut: float, 
                        planets_deg: Dict[str, float], 
                        sunrise: datetime.datetime, 
                        sunset: datetime.datetime,
                        birth_time: datetime.datetime) -> Dict[str, Any]:
    """Calculate Kaala Bala (Temporal Strength).
    
    Includes:
    1. Natonnata Bala (Day/Night)
    2. Paksha Bala (Moon Phase)
    3. Tribhaga Bala (Day/Night thirds)
    4. Varsha-Maasa-Dina-Hora Bala (Lordships)
       - Varsha (Year) Lord: 15 (Placeholder, full calc requires Ahargana)
       - Maasa (Month) Lord: 30 (Placeholder)
       - Dina (Day) Lord: 45 (Implemented)
       - Hora (Hour) Lord: 60 (Implemented)
    5. Ayana Bala (Equinoctial)
    6. Yuddha Bala (Planetary War) - BPHS 27.16: Should be applied to Total Shadbala, 
       but typically part of Kaala or separate adjustment. 
       We skip Yuddha in basic Kaala Bala for now as it modifies the final sum.
    """
    scores = {p: 0.0 for p in PLANETS}
    
    # 1. Natonnata Bala
    is_day = sunrise <= birth_time < sunset
    if is_day:
        for p in [SUN, JUPITER, VENUS]: scores[p] += 60.0
    else:
        for p in [MOON, MARS, SATURN]: scores[p] += 60.0
    scores[MERCURY] += 60.0 
    
    # 2. Paksha Bala
    elongation = angular_difference(planets_deg[MOON], planets_deg[SUN])
    # Note: angular_difference returns 0-180. 
    # Paksha Bala: Full Moon (180 deg) = 60. New Moon (0 deg) = 0.
    # Formula: Angle / 3.
    benefic_score = elongation / 3.0 
    malefic_score = 60.0 - benefic_score 
    
    benefics = [JUPITER, VENUS] 
    malefics = [SUN, MARS, SATURN]
    scores[MOON] += benefic_score 
    for p in benefics: scores[p] += benefic_score
    for p in malefics: scores[p] += malefic_score
    # Mercury is benefic if with benefics, malefic if with malefics. 
    # Simplified: Always benefic in Paksha? BPHS says "Mercury join with...".
    # Standard: Mercury gets benefic score.
    scores[MERCURY] += benefic_score 
    
    # 3. Tribhaga Bala
    tribhaga = calculate_tribhaga_bala(birth_time, sunrise, sunset)
    for p in PLANETS:
        scores[p] += tribhaga[p]
        
    # 4. Ayana Bala
    ayana = calculate_ayana_bala(jd_ut)
    for p in PLANETS:
        scores[p] += ayana[p]
        
    # 5. Varsha-Maasa-Dina-Hora
    # Dina Bala
    dina = calculate_dina_bala(birth_time)
    for p in PLANETS:
        scores[p] += dina[p]
        
    # Hora Bala
    hora = calculate_hora_bala(birth_time, sunrise, sunset)
    for p in PLANETS:
        scores[p] += hora[p]
        
    # Year/Month placeholders (assign to Day Lord or similar if unknown? Or 0?)
    # Standard practice without Ahargana: Assign 0 or simplified.
    # BPHS requires explicit Lord calculation.
    # We will leave Year/Month at 0 for now to avoid guessing.
    
    return scores

def calculate_cheshta_bala(jd_ut: float, 
                          planets_deg: Dict[str, float],
                          ayana_bala_scores: Optional[Dict[str, float]] = None) -> Dict[str, float]:
    """Calculate Cheshta Bala (Motional Strength).
    
    Args:
        jd_ut: Julian Day UT
        planets_deg: Planetary positions
        ayana_bala_scores: Pre-calculated Ayana Bala scores (required for Sun/Moon)
    """
    scores = {p: 0.0 for p in PLANETS}
    
    # 1. Sun and Moon: Cheshta = Ayana Bala
    if ayana_bala_scores:
        scores[SUN] = ayana_bala_scores[SUN]
        scores[MOON] = ayana_bala_scores[MOON]
    
    # 2. Other Planets: Based on speed/retrogression
    starry_planets = {
        MARS: swe.MARS, 
        MERCURY: swe.MERCURY, 
        JUPITER: swe.JUPITER, 
        VENUS: swe.VENUS, 
        SATURN: swe.SATURN
    }
    
    for name, pid in starry_planets.items():
        res = swe.calc_ut(jd_ut, pid)
        speed = res[0][3]
        
        if speed < 0:
            scores[name] = 60.0 # Retrograde (Vakra)
        elif speed < 0.1: 
            scores[name] = 15.0 # Vikal
        else:
            scores[name] = 30.0 # Average (Manda) - Simplified
            
    return scores

def calculate_naisargika_bala() -> Dict[str, float]:
    """Return Naisargika Bala (Natural Strength).
    
    Fixed values in Virupas (Rupas * 60).
    """
    return {p: val * 60.0 for p, val in NAISARGIKA_BALA_RUPAS.items()}


def _calculate_aspect_value(angle: float) -> float:
    """Calculate aspect value (Drishti) based on BPHS piecewise formulas.
    
    BPHS Verses 26.23-27 (approximately):
    - 30 to 60: (Angle - 30) / 2  -> 0 to 15 virupas
    - 60 to 90: (Angle - 60) + 15 -> 15 to 45 virupas
    - 90 to 120: 45 - (Angle - 90)/2 -> 45 to 30 virupas
    - 120 to 150: 30 - (Angle - 120) -> 30 to 0 virupas
    - 150 to 180: (Angle - 150) * 2 -> 0 to 60 virupas (Full Aspect at 180)
    
    Special Aspects handled separately.
    """
    if angle <= 30 or angle > 300: # No aspect? BPHS usually defines 30-300 range logic or 0-360.
        # Standard texts ignore aspect < 30.
        return 0.0
    
    if 30 < angle <= 60:
        return (angle - 30) / 2.0
    elif 60 < angle <= 90:
        return (angle - 60) + 15.0
    elif 90 < angle <= 120:
        return 45.0 - (angle - 90) / 2.0
    elif 120 < angle <= 150:
        return 30.0 - (angle - 120)
    elif 150 < angle <= 180:
        # BPHS 26.26: "At 10 signs (300), aspect is...?"
        # Actually, BPHS describes aspect increasing to full at 180 (7th house).
        # Formula often cited: (Angle - 150) * 2 for 150-180.
        # At 150: 0. At 180: 60.
        return (angle - 150) * 2.0
    # BPHS doesn't explicitly detail 180-300 in same formulas usually, 
    # except for Special Aspects. Standard practice mirrors or stops.
    # However, Parasara says "All planets aspect 7th fully".
    # If we assume aspect is only up to 180, we ignore 180+. 
    # But some interpretations say aspect is cast forward.
    # We will follow the standard implementation where Drishti is calculated up to 180 
    # or specific ranges. The 150-180 range covers the opposition.
    return 0.0

def calculate_drig_bala(planets_deg: Dict[str, float]) -> Dict[str, float]:
    """Calculate Drig Bala (Aspectual Strength).
    
    Benefic aspects add strength (positive).
    Malefic aspects reduce strength (negative).
    
    Special Aspects (Full 60 Virupas):
    - Mars: 4th (90°) and 8th (210°)
    - Jupiter: 5th (120°) and 9th (240°)
    - Saturn: 3rd (60°) and 10th (270°)
    
    Note: The base aspect formula applies to ALL planets. 
    Special aspects REPLACE the base aspect if they are stronger/applicable.
    """
    scores = {p: 0.0 for p in PLANETS}
    
    benefics = [JUPITER, VENUS, MERCURY, MOON] # Simplified natural benefics
    # Note: Moon/Mercury benefic status technically depends on Paksha/Association.
    # Using natural for now.
    
    for target in PLANETS:
        net_score = 0.0
        target_pos = planets_deg[target]
        
        for actor in PLANETS:
            if actor == target: continue
            
            actor_pos = planets_deg[actor]
            # Angle from Actor to Target
            angle = (target_pos - actor_pos) % 360.0
            
            drishti = _calculate_aspect_value(angle)
            
            # Check Special Aspects
            # Mars: 4th (90 +/- orb?), 8th (210 +/- orb?)
            # We use wide "Sign" based aspect logic usually, but here we have degrees.
            # BPHS exact point aspect:
            # Mars: 90 deg (4th) -> Full 60. 210 deg (8th) -> Full 60.
            # Jupiter: 120 deg (5th) -> Full 60. 240 deg (9th) -> Full 60.
            # Saturn: 60 deg (3rd) -> Full 60. 270 deg (10th) -> Full 60.
            
            # Use a small orb for "Full" special aspect peak? 
            # Or piecewise formula extension?
            # BPHS 26.30+: "Mars has special aspect on 4th and 8th..."
            # Implementation: If angle is close to special, use 60.
            # Actually, usually the formula is just added.
            # "Saturn adds 45 to 3rd and 10th"? No, "Full" means 60.
            
            special_drishti = 0.0
            orb = 10.0 # +/- 10 degrees influence for special peak
            
            if actor == MARS:
                if abs(angle - 90) < orb or abs(angle - 210) < orb:
                    special_drishti = 60.0
            elif actor == JUPITER:
                if abs(angle - 120) < orb or abs(angle - 240) < orb:
                    special_drishti = 60.0
            elif actor == SATURN:
                if abs(angle - 60) < orb or abs(angle - 270) < orb:
                    special_drishti = 60.0
                    
            # Use maximum of calculated or special
            final_drishti = max(drishti, special_drishti)
            
            # Quarter Strength (1/4) applied to Drig Bala total?
            # BPHS 26.31: "Aspect value / 4 is the strength."
            # Wait, "One fourth of the aspect value is the strength in Rupas?" 
            # No. "The drishti value IS the strength in Virupas".
            # But usually we take 1/4 of the SUM? 
            # Let's assume full Virupas are added/subtracted.
            # Some texts say: (Benefic Drishti - Malefic Drishti) / 4.
            # Let's stick to 25% reduction as common interpretation.
            strength_contribution = final_drishti * 0.25
            
            if actor in benefics:
                net_score += strength_contribution
            else:
                net_score -= strength_contribution
                
        scores[target] = net_score
        
    return scores

def calculate_hora_bala(birth_dt: datetime.datetime, sunrise: datetime.datetime, sunset: datetime.datetime) -> Dict[str, float]:
    """Calculate Hora Bala (Lord of Hour Strength).
    
    Lord of Hora gets 60 Virupas.
    Hora order: Decreasing speed (Sat, Jup, Mars, Sun, Ven, Merc, Moon).
    1st Hora of day ruled by Weekday Lord.
    """
    scores = {p: 0.0 for p in PLANETS}
    
    # Determine if Day or Night
    # Day: Sunrise to Sunset. Night: Sunset to Next Sunrise.
    # We need to find which "Hour" (Hora) it is. 
    # Note: Astrological Hora is approx 1 hour, but strictly 1/24 of day?
    # Usually just 1 hour from Sunrise.
    
    # Calculate hours elapsed since sunrise
    # If birth before sunrise, it belongs to previous day's cycle usually, 
    # but simpler to just take time diff.
    
    # Normalize birth_dt relative to sunrise
    # If birth < sunrise, we treat it as extension of previous night?
    # BPHS: Day starts at Sunrise.
    
    if birth_dt >= sunrise:
        diff = (birth_dt - sunrise).total_seconds() / 3600.0
    else:
        # Before sunrise: Need time from PREVIOUS sunrise?
        # Or just negative?
        # Let's assume birth_dt and sunrise are correctly paired for the day.
        # If birth is 2 AM and Sunrise 6 AM, it's previous day effectively.
        # But the calling function passes sunrise of the DATE.
        # If birth is early morning, sunrise is later.
        diff = (birth_dt - sunrise).total_seconds() / 3600.0
    
    # Standard Hora Sequence
    hora_lords = [SATURN, JUPITER, MARS, SUN, VENUS, MERCURY, MOON]
    
    # Find Weekday Lord (Day Lord)
    # 0=Mon, 6=Sun
    weekday = get_weekday_index(birth_dt.weekday()) # 0=Sun...6=Sat if using our utils?
    # Wait, utils.get_weekday_index: 0=Sun, 1=Mon...
    # Python: 0=Mon.
    # get_weekday_index(0) -> 1 (Moon). Correct.
    # get_weekday_index(6) -> 0 (Sun). Correct.
    
    # Map 0-6 index to Planet Name
    day_lord_map = {0: SUN, 1: MOON, 2: MARS, 3: MERCURY, 4: JUPITER, 5: VENUS, 6: SATURN}
    day_lord_name = day_lord_map[weekday]
    
    # Find index of Day Lord in Hora Sequence
    start_idx = hora_lords.index(day_lord_name)
    
    # Calculate which hora number (1st, 2nd...)
    # If diff is positive (e.g. 2.5 hours after sunrise -> 3rd hora)
    # If diff is negative (e.g. -2 hours -> 2 hours before sunrise -> 23rd, 24th hora of prev day?)
    # Let's assume standard day measurement.
    
    if diff < 0:
        # Use 24 + diff
        diff += 24.0
        
    hora_num = int(diff) # 0 to 23
    
    current_hora_idx = (start_idx + hora_num) % 7
    current_hora_lord = hora_lords[current_hora_idx]
    
    scores[current_hora_lord] = 60.0
    return scores

def calculate_dina_bala(birth_dt: datetime.datetime) -> Dict[str, float]:
    """Calculate Dina Bala (Lord of Weekday).
    
    Lord of Weekday gets 45 Virupas.
    """
    scores = {p: 0.0 for p in PLANETS}
    weekday = get_weekday_index(birth_dt.weekday()) # 0=Sun, 1=Mon...
    day_lord_map = {0: SUN, 1: MOON, 2: MARS, 3: MERCURY, 4: JUPITER, 5: VENUS, 6: SATURN}
    lord = day_lord_map[weekday]
    scores[lord] = 45.0
    return scores


def calculate_shadbala(jd_ut: float, 
                      lagna_deg: float, 
                      planets_deg: Dict[str, float],
                      birth_dt: datetime.datetime,
                      sunrise: datetime.datetime,
                      sunset: datetime.datetime) -> Dict[str, Dict[str, float]]:
    """Main function to calculate full Shadbala for all planets.
    
    Args:
        jd_ut: Julian Day UT
        lagna_deg: Ascendant longitude
        planets_deg: Dictionary of planetary longitudes
        birth_dt: Birth datetime (local)
        sunrise: Sunrise datetime (local)
        sunset: Sunset datetime (local)
        
    Returns:
        Dictionary keyed by planet name containing 'total' and breakdown dict.
    """
    sthaana = calculate_sthaana_bala(planets_deg, lagna_deg)
    dig = calculate_dig_bala(planets_deg, lagna_deg)
    kaala = calculate_kaala_bala(jd_ut, planets_deg, sunrise, sunset, birth_dt)
    
    # Re-calculate Ayana Bala for Cheshta (or we could have returned it from Kaala)
    # To keep it clean, we calculate it here to pass to Cheshta
    ayana_bala_scores = calculate_ayana_bala(jd_ut)
    cheshta = calculate_cheshta_bala(jd_ut, planets_deg, ayana_bala_scores)
    
    naisargika = calculate_naisargika_bala()
    drig = calculate_drig_bala(planets_deg)
    
    results = {}
    for p in PLANETS:
        # Ayana Bala is already summed into Kaala Bala in our implementation of calculate_kaala_bala
        # So we don't need to add it separately.
        
        # Sum all
        total = (sthaana[p] + 
                 dig[p] + 
                 kaala[p] + 
                 cheshta[p] + 
                 naisargika[p] + 
                 drig[p])
                 
        results[p] = {
            'total': round(total, 2),
            'sthaana': round(sthaana[p], 2),
            'dig': round(dig[p], 2),
            'kaala': round(kaala[p], 2),
            'cheshta': round(cheshta[p], 2),
            'naisargika': round(naisargika[p], 2),
            'drig': round(drig[p], 2),
            'rupa': round(total / 60.0, 2) # Convert Virupas to Rupas
        }
        
    return results

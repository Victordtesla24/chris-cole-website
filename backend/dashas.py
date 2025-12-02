"""Vimshottari Dasha System Module.

This module implements the Vimshottari Dasha calculation logic as defined
in Brihat Parashara Hora Shastra (BPHS).
"""

import math
import datetime
import swisseph as swe
from typing import Dict, List, Any

# Nakshatra lords in order (27 nakshatras, each 13°20')
# Each nakshatra is ruled by one of 9 planets in sequence
_NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',  # Ashwini to Mrigashira
    'Rahu', 'Jupiter', 'Saturn', 'Mercury',   # Ardra to Ashlesha
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',   # Magha to Chitra
    'Rahu', 'Jupiter', 'Saturn', 'Mercury',   # Swati to Jyeshtha
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',   # Mula to Dhanishta
    'Rahu', 'Jupiter', 'Saturn', 'Mercury'     # Shatabhisha to Revati
]

# Vimshottari dasha periods in years
_DASHA_PERIODS = {
    'Ketu': 7,
    'Venus': 20,
    'Sun': 6,
    'Moon': 10,
    'Mars': 7,
    'Rahu': 18,
    'Jupiter': 16,
    'Saturn': 19,
    'Mercury': 17
}

def get_moon_nakshatra(moon_longitude: float) -> int:
    """Get Moon's nakshatra number (0-26).
    
    Each nakshatra spans 13°20' (13.333... degrees).
    
    Args:
        moon_longitude: Moon's sidereal longitude in degrees (0-360).
        
    Returns:
        int: Nakshatra number (0-26).
    """
    nakshatra_span = 360.0 / 27.0  # 13°20'
    nakshatra_num = int(math.floor(moon_longitude / nakshatra_span)) % 27
    return nakshatra_num

def calculate_vimshottari_dasha(jd_ut_birth: float, moon_longitude: float) -> dict[str, Any]:
    """Calculate Vimshottari dasha sequence starting from birth.
    
    BPHS Reference: Vimshottari is primary among all dasha systems.
    
    Args:
        jd_ut_birth: Julian Day of birth in UT.
        moon_longitude: Moon's sidereal longitude in degrees.
        
    Returns:
        Dict with dasha sequence and start times.
    """
    nakshatra_num = get_moon_nakshatra(moon_longitude)
    nakshatra_lord = _NAKSHATRA_LORDS[nakshatra_num]
    
    # Calculate position within nakshatra (0-1)
    nakshatra_span = 360.0 / 27.0
    position_in_nakshatra = (moon_longitude % nakshatra_span) / nakshatra_span
    
    # Find starting dasha lord in sequence
    dasha_sequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
    start_index = dasha_sequence.index(nakshatra_lord)
    
    # Calculate remaining time in first dasha
    first_dasha_lord = nakshatra_lord
    first_dasha_years = _DASHA_PERIODS[first_dasha_lord]
    remaining_years = first_dasha_years * (1.0 - position_in_nakshatra)
    
    return {
        'nakshatra_num': nakshatra_num,
        'nakshatra_lord': nakshatra_lord,
        'first_dasha_lord': first_dasha_lord,
        'first_dasha_remaining_years': remaining_years,
        'dasha_sequence': dasha_sequence,
        'start_index': start_index
    }

def get_dasha_at_date(jd_ut_birth: float, event_date: datetime.date, moon_longitude: float) -> dict[str, Any]:
    """Get running Mahadasha-Antardasha at a given event date.
    
    Args:
        jd_ut_birth: Julian Day of birth in UT.
        event_date: Event date to check.
        moon_longitude: Moon's sidereal longitude at birth.
        
    Returns:
        Dict with 'mahadasha', 'antardasha', and their start/end dates.
    """
    dasha_info = calculate_vimshottari_dasha(jd_ut_birth, moon_longitude)
    
    # Calculate elapsed years from birth
    event_jd = swe.julday(event_date.year, event_date.month, event_date.day, 0.0)
    elapsed_days = event_jd - jd_ut_birth
    elapsed_years = elapsed_days / 365.25
    
    # Start from first dasha
    dasha_sequence = dasha_info['dasha_sequence']
    start_index = dasha_info['start_index']
    remaining_years = dasha_info['first_dasha_remaining_years']
    
    # If elapsed time is within first dasha
    if elapsed_years <= remaining_years:
        mahadasha_lord = dasha_sequence[start_index]
        mahadasha_years = _DASHA_PERIODS[mahadasha_lord]
        years_into_mahadasha = elapsed_years
    else:
        # Find which Mahadasha we're in
        current_years = remaining_years
        dasha_index = start_index
        
        # Move to next dashas until we exceed elapsed_years
        while current_years < elapsed_years:
            dasha_index = (dasha_index + 1) % len(dasha_sequence)
            mahadasha_lord = dasha_sequence[dasha_index]
            mahadasha_years = _DASHA_PERIODS[mahadasha_lord]
            if current_years + mahadasha_years >= elapsed_years:
                # Found the Mahadasha
                years_into_mahadasha = elapsed_years - current_years
                break
            current_years += mahadasha_years
        else: 
            # In case we overshoot (e.g. event very far in future)
            # Loop back? Or just return last?
            # For simplicity, assume normal lifespan range.
            mahadasha_lord = dasha_sequence[dasha_index]
            years_into_mahadasha = 0.0 # Should not happen with proper loop break
            mahadasha_years = _DASHA_PERIODS[mahadasha_lord]
            
    
    # Find Antardasha (sub-period within Mahadasha)
    antardasha_sequence = dasha_sequence.copy()
    # Rotate to start from Mahadasha lord
    while antardasha_sequence[0] != mahadasha_lord:
        antardasha_sequence.append(antardasha_sequence.pop(0))
    
    antardasha_index = 0
    antardasha_years_elapsed = 0.0
    
    for i, antardasha_lord in enumerate(antardasha_sequence):
        antardasha_years = (_DASHA_PERIODS[antardasha_lord] * mahadasha_years) / 120.0
        if antardasha_years_elapsed + antardasha_years >= years_into_mahadasha:
            antardasha_index = i
            break
        antardasha_years_elapsed += antardasha_years
    
    antardasha_lord = antardasha_sequence[antardasha_index]
    # antardasha_years is already calculated in the loop
    
    return {
        'mahadasha': mahadasha_lord,
        'antardasha': antardasha_lord,
        'years_into_mahadasha': years_into_mahadasha,
        'years_into_antardasha': years_into_mahadasha - antardasha_years_elapsed
    }

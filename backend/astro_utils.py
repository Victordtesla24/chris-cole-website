"""Astrological Utility Functions and Constants.

This module provides common constants and utility functions used across
BTR Core, Shadbala, and Ayurdaya modules to avoid code duplication.
"""

import math
import swisseph as swe
from typing import Dict

# Planet Constants
SUN = 'sun'
MOON = 'moon'
MARS = 'mars'
MERCURY = 'mercury'
JUPITER = 'jupiter'
VENUS = 'venus'
SATURN = 'saturn'
RAHU = 'rahu'
KETU = 'ketu'

PLANETS = [SUN, MOON, MARS, MERCURY, JUPITER, VENUS, SATURN]

# Swiss Ephemeris Planet IDs
PLANET_IDS = {
    SUN: swe.SUN,
    MOON: swe.MOON,
    MARS: swe.MARS,
    MERCURY: swe.MERCURY,
    JUPITER: swe.JUPITER,
    VENUS: swe.VENUS,
    SATURN: swe.SATURN,
    RAHU: swe.MEAN_NODE
}

# Exaltation Degrees (Deep Exaltation Points)
# Unified from shadbala.py and ayurdaya.py
EXALTATION_DEGREES = {
    SUN: 10.0,      # Aries 10
    MOON: 33.0,     # Taurus 3
    MARS: 298.0,    # Capricorn 28
    MERCURY: 165.0, # Virgo 15
    JUPITER: 95.0,  # Cancer 5
    VENUS: 357.0,   # Pisces 27
    SATURN: 200.0   # Libra 20
}

# Planetary Relationships (Friend/Neutral/Enemy)
# 1=Friend, 0=Neutral, -1=Enemy
# Unified from shadbala.py and ayurdaya.py
RELATIONSHIPS = {
    SUN:     {SUN: 0, MOON: 1, MARS: 1, MERCURY: 0, JUPITER: 1, VENUS: -1, SATURN: -1},
    MOON:    {SUN: 1, MOON: 0, MARS: 0, MERCURY: 1, JUPITER: 0, VENUS: 0, SATURN: 0},
    MARS:    {SUN: 1, MOON: 1, MARS: 0, MERCURY: -1, JUPITER: 1, VENUS: 0, SATURN: 0},
    MERCURY: {SUN: 1, MOON: -1, MARS: 0, MERCURY: 0, JUPITER: 0, VENUS: 1, SATURN: 0},
    JUPITER: {SUN: 1, MOON: 1, MARS: 1, MERCURY: -1, JUPITER: 0, VENUS: -1, SATURN: 0},
    VENUS:   {SUN: -1, MOON: -1, MARS: 0, MERCURY: 1, JUPITER: 0, VENUS: 0, SATURN: 1},
    SATURN:  {SUN: -1, MOON: -1, MARS: -1, MERCURY: 1, JUPITER: 0, VENUS: 1, SATURN: 0}
}

def get_sign_lord_from_index(sign_index: int) -> str:
    """Get lord of zodiac sign index.
    
    Args:
        sign_index: Sign number (0=Aries, 1=Taurus, ..., 11=Pisces).
        
    Returns:
        str: Planet name (lowercase).
    """
    lords = [MARS, VENUS, MERCURY, MOON, SUN, MERCURY, VENUS, MARS, JUPITER, SATURN, SATURN, JUPITER]
    return lords[sign_index % 12]

def get_sign_lord(deg: float) -> str:
    """Get the planet ruling the sign of a given degree.
    
    Args:
        deg: Longitude in degrees (0-360).
        
    Returns:
        str: Planet name (lowercase).
    """
    return get_sign_lord_from_index(int(deg / 30.0))

def angular_difference(deg1: float, deg2: float) -> float:
    """Compute the minimum angular difference between two degrees on a circle.

    Args:
        deg1: First angle in degrees.
        deg2: Second angle in degrees.

    Returns:
        float: The smallest absolute difference (0–180).
    """
    diff = abs((deg1 - deg2) % 360.0)
    return min(diff, 360.0 - diff)

def get_house_from_lagna(planet_deg: float, lagna_deg: float) -> int:
    """Get house number (1-12) of planet from lagna.
    
    Args:
        planet_deg: Planet longitude in degrees.
        lagna_deg: Lagna longitude in degrees.
        
    Returns:
        int: House number (1-12).
    """
    diff = (planet_deg - lagna_deg) % 360.0
    house = int(math.floor(diff / 30.0)) + 1
    return house if house <= 12 else 1

def is_retrograde(speed: float) -> bool:
    """Check if planet is retrograde based on speed.
    
    Args:
        speed: Daily motion in degrees.
        
    Returns:
        bool: True if retrograde (speed < 0).
    """
    return speed < 0

def get_weekday_index(py_weekday: int) -> int:
    """Convert Python weekday (Monday=0) to BPHS weekday index (Sunday=0).

    Args:
        py_weekday: Python weekday where Monday=0, Sunday=6.

    Returns:
        int: An index 0–6 where 0=Sunday, 1=Monday, …, 6=Saturday.
    """
    return (py_weekday + 1) % 7

def calculate_upagrahas(sun_longitude: float) -> Dict[str, float]:
    """Calculate the longitudes of the five non-luminous planets (Upagrahas).
    
    BPHS Verses 3.53-56: dhumadyaprakashagrahanayanamaha
    
    Args:
        sun_longitude: Sun's sidereal longitude in degrees.
        
    Returns:
        Dict with keys: 'dhuma', 'vyatipata', 'parivesha', 'indrachapa', 'upaketu'
    """
    # BPHS 3.53: Dhuma = Sun + 4 signs, 13 degrees, 20 minutes
    # 4 signs = 120 degrees. 13 degrees. 20 minutes = 13.333... degrees.
    # Total = 133.333... degrees
    dhuma = (sun_longitude + 133 + (20 / 60.0)) % 360.0
    
    # BPHS 3.54: Vyatipata = 12 signs - Dhuma
    vyatipata = (360.0 - dhuma) % 360.0
    
    # BPHS 3.54: Parivesha = Vyatipata + 6 signs
    parivesha = (vyatipata + 180.0) % 360.0
    
    # BPHS 3.55: Indrachapa (Kodanda) = 12 signs - Parivesha
    indrachapa = (360.0 - parivesha) % 360.0
    
    # BPHS 3.55: Upaketu = Indrachapa + 16 degrees, 40 minutes
    # 16 degrees, 40 minutes = 16.666... degrees
    # The verse actually says to add 16d 40m, but also that adding 1 sign (30d) to Upaketu gives Sun.
    # Let's use the check: Upaketu = Sun - 1 sign
    upaketu = (sun_longitude - 30.0) % 360.0

    return {
        'dhuma': dhuma,
        'vyatipata': vyatipata,
        'parivesha': parivesha,
        'indrachapa': indrachapa,
        'upaketu': upaketu
    }

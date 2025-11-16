# BTR Core module

"""Core BPHS-based Birth Time Rectification utilities.

This module implements the astronomical and astrological calculations required
by the Birth Time Rectification (BTR) pipeline described in the BPHS verses.
Only rules explicitly appearing in Chapter 4 of Brihat Parāśara Horā Śāstra
are used here.  See `Birth-Time-Rectification-Verses.md` for the authoritative
verse translations on which these functions are based.

Important: All longitudes returned by these functions are sidereal (Lahiri),
not tropical. Swiss Ephemeris is used for high‑precision planetary positions,
sunrise/sunset, and house cusps.
"""

import math
import datetime
from typing import Tuple, List, Dict, Optional, Any

import swisseph as swe

from . import config

# Configure Swiss Ephemeris for sidereal calculations at import time
if config.EPHE_PATH:
    swe.set_ephe_path(config.EPHE_PATH)
# Set Lahiri ayanamsa for sidereal zodiac
swe.set_sid_mode(swe.SIDM_LAHIRI)

# Mapping of weekday index (0=Sunday) to its ruling planet in the classical
# sequence used by BPHS.  Indices correspond to the order of the seven days.
_PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']

def _weekday_index(py_weekday: int) -> int:
    """Convert Python weekday (Monday=0) to BPHS weekday index (Sunday=0).

    Args:
        py_weekday: Python weekday where Monday=0, Sunday=6.

    Returns:
        int: An index 0–6 where 0=Sunday, 1=Monday, …, 6=Saturday.
    """
    return (py_weekday + 1) % 7

def _datetime_to_jd_ut(dt: datetime.datetime, tz_offset: float) -> float:
    """Convert a naive local datetime into a Julian Day in UT.

    Args:
        dt: Local naive datetime (no tzinfo).
        tz_offset: Offset from UTC in hours (e.g. +5.5 for IST).

    Returns:
        float: Julian day number in UT.
    """
    # Convert local time to UTC by subtracting the offset
    dt_utc = dt - datetime.timedelta(hours=tz_offset)
    day_fraction = (dt_utc.hour +
                    dt_utc.minute / 60.0 +
                    dt_utc.second / 3600.0 +
                    dt_utc.microsecond / 3_600_000_000.0)
    return swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, day_fraction)

def _jd_to_datetime_local(jd_ut: float, tz_offset: float) -> datetime.datetime:
    """Convert a Julian Day in UT to a local naive datetime.

    Args:
        jd_ut: The Julian Day in UT.
        tz_offset: Offset from UTC in hours.

    Returns:
        datetime.datetime: Local naive datetime.
    """
    year, month, day, hour = swe.revjul(jd_ut)
    dt_utc = datetime.datetime(year, month, day) + datetime.timedelta(hours=hour)
    return dt_utc + datetime.timedelta(hours=tz_offset)

def compute_sidereal_lagna(jd_ut: float, latitude: float, longitude: float) -> float:
    """Compute the sidereal ascendant (lagna) in degrees.

    Uses Swiss Ephemeris house calculation to obtain the ascendant.  The
    sidereal ayanamsa has already been set globally.

    Args:
        jd_ut: Julian Day in UT.
        latitude: Geographic latitude (north positive) in degrees.
        longitude: Geographic longitude (east positive) in degrees.

    Returns:
        float: Ascendant longitude in degrees (0–360).
    
    Raises:
        RuntimeError: If Swiss Ephemeris calculation fails.
    """
    try:
        cusp, ascmc = swe.houses(jd_ut, latitude, longitude)
        asc = ascmc[0]
        if not isinstance(asc, (int, float)) or math.isnan(asc) or math.isinf(asc):
            raise RuntimeError(f"Swiss Ephemeris returned invalid ascendant value: {asc}")
        return asc % 360.0
    except Exception as e:
        raise RuntimeError(f"Swiss Ephemeris house calculation failed: {e}") from e

def compute_sun_moon_longitudes(jd_ut: float) -> Tuple[float, float]:
    """Compute the sidereal longitudes of the Sun and Moon.

    Args:
        jd_ut: Julian Day in UT.

    Returns:
        Tuple[float, float]: (sun_longitude, moon_longitude) in degrees.
    
    Raises:
        RuntimeError: If Swiss Ephemeris calculation fails.
    """
    try:
        ayan = swe.get_ayanamsa_ut(jd_ut)
        if not isinstance(ayan, (int, float)) or math.isnan(ayan) or math.isinf(ayan):
            raise RuntimeError(f"Swiss Ephemeris returned invalid ayanamsa: {ayan}")
        
        sun_result = swe.calc_ut(jd_ut, swe.SUN)
        if sun_result[1] < 0:
            raise RuntimeError(f"Swiss Ephemeris Sun calculation failed with error code: {sun_result[1]}")
        sun_longitude = (sun_result[0][0] - ayan) % 360.0
        
        moon_result = swe.calc_ut(jd_ut, swe.MOON)
        if moon_result[1] < 0:
            raise RuntimeError(f"Swiss Ephemeris Moon calculation failed with error code: {moon_result[1]}")
        moon_longitude = (moon_result[0][0] - ayan) % 360.0
        
        if math.isnan(sun_longitude) or math.isinf(sun_longitude):
            raise RuntimeError(f"Invalid sun longitude: {sun_longitude}")
        if math.isnan(moon_longitude) or math.isinf(moon_longitude):
            raise RuntimeError(f"Invalid moon longitude: {moon_longitude}")
        
        return sun_longitude, moon_longitude
    except RuntimeError:
        raise
    except Exception as e:
        raise RuntimeError(f"Swiss Ephemeris planet calculation failed: {e}") from e

def get_planet_positions(jd_ut: float) -> Dict[str, float]:
    """Get all planet positions (sidereal, Lahiri ayanamsa).
    
    Args:
        jd_ut: Julian Day in UT.
        
    Returns:
        Dict with keys: 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'
    
    Raises:
        RuntimeError: If Swiss Ephemeris calculation fails.
    """
    try:
        ayan = swe.get_ayanamsa_ut(jd_ut)
        if not isinstance(ayan, (int, float)) or math.isnan(ayan) or math.isinf(ayan):
            raise RuntimeError(f"Swiss Ephemeris returned invalid ayanamsa: {ayan}")
        
        positions = {}
        
        planets = {
            'sun': swe.SUN,
            'moon': swe.MOON,
            'mars': swe.MARS,
            'mercury': swe.MERCURY,
            'jupiter': swe.JUPITER,
            'venus': swe.VENUS,
            'saturn': swe.SATURN,
            'rahu': swe.MEAN_NODE
        }
        
        for name, planet_id in planets.items():
            calc_result = swe.calc_ut(jd_ut, planet_id)
            if calc_result[1] < 0:
                raise RuntimeError(f"Swiss Ephemeris {name} calculation failed with error code: {calc_result[1]}")
            calc = calc_result[0]
            longitude = (calc[0] - ayan) % 360.0
            if math.isnan(longitude) or math.isinf(longitude):
                raise RuntimeError(f"Invalid {name} longitude: {longitude}")
            positions[name] = longitude
        
        # Ketu is 180° from Rahu
        positions['ketu'] = (positions['rahu'] + 180.0) % 360.0
        
        return positions
    except RuntimeError:
        raise
    except Exception as e:
        raise RuntimeError(f"Swiss Ephemeris planet positions calculation failed: {e}") from e

def compute_sunrise_sunset(date_local: datetime.date,
                           latitude: float,
                           longitude: float,
                           tz_offset: float) -> Tuple[datetime.datetime, datetime.datetime]:
    """Compute the local sunrise and sunset times for a given date and location.

    The BPHS Gulika calculation requires accurate day and night durations.
    This function uses Swiss Ephemeris’s rise/transit function to determine
    the times of the Sun’s rising and setting relative to the local horizon,
    with the solar disc’s centre.

    Args:
        date_local: The calendar date in the local time zone.
        latitude: Geographic latitude (north positive) in degrees.
        longitude: Geographic longitude (east positive) in degrees.
        tz_offset: Local time zone offset from UTC in hours.

    Returns:
        Tuple[datetime.datetime, datetime.datetime]: (sunrise_local, sunset_local)
    """
    # Compute UT Julian Day at local midnight by subtracting tz_offset hours
    dt_mid_local = datetime.datetime.combine(date_local, datetime.time(0, 0))
    dt_mid_utc = dt_mid_local - datetime.timedelta(hours=tz_offset)
    jd_mid_ut = swe.julday(dt_mid_utc.year, dt_mid_utc.month, dt_mid_utc.day, 0.0)

    # Compute sunrise
    res_rise, tret_rise = swe.rise_trans(
        jd_mid_ut,
        swe.SUN,
        swe.CALC_RISE | swe.BIT_DISC_CENTER,
        (longitude, latitude, 0.0),
        0.0,
        0.0
    )
    # Compute sunset
    res_set, tret_set = swe.rise_trans(
        jd_mid_ut,
        swe.SUN,
        swe.CALC_SET | swe.BIT_DISC_CENTER,
        (longitude, latitude, 0.0),
        0.0,
        0.0
    )

    jd_rise_ut = tret_rise[0]
    jd_set_ut = tret_set[0]

    sunrise_local = _jd_to_datetime_local(jd_rise_ut, tz_offset)
    sunset_local = _jd_to_datetime_local(jd_set_ut, tz_offset)

    return sunrise_local, sunset_local

def calculate_gulika(date_local: datetime.date,
                     latitude: float,
                     longitude: float,
                     tz_offset: float) -> Dict[str, float]:
    """Calculate Gulika-lagna for the given date and location.

    Gulika is an upagraha defined as Saturn’s segment of the day or night
    divided into eight equal parts.  The day sequence starts from the
    weekday lord of the date (Sunday=Sun, Monday=Moon, …), while the night
    sequence starts from the planet ruling the fifth weekday from the date.

    Returns a dictionary containing the gulika ascendant in degrees for the
    daytime and nighttime segments, along with the mid‑times of those
    periods in local time for debugging.

    Args:
        date_local: Calendar date in local time zone.
        latitude: Geographic latitude (north positive).
        longitude: Geographic longitude (east positive).
        tz_offset: Hours offset from UTC.

    Returns:
        Dict[str, float]: {
            'day_gulika_deg': float,
            'night_gulika_deg': float,
            'day_gulika_time_local': datetime.datetime,
            'night_gulika_time_local': datetime.datetime
        }
    """
    sunrise_local, sunset_local = compute_sunrise_sunset(date_local, latitude, longitude, tz_offset)
    # Next day's sunrise for night calculations
    next_day = date_local + datetime.timedelta(days=1)
    next_sunrise_local, _ = compute_sunrise_sunset(next_day, latitude, longitude, tz_offset)

    # Daytime gulika
    # BPHS Verse 4.1-4.3: Divide day into 8 parts, count from weekday lord
    # Traditional sequence from weekday lord: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
    # Saturn is the 7th khanda (index 6) when counting from weekday lord
    # The 8th khanda (index 7) has no lord (Niresha) per BPHS 4.2
    day_duration = (sunset_local - sunrise_local).total_seconds()
    day_segment = day_duration / 8.0
    weekday_idx = _weekday_index(date_local.weekday())
    # Planet sequence: Sun(0), Moon(1), Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6)
    # Starting from weekday lord, find Saturn's position in the sequence
    # Saturn's index in the full sequence is 6
    # We need to find which khanda (0-7) corresponds to Saturn
    # If weekday lord is at position W in sequence [0,1,2,3,4,5,6], then:
    # Khanda 0 = weekday lord (position W)
    # Khanda 1 = next planet (position (W+1)%7)
    # ...
    # Khanda 6 = Saturn (position 6)
    # So we need: (W + khanda_index) % 7 == 6
    # khanda_index = (6 - W) % 7
    gulika_khanda_index = (6 - weekday_idx) % 7
    # Note: (6 - weekday_idx) % 7 will always give 0-6, never 7
    # Khanda 7 (8th khanda) has no lord (Niresha) per BPHS 4.2
    # If Saturn would fall on khanda 7, it should be on khanda 6 instead
    # However, since we have 7 planets and 8 khandas, Saturn can occupy khandas 0-6
    # The formula (6 - weekday_idx) % 7 correctly identifies Saturn's khanda
    gulika_day_start = sunrise_local + datetime.timedelta(seconds=day_segment * gulika_khanda_index)
    gulika_day_end = gulika_day_start + datetime.timedelta(seconds=day_segment)
    gulika_day_mid = gulika_day_start + datetime.timedelta(seconds=day_segment / 2.0)
    jd_gulika_day = _datetime_to_jd_ut(gulika_day_mid, tz_offset)
    day_gulika_deg = compute_sidereal_lagna(jd_gulika_day, latitude, longitude)

    # Nighttime gulika
    # BPHS Verse 4.2: For night, count from 5th weekday lord
    night_duration = (next_sunrise_local - sunset_local).total_seconds()
    night_segment = night_duration / 8.0
    # 5th weekday lord from current weekday (weekday_idx + 4) % 7
    night_start_weekday_idx = (weekday_idx + 4) % 7
    # Same logic: find Saturn's khanda from the night start weekday lord
    # BPHS 4.2: For night, count from 5th weekday lord
    gulika_night_khanda_index = (6 - night_start_weekday_idx) % 7
    gulika_night_start = sunset_local + datetime.timedelta(seconds=night_segment * gulika_night_khanda_index)
    gulika_night_end = gulika_night_start + datetime.timedelta(seconds=night_segment)
    gulika_night_mid = gulika_night_start + datetime.timedelta(seconds=night_segment / 2.0)
    jd_gulika_night = _datetime_to_jd_ut(gulika_night_mid, tz_offset)
    night_gulika_deg = compute_sidereal_lagna(jd_gulika_night, latitude, longitude)

    return {
        'day_gulika_deg': day_gulika_deg,
        'night_gulika_deg': night_gulika_deg,
        'day_gulika_time_local': gulika_day_mid,
        'night_gulika_time_local': gulika_night_mid
    }

def calculate_ishta_kala(candidate_local: datetime.datetime,
                         sunrise_local: datetime.datetime) -> Tuple[int, int, float]:
    """Compute the Ishta‑kāla between sunrise and the candidate time.

    Ishta‑kāla is the elapsed time since local sunrise expressed in
    traditional units: ghāṭis and palās.  One day comprises 60 ghāṭis;
    each ghāṭi comprises 60 palās; each palā is 24 seconds.

    Args:
        candidate_local: The candidate birth time (local naive datetime).
        sunrise_local: The local sunrise time (naive datetime).

    Returns:
        Tuple[int, int, float]: (ghatis, palas, total_palas)
    """
    delta_sec = (candidate_local - sunrise_local).total_seconds()
    if delta_sec < 0:
        delta_sec += 24 * 3600.0
    total_palas = delta_sec / 24.0
    ghatis = int(total_palas // 60)
    palas = int(total_palas % 60)
    return ghatis, palas, total_palas

def calculate_madhya_pranapada(ghatis: int, palas: int) -> float:
    """Compute Madhya Prāṇa‑pada longitude from ghāṭis and palās (BPHS 4.5).

    BPHS Verse 4.5:
    घटी चतुर्गुणा कार्यां तिथ्याप्तैश्च पलैर्युताः।
    दिनकरेणापहतं शेषं प्राणपदं स्मृतम्।

    Formula:
        1. Multiply the number of ghāṭis by 4.
        2. Divide the palās by 15 (take quotient).
        3. Add these two.
        4. Divide the sum by 12; remainder is the rāśi number.
        5. Multiply the remainder by 2 to get degrees within the rāśi.

    Args:
        ghatis: Number of ghāṭis elapsed since sunrise.
        palas: Number of palās (within current ghāṭi).

    Returns:
        float: Prāṇa‑pada longitude in degrees (0–360).
    """
    # Step 1: Ghatis × 4
    part1 = ghatis * 4
    
    # Step 2: Palas ÷ 15 (integer division for quotient)
    pala_quotient = palas // 15
    
    # Step 3: Add both
    total = part1 + pala_quotient
    
    # Step 4: Divide by 12, remainder is rashi
    rashi_index = total % 12
    
    # Step 5: Remainder from palas ÷ 15, multiplied by 2 for degrees
    # Per BPHS 4.6: "Double the remainder to get degrees"
    pala_remainder = palas % 15
    degrees = pala_remainder * 2.0
    
    # Convert to absolute longitude
    longitude = (rashi_index * 30.0) + degrees
    return longitude % 360.0

def calculate_sphuta_pranapada(ishta_total_palas: float,
                               sun_longitude: float) -> float:
    """Compute Sphuṭa Prāṇa‑pada longitude (BPHS 4.7).

    BPHS Verse 4.7:
    अथच--स्वेष्टकालं पलीकृत्य तिथ्याप्तं भादिकं च यत्।
    चरागद्विभके भानौ योज्यं स्वे नवमे सुते।
    स्फुट प्राणपदं तस्मात् पूर्ववच्छोधयेत्तनुम्।

    Method:
        1. Divide the full Ishta‑kāla (in palās) by 15 to obtain a rāśi fraction.
           Every 15 palās correspond to one zodiac sign (30°).
        2. Determine the nature of the Sun's sign:
           - Chara (Movable): 0,3,6,9 (Aries, Cancer, Libra, Capricorn)
           - Sthira (Fixed): 1,4,7,10 (Taurus, Leo, Scorpio, Aquarius)
           - Dvisvabhava (Dual): 2,5,8,11 (Gemini, Virgo, Sagittarius, Pisces)
        3. Add this rāśi fraction to:
           - the Sun's own sign if Chara (movable),
           - the 9th sign from the Sun if Sthira (fixed),
           - the 5th sign from the Sun if Dvisvabhava (dual).
        4. Convert the resulting sign and fraction to absolute longitude.

    Args:
        ishta_total_palas: Total palās elapsed since sunrise.
        sun_longitude: The Sun's sidereal longitude in degrees.

    Returns:
        float: The Sphuṭa Prāṇa‑pada longitude in degrees (0–360).
    """
    # Step 1: Divide palas by 15 to get rashi fraction
    # Every 15 palas = 1 rashi (30 degrees)
    rashi_fraction = ishta_total_palas / 15.0
    
    # Separate into whole rashis and fractional part
    sign_offset = int(math.floor(rashi_fraction))
    fraction_of_sign = rashi_fraction - sign_offset
    
    # Step 2: Determine Sun's rashi and its nature
    sun_sign = int(math.floor(sun_longitude / 30.0)) % 12
    nature_mod = sun_sign % 3
    
    # Step 3: Determine base sign based on Sun's nature
    if nature_mod == 0:
        # Chara (Movable): Add to Sun's own sign
        base_sign = sun_sign
    elif nature_mod == 1:
        # Sthira (Fixed): Add to 9th from Sun (9 signs = 270° = 8 mod 12)
        base_sign = (sun_sign + 8) % 12
    else:  # nature_mod == 2
        # Dvisvabhava (Dual): Add to 5th from Sun (5 signs = 150° = 4 mod 12)
        base_sign = (sun_sign + 4) % 12
    
    # Step 4: Add the rashi offset and convert to absolute longitude
    final_sign = (base_sign + sign_offset) % 12
    final_deg_in_sign = fraction_of_sign * 30.0
    longitude = (final_sign * 30.0 + final_deg_in_sign) % 360.0
    
    return longitude

def calculate_special_lagnas(ishta_kala: Tuple[int, int, float],
                             sun_longitude: float,
                             janma_lagna_deg: float) -> Dict[str, float]:
    """Calculate special lagnas per BPHS Verses 4.18-28.
    
    Calculates:
    1. Bhava Lagna (Verse 4.18): Every 5 ghatis = 1 sign progression
    2. Hora Lagna (Verses 4.20-21): Every 2.5 ghatis = 1 sign progression
    3. Ghati Lagna (Verses 4.22-24): 1 ghati = 1 sign, 1 pala = 2 degrees
    4. Varnada Lagna (Verses 4.26-28): Complex calculation from Janma + Hora lagnas
    
    Args:
        ishta_kala: Tuple of (ghatis, palas, total_palas)
        sun_longitude: Sun's sidereal longitude in degrees
        janma_lagna_deg: Birth ascendant longitude in degrees
        
    Returns:
        Dict with keys: 'bhava_lagna', 'hora_lagna', 'ghati_lagna', 'varnada_lagna'
    """
    ghatis, palas, total_palas = ishta_kala
    
    # 1. BHAVA LAGNA (BPHS 4.18)
    # Every 5 ghatis = 1 sign progression from Sun
    bhava_offset_rashis = ghatis / 5.0
    bhava_lagna = (sun_longitude + (bhava_offset_rashis * 30.0)) % 360.0
    
    # 2. HORA LAGNA (BPHS 4.20-21)
    # Every 2.5 ghatis = 1 sign progression from Sun
    hora_offset_rashis = ghatis / 2.5
    hora_lagna = (sun_longitude + (hora_offset_rashis * 30.0)) % 360.0
    
    # 3. GHATI LAGNA (BPHS 4.22-24)
    # 1 ghati = 1 sign (30°), 1 pala = 2 degrees
    ghati_offset_deg = (ghatis * 30.0) + (palas * 2.0)
    ghati_lagna = (sun_longitude + ghati_offset_deg) % 360.0
    
    # 4. VARNADA LAGNA (BPHS 4.26-28)
    # Complex calculation: Take Janma Lagna and Hora Lagna rashi numbers
    # If both odd or both even: Add them
    # If one odd, one even: Subtract (with adjustments)
    # Result is always an ODD sign
    janma_rashi_num = int(math.floor(janma_lagna_deg / 30.0)) + 1  # 1-12
    hora_rashi_num = int(math.floor(hora_lagna / 30.0)) + 1
    
    janma_odd = (janma_rashi_num % 2 == 1)
    hora_odd = (hora_rashi_num % 2 == 1)
    
    if janma_odd == hora_odd:
        # Both odd or both even: Add
        varnada_num = janma_rashi_num + hora_rashi_num
        if varnada_num > 12:
            varnada_num = varnada_num % 12
            if varnada_num == 0:
                varnada_num = 12
        # Ensure result is odd
        if varnada_num % 2 == 0:
            varnada_num = 12 - varnada_num
            if varnada_num == 0:
                varnada_num = 1
    else:
        # One odd, one even: Subtract
        if hora_rashi_num % 2 == 0:
            # Convert even to odd equivalent for calculation
            hora_adjusted = 13 - hora_rashi_num
        else:
            hora_adjusted = hora_rashi_num
        varnada_num = abs(janma_rashi_num - hora_adjusted)
        if varnada_num == 0:
            varnada_num = 1
        # Ensure result is odd
        if varnada_num % 2 == 0:
            varnada_num = 12 - varnada_num
            if varnada_num == 0:
                varnada_num = 1
    
    varnada_lagna = ((varnada_num - 1) * 30.0) % 360.0
    
    return {
        'bhava_lagna': bhava_lagna,
        'hora_lagna': hora_lagna,
        'ghati_lagna': ghati_lagna,
        'varnada_lagna': varnada_lagna
    }

def calculate_nisheka_lagna(saturn_deg: float,
                             gulika_lagna_deg: float,
                             janma_lagna_deg: float) -> Dict[str, Any]:
    """Calculate Nisheka (Conception) Lagna per BPHS Verses 4.12-16.
    
    BPHS Verse 4.14:
    Formula:
    1. Saturn's house - Gulika lagna = Diff A
    2. Lagna - 9th house = Diff B
    3. Diff A + Diff B = Gestation period (in rashis, roughly months)
    
    Args:
        saturn_deg: Saturn's sidereal longitude in degrees
        gulika_lagna_deg: Gulika lagna longitude in degrees
        janma_lagna_deg: Birth ascendant longitude in degrees
        
    Returns:
        Dict with keys: 'nisheka_lagna_deg', 'gestation_months', 'is_realistic', 'gestation_score'
    """
    saturn_rashi = int(math.floor(saturn_deg / 30.0)) % 12
    gulika_rashi = int(math.floor(gulika_lagna_deg / 30.0)) % 12
    lagna_rashi = int(math.floor(janma_lagna_deg / 30.0)) % 12
    
    # Difference A: Saturn rashi - Gulika rashi
    diff_a = (saturn_rashi - gulika_rashi) % 12
    
    # Difference B: Lagna rashi - 9th house rashi (9th = lagna + 8)
    ninth_house_rashi = (lagna_rashi + 8) % 12
    diff_b = (lagna_rashi - ninth_house_rashi) % 12
    
    # Total = Gestation period (in rashis, roughly months)
    total_rashis = (diff_a + diff_b) % 12
    if total_rashis == 0:
        total_rashis = 12
    
    gestation_months = float(total_rashis)
    
    # Realistic gestation: 5-10.5 months (150-320 days)
    is_realistic = 5.0 <= gestation_months <= 10.5
    
    # Nisheka lagna position (conception time lagna)
    # Subtract the gestation period from birth lagna
    nisheka_lagna_deg = (janma_lagna_deg - (total_rashis * 30.0)) % 360.0
    
    # Score: 100 if realistic, 50 if close, 0 if unrealistic
    if is_realistic:
        gestation_score = 100.0
    elif 4.0 <= gestation_months <= 11.0:
        gestation_score = 50.0
    else:
        gestation_score = 0.0
    
    return {
        'nisheka_lagna_deg': nisheka_lagna_deg,
        'gestation_months': gestation_months,
        'is_realistic': is_realistic,
        'gestation_score': gestation_score
    }

def _angular_difference(deg1: float, deg2: float) -> float:
    """Compute the minimum angular difference between two degrees on a circle.

    Args:
        deg1: First angle in degrees.
        deg2: Second angle in degrees.

    Returns:
        float: The smallest absolute difference (0–180).
    """
    diff = abs((deg1 - deg2) % 360.0)
    return min(diff, 360.0 - diff)

def apply_bphs_hard_filters(lagna_deg: float,
                            pranapada_deg: float,
                            gulika_deg: float,
                            moon_deg: float,
                            orb_tolerance: float = 2.0
                            ) -> Tuple[bool, Dict[str, float]]:
    """Apply BPHS hard filters to a single candidate time.

    BPHS Verses 4.6, 4.8, 4.10:
    This function enforces the three primary rectification conditions:
      1. Trine rule (BPHS 4.10) - MANDATORY: the lagna sign must be in 1st, 5th, 
         or 9th from the Prāṇa‑pada sign (human band). If not satisfied, 
         candidate is rejected as non-human birth.
      2. Lagna–Prāṇa‑pada degree equality (BPHS 4.6): the angular difference 
         should be within a small orb (±2° by default).
      3. Triple purification (BPHS 4.8): at least one of Prāṇa‑pada, Gulika, 
         or Moon must closely align with the lagna.

    Args:
        lagna_deg: Ascendant longitude in degrees.
        pranapada_deg: Sphuṭa Prāṇa‑pada longitude in degrees.
        gulika_deg: Gulika‑lagna longitude (choose appropriate day/night).
        moon_deg: Moon's longitude in degrees.
        orb_tolerance: Allowed orb (degrees) for equality (default: 2.0°).

    Returns:
        Tuple[bool, Dict[str, float]]: (is_accepted, scores)
        - is_accepted: True if candidate passes all mandatory filters
        - scores: Dictionary with verification scores (0-100) for each check
    """
    lagna_sign = int(math.floor(lagna_deg / 30.0)) % 12
    pranapada_sign = int(math.floor(pranapada_deg / 30.0)) % 12
    sign_diff = (lagna_sign - pranapada_sign) % 12
    passes_trine = sign_diff in (0, 4, 8)

    delta_pp = _angular_difference(lagna_deg, pranapada_deg)
    degree_match_score = max(0.0, (orb_tolerance - delta_pp) / orb_tolerance) * 100.0
    degree_match_score = min(100.0, degree_match_score)

    delta_gulika = min(_angular_difference(lagna_deg, gulika_deg),
                       _angular_difference((lagna_deg + 180.0) % 360.0, gulika_deg))
    gulika_score = max(0.0, (orb_tolerance - delta_gulika) / orb_tolerance) * 100.0
    gulika_score = min(100.0, gulika_score)

    delta_moon = _angular_difference(lagna_deg, moon_deg)
    moon_score = max(0.0, (orb_tolerance - delta_moon) / orb_tolerance) * 100.0
    moon_score = min(100.0, moon_score)

    combined_verification = max(degree_match_score, gulika_score, moon_score)

    is_accepted = passes_trine and (combined_verification > 0.0)

    scores = {
        'degree_match': round(degree_match_score, 2),
        'gulika_alignment': round(gulika_score, 2),
        'moon_alignment': round(moon_score, 2),
        'combined_verification': round(combined_verification, 2),
        'passes_trine_rule': passes_trine,
        'delta_pranapada_deg': round(delta_pp, 2)
    }

    return is_accepted, scores

def search_candidate_times(dob: datetime.date,
                           latitude: float,
                           longitude: float,
                           tz_offset: float,
                           start_time_str: str,
                           end_time_str: str,
                           step_minutes: int = 10,
                           sunrise_local: Optional[datetime.datetime] = None,
                           sunset_local: Optional[datetime.datetime] = None,
                           gulika_info: Optional[Dict[str, float]] = None
                           ) -> List[Dict]:
    """Search a range of times on a given date and filter by BPHS rules.

    Args:
        dob: The date of birth (local date).
        latitude: Birthplace latitude.
        longitude: Birthplace longitude.
        tz_offset: Time zone offset from UTC in hours.
        start_time_str: Starting local time ("HH:MM").
        end_time_str: Ending local time ("HH:MM").
        step_minutes: Step size between candidate times.
        sunrise_local: Optionally precomputed sunrise time.
        sunset_local: Optionally precomputed sunset time.
        gulika_info: Optionally precomputed gulika calculation dictionary.

    Returns:
        List[Dict]: List of candidate dictionaries that satisfy BPHS hard rules.
    """
    if sunrise_local is None or sunset_local is None:
        sunrise_local, sunset_local = compute_sunrise_sunset(dob, latitude, longitude, tz_offset)
    if gulika_info is None:
        gulika_info = calculate_gulika(dob, latitude, longitude, tz_offset)
    day_gulika_deg = gulika_info['day_gulika_deg']
    night_gulika_deg = gulika_info['night_gulika_deg']

    start_hour, start_min = map(int, start_time_str.split(':'))
    end_hour, end_min = map(int, end_time_str.split(':'))
    start_dt = datetime.datetime.combine(dob, datetime.time(start_hour, start_min))
    end_dt = datetime.datetime.combine(dob, datetime.time(end_hour, end_min))
    wrap_midnight = False
    if end_dt <= start_dt:
        wrap_midnight = True
        end_dt = end_dt + datetime.timedelta(days=1)

    candidates = []
    current_dt = start_dt
    while current_dt <= end_dt:
        candidate_local = current_dt
        use_day_gulika = sunrise_local <= candidate_local <= sunset_local
        gulika_deg = day_gulika_deg if use_day_gulika else night_gulika_deg

        jd_ut = _datetime_to_jd_ut(candidate_local, tz_offset)
        lagna_deg = compute_sidereal_lagna(jd_ut, latitude, longitude)
        planets = get_planet_positions(jd_ut)
        sun_deg = planets['sun']
        moon_deg = planets['moon']
        saturn_deg = planets['saturn']
        
        ghatis, palas, total_palas = calculate_ishta_kala(candidate_local, sunrise_local)
        madhya_pp = calculate_madhya_pranapada(ghatis, palas)
        sphuta_pp = calculate_sphuta_pranapada(total_palas, sun_deg)
        
        # Calculate special lagnas
        special_lagnas = calculate_special_lagnas((ghatis, palas, total_palas), sun_deg, lagna_deg)
        
        # Calculate Nisheka lagna
        nisheka = calculate_nisheka_lagna(saturn_deg, gulika_deg, lagna_deg)
        
        accepted, scores = apply_bphs_hard_filters(lagna_deg, sphuta_pp, gulika_deg, moon_deg)
        if accepted:
            candidate_record = {
                'time_local': candidate_local.strftime('%Y-%m-%dT%H:%M:%S'),
                'lagna_deg': round(lagna_deg, 2),
                'pranapada_deg': round(sphuta_pp, 2),
                'delta_pp_deg': scores['delta_pranapada_deg'],
                'passes_trine_rule': scores['passes_trine_rule'],
                'verification_scores': {
                    'degree_match': scores['degree_match'],
                    'gulika_alignment': scores['gulika_alignment'],
                    'moon_alignment': scores['moon_alignment'],
                    'combined_verification': scores['combined_verification']
                },
                'special_lagnas': {
                    'bhava_lagna': round(special_lagnas['bhava_lagna'], 2),
                    'hora_lagna': round(special_lagnas['hora_lagna'], 2),
                    'ghati_lagna': round(special_lagnas['ghati_lagna'], 2),
                    'varnada_lagna': round(special_lagnas['varnada_lagna'], 2)
                },
                'nisheka': {
                    'nisheka_lagna_deg': round(nisheka['nisheka_lagna_deg'], 2),
                    'gestation_months': round(nisheka['gestation_months'], 2),
                    'is_realistic': nisheka['is_realistic'],
                    'gestation_score': round(nisheka['gestation_score'], 2)
                }
            }
            candidates.append(candidate_record)
        current_dt += datetime.timedelta(minutes=step_minutes)
    return candidates
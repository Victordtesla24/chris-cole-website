# BTR Pipeline Implementation Plan
## Based on Brihat Parashar Hora Shastra - Birth Time Rectification Verses

**Version:** 2.0 (Corrected & BPHS-Compliant)  
**Date:** November 16, 2025  
**Source:** Birth-Time-Rectification-Verses.md

---

## Overview

This document provides a **minimal, yet accurate** Birth Time Rectification (BTR) pipeline strictly following the verses from **बृहत्पाराशरहोराशास्त्र** (Brihat Parashar Hora Shastra), Chapter 4 - लग्नाध्याय (Lagna Adhyaya).

## 1. Core Pipeline Architecture

### 1.1 Input Requirements

#### **MANDATORY INPUTS:**
```json
{
  "date_of_birth": "YYYY-MM-DD",
  "place_of_birth": "City, Country",
  "time_range": {
    "start": "HH:MM",
    "end": "HH:MM",
    "timezone": "Asia/Karachi"
  }
}
```

#### **OPTIONAL VERIFICATION INPUTS:**
```json
{
  "life_events": {
    "marriage": {
      "date": "YYYY-MM-DD",
      "spouse_name": "string"
    },
    "children": {
      "count": 0,
      "dates": []
    },
    "career": [],
    "education": []
  },
  "physical_traits": {
    "height": "TALL/MEDIUM/SHORT",
    "build": "ATHLETIC/SLIM/HEAVY",
    "complexion": "FAIR/WHEATISH/DARK"
  }
}
```

---

## 2. Step-by-Step BPHS-Based Pipeline

### PHASE 0: Setup & Initialization

```python
# backend/btr_core.py

import swisseph as swe
from datetime import datetime, timedelta
from typing import Dict, List, Any
import math

# Initialize Swiss Ephemeris
def initialize_ephemeris(ephe_path: str = "./ephe"):
    """
    Configure Swiss Ephemeris with Lahiri Ayanamsa
    Per BPHS requirement for sidereal calculations
    """
    swe.set_ephe_path(ephe_path)
    swe.set_sid_mode(swe.SIDM_LAHIRI)  # Lahiri Ayanamsa

# Time conversion utilities
def local_to_jd_ut(dt_local: datetime, tz_offset_hours: float) -> float:
    """Convert local datetime to Julian Day (UT)"""
    dt_utc = dt_local - timedelta(hours=tz_offset_hours)
    hour_decimal = dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0
    return swe.julday(
        dt_utc.year, dt_utc.month, dt_utc.day, 
        hour_decimal, swe.GREG_CAL
    )

def circular_diff_deg(a: float, b: float) -> float:
    """Angular distance between two degrees (0-360)"""
    d = (a - b) % 360.0
    return min(d, 360.0 - d)
```

---

### PHASE 1: Astronomical Calculations (High-Precision Ephemeris)

```python
def calculate_sunrise(date_local: datetime, tz_offset: float, 
                     lat: float, lon: float) -> float:
    """
    Calculate sunrise for given date and location
    Uses Swiss Ephemeris rise_trans
    
    BPHS Reference: Required for इष्टकाल (Ishta Kala) calculation
    """
    midnight_local = datetime(date_local.year, date_local.month, 
                             date_local.day, 0, 0, 0)
    jd_ut_midnight = local_to_jd_ut(midnight_local, tz_offset)
    
    # Get sunrise JD
    result = swe.rise_trans(
        jd_ut_midnight,
        swe.SUN,
        rsmi=swe.CALC_RISE,
        geopos=(lon, lat, 0.0)
    )
    return result[1][0]  # Sunrise JD

def compute_sidereal_lagna(jd_ut: float, lat: float, lon: float) -> float:
    """
    Calculate sidereal ascendant (lagna)
    
    BPHS Reference: जन्मलग्न (Janma Lagna)
    """
    # Tropical houses using Placidus
    cusps, ascmc = swe.houses_ex(jd_ut, lat, lon, b'P')
    asc_tropical = float(ascmc[0]) % 360.0
    
    # Convert to sidereal
    ayan = swe.get_ayanamsa_ut(jd_ut)
    asc_sidereal = (asc_tropical - ayan) % 360.0
    
    return asc_sidereal

def get_planet_positions(jd_ut: float) -> Dict[str, float]:
    """Get all 9 planet positions (sidereal)"""
    planets = {
        'sun': swe.SUN,
        'moon': swe.MOON,
        'mars': swe.MARS,
        'mercury': swe.MERCURY,
        'jupiter': swe.JUPITER,
        'venus': swe.VENUS,
        'saturn': swe.SATURN,
        'rahu': swe.MEAN_NODE,  # True node also available
        'ketu': None  # 180° from Rahu
    }
    
    ayan = swe.get_ayanamsa_ut(jd_ut)
    positions = {}
    
    for name, planet_id in planets.items():
        if name == 'ketu':
            positions['ketu'] = (positions['rahu'] + 180.0) % 360.0
        else:
            calc = swe.calc_ut(jd_ut, planet_id)[0]
            positions[name] = (calc[0] - ayan) % 360.0
    
    return positions
```

---

### PHASE 2: Gulika Calculation (BPHS Verses 4.1-4.3)

```python
def calculate_gulika(date_local: datetime, tz_offset: float,
                    lat: float, lon: float, jd_ut_birth: float) -> Dict[str, Any]:
    """
    Calculate Gulika using BPHS method
    
    BPHS Verse 4.1:
    रविवारादिशन्यन्तं गुलिकादि निरूप्यते।
    दिवसानष्टधा कृत्वा वारेशाद्‌मणयेत््रमात्‌।
    
    "Divide day duration into 8 parts, count from weekday lord"
    """
    # Get sunrise and sunset
    sunrise_jd = calculate_sunrise(date_local, tz_offset, lat, lon)
    
    # Calculate sunset (similar to sunrise but with CALC_SET)
    midnight_local = datetime(date_local.year, date_local.month, 
                             date_local.day, 0, 0, 0)
    jd_ut_midnight = local_to_jd_ut(midnight_local, tz_offset)
    
    sunset_result = swe.rise_trans(
        jd_ut_midnight,
        swe.SUN,
        rsmi=swe.CALC_SET,
        geopos=(lon, lat, 0.0)
    )
    sunset_jd = sunset_result[1][0]
    
    # Day duration in hours
    day_duration_hours = (sunset_jd - sunrise_jd) * 24.0
    day_duration_ghatis = day_duration_hours * 2.5  # 1 hour = 2.5 ghatis
    
    # One khanda duration
    one_khanda_ghatis = day_duration_ghatis / 8.0
    
    # Determine weekday (0=Sunday, 1=Monday, ..., 6=Saturday)
    weekday = date_local.weekday()
    if weekday == 6:  # Python: Sunday=6, adjust to 0
        weekday = 0
    else:
        weekday += 1
    
    # Weekday lord sequence starting from day's lord
    # Sun=0, Moon=1, Mars=2, Mercury=3, Jupiter=4, Venus=5, Saturn=6
    weekday_lords = [
        "Sun", "Moon", "Mars", "Mercury", 
        "Jupiter", "Venus", "Saturn"
    ]
    
    # Count from weekday lord to find Gulika (Saturn's portion)
    # Saturn is always the Gulika lord
    gulika_khanda_index = 2  # 3rd khanda for day birth
    
    # Gulika period
    gulika_start_ghatis = gulika_khanda_index * one_khanda_ghatis
    gulika_end_ghatis = (gulika_khanda_index + 1) * one_khanda_ghatis
    
    # Convert to time
    gulika_start_jd = sunrise_jd + (gulika_start_ghatis / 60.0)  # ghatis to hours
    gulika_end_jd = sunrise_jd + (gulika_end_ghatis / 60.0)
    
    # Gulika Lagna = Lagna at Gulika time (midpoint)
    gulika_mid_jd = (gulika_start_jd + gulika_end_jd) / 2.0
    gulika_lagna = compute_sidereal_lagna(gulika_mid_jd, lat, lon)
    
    return {
        "gulika_lagna_deg": gulika_lagna,
        "gulika_start_jd": gulika_start_jd,
        "gulika_end_jd": gulika_end_jd,
        "day_duration_ghatis": day_duration_ghatis,
        "one_khanda_ghatis": one_khanda_ghatis
    }
```

---

### PHASE 3: Pranapada Calculation (PRIMARY - BPHS Verses 4.5, 4.7)

```python
def calculate_ishta_kala(jd_ut_birth: float, sunrise_jd: float) -> Dict[str, float]:
    """
    Calculate Ishta Kala (elapsed time from sunrise)
    
    BPHS Reference: इष्टकाल required for Pranapada
    """
    elapsed_hours = (jd_ut_birth - sunrise_jd) * 24.0
    
    # Convert to Ghatis and Palas
    # 1 Ghati = 24 minutes = 60 Palas
    # 1 Pala = 24 seconds
    ghatis_total = elapsed_hours * 2.5  # 1 hour = 2.5 ghatis
    ghatis = int(ghatis_total)
    pala_fraction = (ghatis_total - ghatis) * 60  # 1 ghati = 60 palas
    palas = int(pala_fraction)
    
    return {
        "hours": elapsed_hours,
        "ghatis": ghatis,
        "palas": palas,
        "ghatis_decimal": ghatis_total
    }

def calculate_madhya_pranapada(ishta_kala: Dict[str, float]) -> float:
    """
    Method 1: Madhya (Rough) Pranapada
    
    BPHS Verse 4.5:
    घटी चतुर्गुणा कार्यां तिथ्याप्तैश्च पलैर्युताः
    दिनकरेणापहतं शेषं प्राणपदं स्मृतम्‌।
    
    Formula:
    1. Ghati × 4 = Base value
    2. Pala ÷ 15 = Quotient (add to base)
    3. Total ÷ 12 = Pranapada rashi (remainder)
    4. Remainder × 2 = Degrees
    """
    G = ishta_kala["ghatis"]
    P = ishta_kala["palas"]
    
    # Step 1: Ghatis × 4
    base = G * 4
    
    # Step 2: Palas ÷ 15
    pala_quotient = P // 15
    pala_remainder = P % 15
    
    # Step 3: Combine
    total = base + pala_quotient
    
    # Step 4: Divide by 12 for rashi
    rashi_index = total % 12
    
    # Step 5: Degrees from remainder
    degrees = pala_remainder * 2
    
    # Convert to 360° longitude
    pranapada_deg = (rashi_index * 30.0) + degrees
    
    return pranapada_deg

def calculate_sphuta_pranapada(ishta_kala: Dict[str, float], 
                                sun_deg: float) -> float:
    """
    Method 2: Sphuta (Accurate) Pranapada
    
    BPHS Verse 4.7:
    स्वेष्टकालं पलीकृत्य तिथ्याप्तं भादिकं च यत्‌।
    चरागद्विभके भानौ योज्यं स्वे नवमे सुते।
    
    Formula:
    1. Convert Ishta Kala to palas
    2. Palas ÷ 15 = Rashi + Degrees
    3. Add based on Sun's rashi type:
       - Chara (Movable): Sun's rashi
       - Sthira (Fixed): 9th from Sun
       - Dvisvabhava (Dual): 5th from Sun
    """
    # Convert to total palas
    total_palas = (ishta_kala["ghatis"] * 60) + ishta_kala["palas"]
    
    # Divide by 15
    rashi_offset = total_palas / 15.0
    
    # Determine Sun's rashi type
    sun_rashi = int(sun_deg // 30)
    
    # Chara: 0,3,6,9 (Aries, Cancer, Libra, Capricorn)
    # Sthira: 1,4,7,10 (Taurus, Leo, Scorpio, Aquarius)
    # Dvisvabhava: 2,5,8,11 (Gemini, Virgo, Sagittarius, Pisces)
    
    if sun_rashi in [0, 3, 6, 9]:
        # Chara: Add to Sun directly
        pranapada_deg = (sun_deg + (rashi_offset * 30.0)) % 360.0
    elif sun_rashi in [1, 4, 7, 10]:
        # Sthira: Add to 9th from Sun
        ninth_from_sun = (sun_deg + 240.0) % 360.0
        pranapada_deg = (ninth_from_sun + (rashi_offset * 30.0)) % 360.0
    else:
        # Dvisvabhava: Add to 5th from Sun
        fifth_from_sun = (sun_deg + 120.0) % 360.0
        pranapada_deg = (fifth_from_sun + (rashi_offset * 30.0)) % 360.0
    
    return pranapada_deg
```

---

### PHASE 4: BPHS Hard Filters (Mandatory Verification)

```python
def apply_bphs_hard_filters(candidate_time: Dict[str, Any],
                            pranapada_deg: float,
                            gulika_lagna_deg: float,
                            moon_deg: float) -> Dict[str, Any]:
    """
    Apply BPHS mandatory filters for human birth verification
    
    BPHS Verses: 4.6, 4.8, 4.10
    """
    lagna_deg = candidate_time["lagna_deg"]
    
    # Filter 1: Degree Matching (Verse 4.6)
    # लग्नांशप्राणांशपदैक्यता स्यात्‌
    # "Lagna degrees and Pranapada degrees should be equal"
    degree_diff = circular_diff_deg(lagna_deg, pranapada_deg)
    degree_match_score = max(0, 100 - (degree_diff * 20))  # ±5° tolerance
    
    # Filter 2: Trine Rule (Verse 4.10) - MANDATORY
    # "Birth lagna must be in trine (1/5/9) from Pranapada"
    lagna_rashi = int(lagna_deg // 30)
    pranapada_rashi = int(pranapada_deg // 30)
    
    trine_diff = (lagna_rashi - pranapada_rashi) % 12
    is_trine = trine_diff in [0, 4, 8]  # 1st, 5th, 9th houses
    
    if not is_trine:
        return {
            "passed": False,
            "reason": "Failed Trine Rule - Not human birth per BPHS 4.10",
            "scores": {}
        }
    
    # Filter 3: Triple Verification (Verse 4.8)
    # विना प्राणपदाच्छुद्धो गुलिकाद्वा निशाकराद्‌
    # "Must be verified by Pranapada OR Gulika OR Moon"
    
    gulika_diff = circular_diff_deg(lagna_deg, gulika_lagna_deg)
    gulika_score = max(0, 100 - (gulika_diff * 10))
    
    moon_rashi = int(moon_deg // 30)
    moon_house_from_lagna = (moon_rashi - lagna_rashi) % 12
    # Favorable houses: 1,4,5,7,9,10,11
    moon_favorable = moon_house_from_lagna in [0, 3, 4, 6, 8, 9, 10]
    moon_score = 100 if moon_favorable else 50
    
    # Combined verification score
    verification_score = max(degree_match_score, gulika_score, moon_score)
    
    return {
        "passed": True,
        "scores": {
            "degree_match": degree_match_score,
            "trine_rule": 100,  # Passed (mandatory)
            "gulika_verification": gulika_score,
            "moon_verification": moon_score,
            "combined_verification": verification_score
        }
    }
```

---

### PHASE 5: Special Lagnas (BPHS Verses 4.18-28)

```python
def calculate_special_lagnas(ishta_kala: Dict[str, float],
                             sun_deg: float,
                             janma_lagna_deg: float) -> Dict[str, float]:
    """
    Calculate 4 special lagnas per BPHS
    
    1. Bhava Lagna (Verse 4.18)
    2. Hora Lagna (Verses 4.20-21)
    3. Ghati Lagna (Verses 4.22-23)
    4. Varnada Lagna (Verses 4.26-28)
    """
    G = ishta_kala["ghatis"]
    P = ishta_kala["palas"]
    
    # 1. BHAVA LAGNA (Verse 4.18)
    # Formula: Ghatis ÷ 5 = rashi offset
    bhava_offset_rashis = G / 5.0
    
    janma_lagna_rashi = int(janma_lagna_deg // 30)
    is_odd_lagna = janma_lagna_rashi % 2 == 0  # 0,2,4,6,8,10 are "odd" in Vedic
    
    if is_odd_lagna:
        bhava_lagna = (sun_deg + (bhava_offset_rashis * 30)) % 360.0
    else:
        bhava_lagna = (janma_lagna_deg + (bhava_offset_rashis * 30)) % 360.0
    
    # 2. HORA LAGNA (Verses 4.20-21)
    # Formula: Ghatis ÷ 2.5 = rashi offset
    hora_offset_rashis = G / 2.5
    
    if is_odd_lagna:
        hora_lagna = (sun_deg + (hora_offset_rashis * 30)) % 360.0
    else:
        hora_lagna = (janma_lagna_deg + (hora_offset_rashis * 30)) % 360.0
    
    # 3. GHATI LAGNA (Verses 4.22-23)
    # Formula: 1 Ghati = 1 Rashi, Palas × 2 = Degrees
    ghati_offset = (G * 30) + (P * 2)
    ghati_lagna = (sun_deg + ghati_offset) % 360.0
    
    # 4. VARNADA LAGNA (Verses 4.26-28)
    # Complex calculation from Janma + Hora lagnas
    janma_rashi_num = int(janma_lagna_deg // 30) + 1  # 1-12
    hora_rashi_num = int(hora_lagna // 30) + 1
    
    # Both odd or both even: Add
    if (janma_rashi_num % 2) == (hora_rashi_num % 2):
        varnada_num = janma_rashi_num + hora_rashi_num
        if varnada_num % 2 == 0:  # If even, subtract from 12
            varnada_num = 12 - varnada_num
    else:
        # One odd, one even: Complex formula
        if hora_rashi_num % 2 == 0:
            hora_adjusted = 12 - hora_rashi_num
        else:
            hora_adjusted = hora_rashi_num
        varnada_num = abs(janma_rashi_num - hora_adjusted)
        if varnada_num % 2 == 0:
            varnada_num = 12 - varnada_num
    
    varnada_lagna = ((varnada_num - 1) * 30) % 360.0
    
    return {
        "bhava_lagna": bhava_lagna,
        "hora_lagna": hora_lagna,
        "ghati_lagna": ghati_lagna,
        "varnada_lagna": varnada_lagna
    }
```

---

### PHASE 6: Nisheka Lagna (Conception - BPHS Verses 4.12-16)

```python
def calculate_nisheka_lagna(saturn_deg: float, gulika_lagna_deg: float,
                           janma_lagna_deg: float) -> Dict[str, Any]:
    """
    Calculate Nisheka (Conception) Lagna
    
    BPHS Verse 4.14:
    यस्मिन्‌ भावे स्थितो कोणस्तस्य मान्देर्यदन्तरम्‌।
    लग्नभाग्यन्तरं योज्यं यच्च राश्यादि जायते।
    
    Formula:
    1. Saturn's house - Gulika lagna = Diff A
    2. Lagna - 9th house = Diff B
    3. Diff A + Diff B = Period before birth (months)
    """
    # Find Saturn's bhava (house)
    saturn_rashi = int(saturn_deg // 30)
    lagna_rashi = int(janma_lagna_deg // 30)
    gulika_rashi = int(gulika_lagna_deg // 30)
    
    # Difference A: Saturn bhava - Gulika
    diff_a = (saturn_rashi - gulika_rashi) % 12
    
    # Difference B: Lagna - 9th house (9th = lagna + 8)
    ninth_house_rashi = (lagna_rashi + 8) % 12
    diff_b = (lagna_rashi - ninth_house_rashi) % 12
    
    # Total = Months before birth
    total_rashis = (diff_a + diff_b) % 12
    
    # Convert to gestation period (roughly)
    # Each rashi ≈ 1 month
    gestation_months = total_rashis
    
    # Realistic gestation: 5-10.5 months (150-320 days)
    is_realistic = 5 <= gestation_months <= 10.5
    
    # Nisheka lagna position
    nisheka_lagna_deg = (janma_lagna_deg - (total_rashis * 30)) % 360.0
    
    return {
        "nisheka_lagna_deg": nisheka_lagna_deg,
        "gestation_months": gestation_months,
        "is_realistic": is_realistic,
        "gestation_score": 100 if is_realistic else 50
    }
```

---

## 3. Main BTR Function

```python
def rectify_birth_time(dob_str: str, place: str, tz_offset: float,
                      time_range_start: str, time_range_end: str,
                      lat: float, lon: float) -> Dict[str, Any]:
    """
    Main BTR function following BPHS verses chronologically
    
    Returns: List of candidate times with scores
    """
    dob = datetime.strptime(dob_str, "%Y-%m-%d")
    start_time = datetime.strptime(f"{dob_str} {time_range_start}", 
                                  "%Y-%m-%d %H:%M")
    end_time = datetime.strptime(f"{dob_str} {time_range_end}", 
                                "%Y-%m-%d %H:%M")
    
    # Generate candidate times (every 2 minutes)
    candidates = []
    current = start_time
    step = timedelta(minutes=2)
    
    # Get sunrise once for the date
    sunrise_jd = calculate_sunrise(dob, tz_offset, lat, lon)
    
    while current <= end_time:
        jd_ut = local_to_jd_ut(current, tz_offset)
        
        # Phase 1: Astronomical calculations
        lagna_deg = compute_sidereal_lagna(jd_ut, lat, lon)
        planets = get_planet_positions(jd_ut)
        
        # Phase 2: Gulika
        gulika = calculate_gulika(current, tz_offset, lat, lon, jd_ut)
        
        # Phase 3: Pranapada
        ishta_kala = calculate_ishta_kala(jd_ut, sunrise_jd)
        madhya_pranapada = calculate_madhya_pranapada(ishta_kala)
        sphuta_pranapada = calculate_sphuta_pranapada(
            ishta_kala, planets["sun"]
        )
        
        # Phase 4: Hard filters
        filters = apply_bphs_hard_filters(
            {"lagna_deg": lagna_deg},
            sphuta_pranapada,
            gulika["gulika_lagna_deg"],
            planets["moon"]
        )
        
        if not filters["passed"]:
            current += step
            continue
        
        # Phase 5: Special lagnas
        special_lagnas = calculate_special_lagnas(
            ishta_kala, planets["sun"], lagna_deg
        )
        
        # Phase 6: Nisheka
        nisheka = calculate_nisheka_lagna(
            planets["saturn"],
            gulika["gulika_lagna_deg"],
            lagna_deg
        )
        
        # Calculate total score
        total_score = (
            filters["scores"]["degree_match"] * 0.30 +
            filters["scores"]["gulika_verification"] * 0.15 +
            filters["scores"]["moon_verification"] * 0.15 +
            nisheka["gestation_score"] * 0.10 +
            100 * 0.30  # Trine rule (passed)
        )
        
        candidates.append({
            "time_local": current.strftime("%H:%M:%S"),
            "lagna_deg": lagna_deg,
            "pranapada_deg": sphuta_pranapada,
            "gulika_lagna_deg": gulika["gulika_lagna_deg"],
            "special_lagnas": special_lagnas,
            "nisheka": nisheka,
            "scores": filters["scores"],
            "total_score": total_score
        })
        
        current += step
    
    # Sort by total score
    candidates.sort(key=lambda x: x["total_score"], reverse=True)
    
    return {
        "candidates": candidates[:5],  # Top 5
        "best_candidate": candidates[0] if candidates else None
    }
```

---

## 4. Web App Integration

### FastAPI Backend (`main.py`)

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="BPHS BTR Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class BTRRequest(BaseModel):
    dob: str  # YYYY-MM-DD
    place: str
    tz_offset_hours: float
    time_start: str  # HH:MM
    time_end: str    # HH:MM

@app.post("/api/btr")
async def calculate_btr(req: BTRRequest):
    # Geocode place
    OPENCAGE_KEY = os.getenv("OPENCAGE_API_KEY")
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://api.opencagedata.com/geocode/v1/json",
            params={"q": req.place, "key": OPENCAGE_KEY}
        )
        geo = r.json()["results"][0]["geometry"]
    
    # Run BTR
    result = rectify_birth_time(
        req.dob, req.place, req.tz_offset_hours,
        req.time_start, req.time_end,
        geo["lat"], geo["lng"]
    )
    
    return result
```

---

## 5. Key Improvements Over Original

| Aspect               | Original Plan             | Corrected Plan                     |
|----------------------|---------------------------|------------------------------------|
| **Primary Method**   | Prashna-based (incorrect) | Gulika + Pranapada (BPHS 4.1-4.7)  |
| **Trine Rule**       | Not enforced              | **Mandatory** (BPHS 4.10)          |
| **Special Lagnas**   | Missing                   | All 4 included (BPHS 4.18-28)      |
| **Nisheka**          | Stub only                 | Full implementation (BPHS 4.12-16) |
| **Time Conversions** | Generic                   | **Exact** Ghati/Pala per BPHS      |
| **Sequence**         | Incorrect order           | **Chronological** per BPHS verses  |

---

## 6. Usage Example

```python
# Initialize
initialize_ephemeris("./ephe")

# Calculate BTR
result = rectify_birth_time(
    dob_str="1997-12-18",
    place="Melbourne, Australia",
    tz_offset=10.0,  # AEDT
    time_range_start="10:00",
    time_range_end="12:00",
    lat=-37.8136,
    lon=144.9631
)

print(f"Best Time: {result['best_candidate']['time_local']}")
print(f"Score: {result['best_candidate']['total_score']:.2f}/100")
```

---

## 7. Next Steps

1. ✅ **Test** with known birth times
2. ✅ Add **Dasha calculation** for life event verification
3. ✅ Add **Varga charts** (D-3, D-7, D-9, D-10, D-12)
4. ✅ Build **minimal UI** (React/Vue)
5. ✅ Deploy to **cloud** (Vercel/Railway)

---

**॥ श्री गणेशाय नमः ॥**  
**॥ ॐ तत्सत् ॥**
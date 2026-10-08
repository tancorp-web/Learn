# HORA Astrology

HORA Astrology — Thai astrology core engine.

## Architecture
RAW INPUT → CALCULATION → KNOWLEDGE/RULES → INTERPRETATION → UI

- main.js = application orchestrator only.
- js/core = canonical calculation contracts.
- js/astronomy = astronomical data layer.
- js/astrology = zodiac, houses, navamsa, thaksa and related rules.
- qa = automated validation and regression tests.
- docs = master specification and decisions.

## Core rules
- Canonical planet position: absolute longitude.
- Display precision: degree + minute.
- Thailand timezone: UTC+7.
- Province selection resolves latitude/longitude.
- Actual local sunrise is retained for Thai day-boundary logic.
- HORA Standard defaults to sidereal Lahiri.
- Unverified formulas remain RESEARCH/PROVISIONAL and are never silently treated as authoritative.

## Development
Run the API with `python3 server.py` and the JavaScript tests with `npm test`.

Swiss Ephemeris licensing must be reviewed before public/commercial distribution.

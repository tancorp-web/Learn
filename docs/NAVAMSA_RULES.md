# HORA Navamsa Rules — Canonical Project Knowledge

Status: CONFIRMED BY PROJECT OWNER  
Scope: `index50.html` Navamsa visualization only. Do not alter locked Suriyayatra planet or ascendant calculations while implementing this display.

## Canonical placement rule

1. Read each calculated planet's absolute zodiac longitude. Calculate the Navamsa number from the position within its original sign: each sign has nine divisions of 3°20′.
2. The Navamsa number (1–9) selects the digit in the element's nine-digit walking sequence.
3. Walk the nine signs in the relevant element sequence. The first sign reached whose HORA sign-lord number matches the selected Navamsa digit is the destination sign.
4. Put the original planet number in that destination sign on the Navamsa wheel. Do **not** put the Navamsa digit in place of the planet number. The small adjacent digit may be shown as the Navamsa number/digit for reference.
5. Apply the same procedure to the natal ascendant and transit ascendant. Render ascendant as `@`.
6. Natal and transit positions are distinct: natal planets/ascendant appear on the inner ring; transit planets/ascendant appear on the outer ring.
7. Display the names of all 12 destination signs in each ring.

## Confirmed element walking sequences

The digits represent the HORA sign-lord number encountered as the path walks through the signs. The corresponding path is:

- Fire: `364214635` — Aries → Taurus → Gemini → Cancer → Leo → Virgo → Libra → Scorpio → Sagittarius.
- Earth: `785364214` — Capricorn → Aquarius → Pisces → Aries → Taurus → Gemini → Cancer → Leo → Virgo.
- Air: `635785364` — Libra → Scorpio → Sagittarius → Capricorn → Aquarius → Pisces → Aries → Taurus → Gemini.
- Water: `214635785` — Cancer → Leo → Virgo → Libra → Scorpio → Sagittarius → Capricorn → Aquarius → Pisces.

The target sign is the sign at the selected Navamsa position in the corresponding sequence. HORA sign-lord numbers used by the wheel: Aries 3, Taurus 6, Gemini 4, Cancer 2, Leo 1, Virgo 4, Libra 6, Scorpio 3, Sagittarius 5, Capricorn 7, Aquarius 8, Pisces 5.

## Confirmed examples

- Sun (planet 1), natal Virgo 22°37′: Navamsa 7, digit 2, destination Cancer. Put planet 1 in Cancer.
- Moon (planet 2), natal Virgo 25°48′: Navamsa 8, digit 1, destination Leo. Put planet 2 in Leo.
- Mars (planet 3), natal Cancer 12°53′: Navamsa 4, digit 6, destination Libra. Put planet 3 in Libra.
- Mercury (planet 4), natal Libra 15°00′: Navamsa 5, digit 8, destination Aquarius. Put planet 4 in Aquarius.
- Jupiter (planet 5), natal Cancer 28°37′: Navamsa 9, digit 5, destination Pisces. Put planet 5 in Pisces.
- Venus (planet 6), natal Libra 20°01′: Navamsa 7, digit 3, destination Aries. Put planet 6 in Aries.
- Saturn (planet 7), natal Pisces 9°59′: Navamsa 3, digit 4, destination Virgo. Put planet 7 in Virgo.
- Uranus (planet 0), natal Taurus 18°30′: Navamsa 6, digit 4, destination Gemini. Put planet 0 in Gemini.
- Rahu (planet 8), natal Aquarius 2°14′: Navamsa 1, digit 6, destination Libra. Put planet 8 in Libra.
- Ketu (planet 9), natal Scorpio 2°04′: Navamsa 1, digit 2, destination Cancer. Put planet 9 in Cancer.
- Natal ascendant (@), Cancer 23°44′: Navamsa 8, digit 8, destination Aquarius. Put @ in Aquarius.
- Transit ascendant (@), Aquarius 19°50′: Navamsa 6, digit 5, destination Pisces. Put @ in Pisces.

The owner has confirmed that the full natal/transit result list supplied in the project conversation is correct. The examples above are anchor QA cases for regression checks.

## UI contract for index50

- Outer ring: transit Navamsa (green), including all transit planets and transit ascendant.
- Inner ring: natal Navamsa (purple), including all natal planets and natal ascendant.
- Both rings display all 12 sign names.
- Planet numbers remain the original planet identifiers; the Navamsa digit is supplementary and must not replace the planet number.
- Keep the natal/transit source form, zodiac wheel, and locked calculation logic unchanged.
- Keep this feature isolated to `index50.html` unless the owner explicitly approves another file change.

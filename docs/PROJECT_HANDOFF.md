# HORA Project Handoff

Updated: 2026-10-10

## Live pages
- Stable working reference: https://tancorp-web.github.io/Learn/index2.html
- New working copy: https://tancorp-web.github.io/Learn/index3.html
- Repository: https://github.com/tancorp-web/Learn
- Current task source page: `index2.html`; new changes for this task belong in `index3.html` unless explicitly requested otherwise.

## Current task
1. Work only in `index3.html` for UI/feature changes. Do not edit `index2.html` unless the user explicitly asks.
2. Transit-time feature is being developed one planet at a time, starting with the Sun.
3. Show the next Sun ingress time at the next zodiac sign boundary (0° of the next sign), based on the selected transit date/time and transit longitude.
4. Verify the live URL and include it in every task completion response.
5. Update this handoff note when behavior, decisions, test results, or next steps change.

## Transit-time behavior and limitations
- `index3.html` adds a panel under the transit inputs for the next Sun crossing of a 0° zodiac boundary.
- The feature reads the selected transit date, time, and longitude; it searches forward up to 45 days, then refines to the first minute at/after the boundary using the existing `calculateSuriyayatra` Sun output.
- This is the existing HORA engine's result and minute-level search, not an independently validated ephemeris. Compare against a trusted reference before treating the time as final for electional astrology.
- Next steps: verify the panel renders on the live page and compare a few Sun sign-ingress times to a trusted reference. Only after this is validated, extend the same pattern to Moon or other planets with explicit approval.

## Protected calculation rules
- Do not modify formulas for planets other than Moon and Ketu unless the user explicitly authorizes it and there is clear evidence.
- Existing verified adhikamas/month 8/8 reference data remains the primary source of truth; alternative calendar calculations are independent checks only. Different schools may differ by one day, so do not require all methods to agree exactly.
- Ketu: cycle is 679 days = 360°; anchor position at verified month 8/8 start is 198°16′30″. Do not subtract 30 days twice.
- Golden Ketu checks:
  - 1991-10-14 01:05 Khon Kaen → 28°26′ Leo; month 8/8 anchor 1991-07-12, elapsed 94 days.
  - 1991-12-14 01:05 Khon Kaen → 26°06′ Cancer; anchor 1991-07-12, elapsed 155 days.
  - 1975-10-14 01:05 → expected around 06°53′ Aries using the original 679-day formula in the currently documented fallback case.

## Project layout and tests
- `main.js`: app orchestration and wheel rendering.
- `js/astronomy/`: astronomy and Suriyayatra engines.
- `qa/formula-tests/*.test.js`: automated regression tests.
- Run JavaScript tests with `npm test` in an environment with the repository checked out.
- `docs/DECISIONS.md`: durable calculation/UI decisions.
- Keep `index3.html` isolated from `index2.html` until the user approves promotion.

## Work log
- 2026-10-10: Created `index3.html` from `index2.html` as an isolated baseline copy. Transit-time behavior awaits the clarification above. Do not claim the requested feature is complete yet.


## Work log
- 2026-10-10: Created `index3.html` as an isolated copy of `index2.html`.
- 2026-10-10: Added Sun transit-ingress panel to `index3.html` only. It calculates the next 0° sign boundary time using the current Suriyayatra Sun engine, based on selected transit date/time and longitude. GitHub Actions workflow `38046271698` completed successfully, including formula tests and GitHub Pages deployment. Manual browser verification of the displayed timestamp is still recommended.

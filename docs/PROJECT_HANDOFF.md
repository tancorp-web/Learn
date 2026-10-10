# HORA Project Handoff

Updated: 2026-10-10

## Live pages
- Stable working reference: https://tancorp-web.github.io/Learn/index2.html
- New working copy: https://tancorp-web.github.io/Learn/index3.html
- Repository: https://github.com/tancorp-web/Learn
- Current task source page: `index2.html`; new changes for this task belong in `index3.html` unless explicitly requested otherwise.

## Current task
1. Create `index3.html` as a full independent copy of `index2.html`; do not change `index2.html`.
2. Add transit date/time information related to the zodiac sign 0° line, so the user can identify the time.
3. Verify with a live URL and include that URL in every task completion response.
4. Update this handoff note when behavior, decisions, test results, or next steps change.

## Important clarification still needed
The phrase “เวลาวันจร ตามเส้น 0° ราศี” can mean either:
- A. show the currently selected transit date/time on the wheel, aligned to the radial 0° boundary line(s); or
- B. calculate and display the actual date/time each transiting planet crosses 0° of each zodiac sign.

Do not guess which behavior is intended. Confirm this before implementing the transit-time feature. The current `index3.html` is the baseline copy of `index2.html`; the transit-time feature is not yet implemented.

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

# HORA Project Handoff

Updated: 2026-10-10

## Live pages
- Stable working reference: https://tancorp-web.github.io/Learn/index2.html
- New working copy: https://tancorp-web.github.io/Learn/index3.html
- Repository: https://github.com/tancorp-web/Learn
- Current working page: `index3.html` only. `index2.html` is the stable reference and must not be edited unless explicitly requested.

## Current task
1. Work only in `index3.html` for UI/feature changes. Do not edit `index2.html` unless the user explicitly asks.
2. Transit-time feature is being developed one planet at a time, starting with the Sun.
3. Show the next Sun ingress time at the next zodiac sign boundary (0° of the next sign), based on the selected transit date/time and transit longitude.
4. Verify the live URL and include it in every task completion response.
5. Update this handoff note when behavior, decisions, test results, or next steps change.

## Transit-time behavior and limitations
- `index3.html` adds a panel under the transit inputs for the next Sun crossing of a 0° zodiac boundary.
- The feature reads the selected transit date, time, and longitude; it brackets the next boundary using daily samples for up to 45 days, then refines to the first minute at/after the boundary using the existing `calculateSuriyayatra` Sun output.
- 2026-10-10 follow-up fix: removed the overlapping page-load and timeout triggers that could start two expensive searches simultaneously; the feature now starts once after module initialization, avoids duplicate work for unchanged inputs, shows a calculating status, and logs a successful ingress result. Only `index3.html` was edited; no planet formulas were changed.
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


## Work log
- 2026-10-10: Fixed the Sun-ingress panel behavior in `index3.html` after the user reported the time was not appearing. The previous code triggered calculations both from `window.load` and a separate timeout and sampled every six hours; the updated code uses one initial trigger, daily bracketing plus minute refinement, duplicate-run protection, visible status, and success logging. Commit: `4c763f6f548412d1d2484798ffa9c42815786e53`. Automated deployment status and live display still need verification.


## Work log — 2026-10-10 follow-up
- User reported Sun transit time still not appearing. Updated the index3-only feature again: it now waits until the main app has initialized its transit date/time controls, yields between date samples so the UI can paint status, detects the first change of zodiac sign and refines to minute resolution, and emits an explicit `[HORA][SUN INGRESS]` success/error log. The feature module cache key was changed to `20261010-ingress-fix2`.
- Added index3-only wheel enhancement: the `@จร` label now includes the selected transit time (HH:MM); both the red natal ascendant ray and green transit ascendant ray extend outward to radius 408, at the Navamsa outer tick ring. Existing main.js and all planet calculation formulas remain untouched.
- Commit: `b055007ef62fe9f4a3dbebeee2e4fb2ba830c1e0`.
- Must still verify the new deployment workflow and ask user to refresh index3.html. Do not claim manual browser verification until confirmed.

## Work log — 2026-10-10 visible transit ascendant time
- User reported they could not see the transit time at the wheel's `@จร` marker. Updated `index3.html` only: added a high-contrast green `เวลาลัคนาจร: HH:MM น.` status strip above the wheel, and the green `@จร HH:MM` marker continues to reflect the selected transit time.
- Corrected the SVG viewport from its previous `-20 -20 760 760` bounds to `-90 -90 900 900` so the extended Navamsa ring and labels are not clipped beyond the old 740 coordinate boundary. The red natal and green transit ascendant rays remain extended toward radius 408.
- No changes to `index2.html`, `main.js`, or planet calculation formulas. Commit: `a38cf89e6cec3785261d0019a1a82f2235f7cdb1`. Check Actions and manually confirm the rendered page after deployment; do not claim visual verification before it is checked.
- Follow-up safety fix in commit `c6119819b4135d6e8b2e1fd844d99852eb1a754b`: the wheel observer now changes the `@จร` text only when its content differs, preventing repeated mutation-observer callbacks while retaining the visible time label.


## Work log — 2026-10-10 index3 ascendant time labels
- User requirement: edit only `index3.html` and this handoff document; do not modify `index2.html`, other files, or any planet calculation formulas.
- Updated `index3.html` so the selected birth time (`bHour/bMinute`) and transit time (`fHour/fMinute`) are each rendered as a separate opaque, high-contrast SVG time tag associated with its own red natal or green transit ascendant ray. Each leader line ends at the ring intersection computed from that ray's actual SVG endpoint direction, rather than a fixed screen location.
- Expanded the SVG viewBox to `-150 -150 1020 1020`. Time tags are tangentially offset from existing `@เกิด/@จร` markers; when the two ascendant angles are within 31 degrees, both tags move to an outer lane and retain individual connector lines to the correct ring intersections. The label layer is rebuilt idempotently and the observer watches only direct children of the wheel to avoid self-trigger loops.
- Transit status strip now shows both selected times. Changing either birth or transit hour/minute, or recalculating the chart, refreshes the time labels.
- Commits: `55f1457fe23da9714080be648ae434a48e1cdbd2` (initial labels), `8a75995f2947c47811fe15768d03aecb53be1916` (label separation).
- Formula integrity: no astronomy/calculation code touched; `index2.html` and `main.js` were not edited. Only `index3.html` and `docs/PROJECT_HANDOFF.md` are intended to change.
- Verification status: source changes committed; pending verification of GitHub Actions / GitHub Pages deployment. Automated multi-time browser interaction and manual visual inspection have not yet been confirmed, so do not describe those as passed until checked.


## Verification update — 2026-10-10
- Latest index3 UI commit `06bd7885c5f1ecf5fd209399ce677ce6adb2c89d` passed the full diagnostic test suite and required core, Ketu, and Thai lunar recheck tests in GitHub Actions run [38047813141](https://github.com/tancorp-web/Learn/actions/runs/38047813141). GitHub Pages deployment step also completed successfully for that commit.
- Static source checks confirm the live branch version of `index3.html` includes separate dynamic birth/transit time inputs and the ring-intersection label layer. The red/green ray geometry is derived from each ray's endpoint coordinates, and labels update on calculation and time-input changes.
- Limitation: no real mobile browser session was available in this verification pass, so visual collision behavior on-device and repeated interactive time changes were not manually observed. Do not state those manual checks passed. Formula regression tests passed; calculation source files and `index2.html` were not changed.


## Work log — 2026-10-10 natal/transit ascendant and 0-degree knowledge
- Added a new reference section `#ascendantTimeKnowledge3` in `index3.html` describing natal ascendant vs transit ascendant, what a zodiac sign's 0° boundary means, how a true boundary-crossing time must be found from date/time/location and calculated ascendant positions, and why Sun ingress time is not the same as ascendant ingress time.
- No formula or astronomy engine was changed. `index2.html` and `main.js` remain untouched.
- Important pending clarification before adding clock-time labels to every 0° boundary: whether the intended feature is (A) show the currently selected birth/transit times beside the ascendant rays at their actual wheel intersections, or (B) calculate and show the actual clock time when the transit ascendant crosses each sign's 0° boundary. These are different features; option B requires time-stepping against the existing ascendant calculation engine, not copying the currently selected transit time to every zodiac boundary.
- The knowledge-section commit is `7a308ed55413072dd4a64fbf87496eda7ec0aa28`. Deployment and visual verification pending.


## Work log — 2026-10-10: show transit ascendant crossing times at each zodiac 0° boundary
- User selected option A: calculate the transit ascendant's clock time at each sign's 0° boundary and show it on the wheel.
- Changed only `index3.html` and this handoff file. `index2.html`, `main.js`, and all astronomy/calculation engine files were not changed.
- The last inline script in `index3.html` is now a module and imports the existing `calculateSuriyayatra` engine and existing `calculateAscendantBoundaryTimes` helper. It uses the selected transit date/time and transit longitude to obtain the current Sun longitude and local-meridian correction from the existing engine, then calculates the 12 daily boundary clock times through the existing helper. No formula was copied into or changed in the app.
- Added green, opaque labels for all 12 boundaries, each reading `0° [sign] HH:MM น.`, with a dashed leader and dot ending at that sign's actual 0° position on the zodiac ring. Labels are computed from the existing wheel angle geometry; near ascendant rays, labels move to an outer lane. The SVG viewBox already provides room around the ring.
- Fixed ray selection so red/green ascendant time tags remain present after repeated redraw/update calls even when their lines have already been extended outward.
- Static JavaScript syntax check on the final inline module passed (`new Function` parse after removing import declarations); this does not replace a live browser test.
- GitHub Actions run for the boundary-label implementation: [38048447874](https://github.com/tancorp-web/Learn/actions/runs/38048447874) completed successfully on the initial feature commit. Subsequent minor geometry/idempotency fixes are in later commits; the latest run is pending at the time of this note. Confirm the newest workflow and Pages deployment before claiming deployment complete.
- Not yet manually verified in a live mobile browser. Boundary times are generated from the selected transit date/time's Sun longitude using the project's existing boundary-time helper; they are not a minute-by-minute search over the full day. Do not describe them as independently validated against real-world ephemeris until such a test is performed.

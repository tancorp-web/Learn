import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra } from '../../js/astronomy/suriyayatra-engine.js';

const PLANETS = ['อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'มฤตยู'];
const signArcMinutes = (signIndex, degree, minute) =>
  signIndex * 1800 + degree * 60 + minute;
const getPlanet = (result, name) =>
  result.planets.find(planet => planet.name === name);

test('2026 Thaloeng Sok: planetary epoch and six Manat positions match MyHora', () => {
  // MyHora's Thaloeng Sok instant is 16 Apr 2026 14:40:12 at UTC+06:42.
  // Engine input is Thai civil UTC+07, so 14:58 normalizes to 14:40.
  const result = calculateSuriyayatra({
    date: '2026-04-16',
    time: '14:58',
    includeMotion: false
  });

  assert.equal(result.metadata.planetaryPowerArcMinutes, 16804774);
  assert.equal(result.metadata.planetaryEpochArcMinutes, 16804774);

  const expected = {
    'อังคาร': signArcMinutes(11, 10, 37),
    'พุธ': signArcMinutes(11, 15, 49),
    'พฤหัสบดี': signArcMinutes(2, 23, 15),
    'ศุกร์': signArcMinutes(0, 23, 13),
    'เสาร์': signArcMinutes(11, 7, 54),
    'มฤตยู': signArcMinutes(1, 13, 51)
  };

  for (const name of PLANETS) {
    const actual = getPlanet(result, name).arcMinutes;
    assert.ok(
      Math.abs(actual - expected[name]) <= 1,
      name + ' MyHora delta=' + (actual - expected[name]) + ' arcminutes'
    );
  }
});

test('2026 Mean Ravi rollover: epoch remains continuous across civil midnight and Ravi wrap', () => {
  const before = calculateSuriyayatra({
    date: '2026-04-16', time: '23:59', includeMotion: false
  });
  const afterMidnight = calculateSuriyayatra({
    date: '2026-04-17', time: '00:00', includeMotion: false
  });
  const afterRaviWrap = calculateSuriyayatra({
    date: '2026-04-17', time: '12:00', includeMotion: false
  });

  const e0 = before.metadata.planetaryEpochArcMinutes;
  const e1 = afterMidnight.metadata.planetaryEpochArcMinutes;
  const e2 = afterRaviWrap.metadata.planetaryEpochArcMinutes;

  assert.ok(e1 >= e0, 'epoch must not reverse at civil midnight');
  assert.ok(e1 - e0 <= 5, 'one-minute epoch delta must not jump by a zodiac');
  assert.ok(e2 > e1, 'epoch must advance after Madhyam Ravi wraps');
  assert.ok(e2 - e1 < 60, 'half-day epoch delta must remain within normal Ravi motion');

  for (const name of PLANETS) {
    const p0 = getPlanet(before, name).arcMinutes;
    const p1 = getPlanet(afterMidnight, name).arcMinutes;
    const p2 = getPlanet(afterRaviWrap, name).arcMinutes;
    const wrappedDelta = (a, b) => {
      const d = ((b - a + 10800) % 21600 + 21600) % 21600 - 10800;
      return Math.abs(d);
    };
    assert.ok(wrappedDelta(p0, p1) < 10, name + ' jumped at civil midnight');
    assert.ok(wrappedDelta(p1, p2) < 120, name + ' jumped at Ravi wrap');
  }
});

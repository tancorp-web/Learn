import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra } from '../../js/astronomy/suriyayatra-engine.js';

function getKetu(date, time) {
  const result = calculateSuriyayatra({
    date,
    time,
    longitude: 102.8236,
    includeMotion: false
  });
  return {
    planet: result.planets.find(p => p.name === 'เกตุ'),
    debug: result.metadata.ketuDebug
  };
}

function signIndex(arcMinutes) {
  return Math.floor(arcMinutes / 1800);
}

test('Ketu uses Horakhun birth - 1 and the 679-day cycle, not a month 8/88 anchor', () => {
  const { debug } = getKetu('2026-11-03', '16:27');
  assert.equal(debug.mode, 'horakhun-679');
  assert.equal(debug.referenceDate, null);
  assert.equal(debug.timeBasis, 'UTC+06:42');
  assert.equal(debug.timeMinutes, 16 * 60 + 9);
  assert.equal(debug.horakhunPrasong, debug.horakhunBirth - 1);
  assert.equal(debug.remainder679, ((debug.horakhunPrasong - 344) % 679 + 679) % 679);
});

test('Ketu enters Libra at 14 Oct 2569 22:46 UTC+06:42 (23:04 UTC+07)', () => {
  const before = getKetu('2026-10-14', '23:03');
  const at = getKetu('2026-10-14', '23:04');
  assert.equal(before.debug.timeMinutes, 22 * 60 + 45);
  assert.equal(at.debug.timeMinutes, 22 * 60 + 46);
  assert.equal(signIndex(before.planet.arcMinutes), 7); // Scorpio
  assert.equal(signIndex(at.planet.arcMinutes), 6); // Libra
  assert.equal(at.debug.meanArcMinutes, 9001);
  assert.equal(at.planet.arcMinutes, 12599);
});

test('Ketu leaves Libra at 10 Dec 2569 12:46 UTC+06:42 (13:04 UTC+07)', () => {
  const before = getKetu('2026-12-10', '13:03');
  const at = getKetu('2026-12-10', '13:04');
  assert.equal(before.debug.timeMinutes, 12 * 60 + 45);
  assert.equal(at.debug.timeMinutes, 12 * 60 + 46);
  assert.equal(signIndex(before.planet.arcMinutes), 6); // Libra
  assert.equal(signIndex(at.planet.arcMinutes), 5); // Virgo
  assert.equal(at.debug.meanArcMinutes, 10801);
  assert.equal(at.planet.arcMinutes, 10799);
});

test('Ketu position changes within a day using the workbook fractional-day term', () => {
  const morning = getKetu('2026-11-03', '08:00');
  const evening = getKetu('2026-11-03', '20:00');
  assert.ok(morning.planet.arcMinutes > evening.planet.arcMinutes);
  assert.equal(evening.debug.timeMinutes - morning.debug.timeMinutes, 12 * 60);
});

test('1991 Golden Ketu values use the UTC+06:42 equivalent of the recorded 01:05 reference time', () => {
  // 01:05 local-mean reference time is 01:23 Thai civil UTC+07.
  const oct = getKetu('1991-10-14', '01:23');
  const dec = getKetu('1991-12-14', '01:23');
  assert.equal(oct.debug.timeMinutes, 65);
  assert.equal(dec.debug.timeMinutes, 65);
  assert.deepEqual(
    [signIndex(oct.planet.arcMinutes), Math.floor((oct.planet.arcMinutes % 1800) / 60), Math.floor(oct.planet.arcMinutes % 60)],
    [4, 28, 26]
  );
  assert.deepEqual(
    [signIndex(dec.planet.arcMinutes), Math.floor((dec.planet.arcMinutes % 1800) / 60), Math.floor(dec.planet.arcMinutes % 60)],
    [3, 26, 6]
  );
});

test('BE 2518 (14 Oct 1975) remains on the Horakhun 679 cycle', () => {
  const { planet, debug } = getKetu('1975-10-14', '01:05');
  assert.equal(debug.mode, 'horakhun-679');
  assert.equal(debug.referenceDate, null);
  assert.equal(Math.floor(planet.arcMinutes / 1800), 0);
  assert.ok(planet.arcMinutes > 6 * 60 + 52 && planet.arcMinutes < 6 * 60 + 55);
});

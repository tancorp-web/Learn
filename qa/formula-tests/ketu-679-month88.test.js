import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra } from '../../js/astronomy/suriyayatra-engine.js';

function getKetu(date) {
  const result = calculateSuriyayatra({
    date,
    time: '01:05',
    longitude: 102.8236,
    includeMotion: false
  });
  return {
    planet: result.planets.find(p => p.name === 'เกตุ'),
    debug: result.metadata.ketuDebug
  };
}

function roundedSignMinute(arcMinutes) {
  const rounded = Math.round(arcMinutes);
  const sign = Math.floor(rounded / 1800);
  const rem = rounded % 1800;
  return {
    sign,
    degree: Math.floor(rem / 60),
    minute: rem % 60
  };
}

test('Ketu 679: 14 Oct 1991 uses the calculated 2534 month 88 start', () => {
  const { planet, debug } = getKetu('1991-10-14');
  assert.equal(debug.referenceDate, '1991-07-12');
  assert.equal(debug.daysFromMonth88Start, 94);
  const pos = roundedSignMinute(planet.arcMinutes);
  assert.deepEqual(pos, { sign: 4, degree: 28, minute: 26 });
});

test('Ketu 679: 14 Dec 1991 uses the same calculated 2534 month 88 start', () => {
  const { planet, debug } = getKetu('1991-12-14');
  assert.equal(debug.referenceDate, '1991-07-12');
  assert.equal(debug.daysFromMonth88Start, 155);
  const pos = roundedSignMinute(planet.arcMinutes);
  assert.deepEqual(pos, { sign: 3, degree: 26, minute: 6 });
});

test('Ketu 679: month 88 anchor is not hard-coded to 1991', () => {
  const { debug } = getKetu('1990-10-14');
  assert.equal(debug.referenceDate, '1990-06-24');
  assert.equal(debug.month88BeYear, 2533);
  assert.equal(debug.daysFromMonth88Start, 112);
});


test('Ketu 679: the month 8/8 anchor date starts at 198°16′30″', () => {
  const { planet, debug } = getKetu('1991-07-12');
  assert.equal(debug.mode, 'month88-679');
  assert.equal(debug.daysFromMonth88Start, 0);
  assert.equal(debug.referenceDate, '1991-07-12');
  assert.ok(Math.abs(planet.arcMinutes - (198 * 60 + 16.5)) < 1e-9);
});

test('Ketu 679: a birth one day before month 8/8 keeps the original formula', () => {
  const { debug } = getKetu('1991-07-11');
  assert.equal(debug.mode, 'original-679');
  assert.equal(debug.referenceDate, null);
  assert.equal(debug.daysFromMonth88Start, null);
  assert.equal(debug.calendarCorrectionDays, 0);
});

test('Ketu 679: a normal year does not inherit a previous month 8/8 anchor', () => {
  const { debug } = getKetu('1992-10-14');
  assert.equal(debug.isAdhikamas, false);
  assert.equal(debug.mode, 'original-679');
  assert.equal(debug.referenceDate, null);
  assert.equal(debug.daysFromMonth88Start, null);
});

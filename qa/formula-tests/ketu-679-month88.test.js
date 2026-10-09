import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra, calculateMonth88StartForRecheck } from '../../js/astronomy/suriyayatra-engine.js';
import { THAI_LUNAR_LEAP_MONTH_REFERENCE } from '../../js/data/thai-lunar-leap-months.js';

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


function shiftCivilDate(date, days) {
  const [year, month, day] = date.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

test('Ketu 679: month 8/8 boundary selection across the full 201-year reference range', () => {
  const records = THAI_LUNAR_LEAP_MONTH_REFERENCE.records;
  const years = Object.keys(records).map(Number).sort((a, b) => a - b);
  assert.equal(years.length, 201);

  for (const beYear of years) {
    const start = calculateMonth88StartForRecheck(beYear);
    const record = records[String(beYear)];
    assert.equal(
      start !== null,
      record.yearType === 'อธิกมาส',
      'month 8/8 presence disagrees with calculated year type for BE ' + beYear
    );

    if (start) {
      const before = getKetu(shiftCivilDate(start, -1)).debug;
      const onStart = getKetu(start).debug;
      assert.equal(before.mode, 'original-679', 'day before month 8/8, BE ' + beYear);
      assert.equal(before.referenceDate, null, 'day before month 8/8, BE ' + beYear);
      assert.equal(onStart.mode, 'month88-679', 'month 8/8 start, BE ' + beYear);
      assert.equal(onStart.referenceDate, start, 'month 8/8 start, BE ' + beYear);
      assert.equal(onStart.daysFromMonth88Start, 0, 'month 8/8 start, BE ' + beYear);
    } else {
      const sampleDate = String(beYear - 543).padStart(4, '0') + '-10-14';
      const sample = getKetu(sampleDate).debug;
      assert.equal(sample.mode, 'original-679', 'normal/non-adhikamas year BE ' + beYear);
      assert.equal(sample.referenceDate, null, 'normal/non-adhikamas year BE ' + beYear);
    }
  }
});

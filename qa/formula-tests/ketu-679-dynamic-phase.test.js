import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra } from '../../js/astronomy/suriyayatra-engine.js';

const FULL_CIRCLE_ARCMIN = 21600;
const KETU_CYCLE_DAYS = 679;

function civilJulianDay(year, month, day) {
  const y = month > 2 ? year : year - 1;
  const m = month > 2 ? month + 1 : month + 13;
  const century = Math.floor(y / 100);
  return Math.floor(y * 365.25) + Math.floor(m * 30.6) + day + 1720997
    - century + Math.floor(century / 4);
}

function originalKetu679Arc(date) {
  const [year, month, day] = date.split('-').map(Number);
  const horakhun = civilJulianDay(year, month, day) - 1954167;
  const horakhunPrasong = horakhun - 1;
  const remainder = ((horakhunPrasong - 344) % KETU_CYCLE_DAYS + KETU_CYCLE_DAYS)
    % KETU_CYCLE_DAYS;
  const meanArc = remainder * FULL_CIRCLE_ARCMIN / KETU_CYCLE_DAYS;
  return ((FULL_CIRCLE_ARCMIN - meanArc) % FULL_CIRCLE_ARCMIN
    + FULL_CIRCLE_ARCMIN) % FULL_CIRCLE_ARCMIN;
}

function calculate(date) {
  return calculateSuriyayatra({
    date,
    time: '00:00',
    longitude: 105,
    includeMotion: false
  }).metadata.ketuDebug;
}

test('month 8/88 Ketu phase is derived from that year anchor, not a fixed universal angle', () => {
  for (const date of ['1991-10-14', '2010-10-14']) {
    const debug = calculate(date);
    assert.equal(debug.mode, 'month88-679', `expected month 8/88 anchored mode for ${date}`);
    assert.ok(debug.referenceDate, `missing month 8/88 anchor for ${date}`);
    assert.ok(Number.isFinite(debug.referenceArcMinutes));
    assert.ok(
      Math.abs(debug.referenceArcMinutes - originalKetu679Arc(debug.referenceDate)) < 1e-8,
      `anchor phase must equal the original 679-day formula for ${debug.referenceDate}`
    );
    assert.ok(
      Math.abs(debug.trueArcMinutes - originalKetu679Arc(date)) < 1e-8,
      `anchored result must remain continuous with the original formula on ${date}`
    );
  }
});

test('normal/pre-month-8/88 dates retain the original Ketu 679-day formula', () => {
  for (const date of ['1983-10-27', '1991-06-01']) {
    const debug = calculate(date);
    assert.equal(debug.mode, 'original-679');
    assert.equal(debug.referenceArcMinutes, null);
    assert.ok(
      Math.abs(debug.trueArcMinutes - originalKetu679Arc(date)) < 1e-8,
      `original formula changed for ${date}`
    );
  }
});

test('2010 month 8/88 result remains close to the independent Meemodel daily value', () => {
  const debug = calculate('2010-10-14');
  // Meemodel: 2010-10-14 Ketu = Gemini 8°48′ (68°48′).
  // The current horakhun/344 formula differs by about 7.5′ consistently
  // across the compared dates; preserve that known residual, do not hide it.
  const referenceArcMinutes = 68 * 60 + 48;
  const difference = Math.abs(debug.trueArcMinutes - referenceArcMinutes);
  assert.ok(difference < 8.5, `expected known residual under 8.5′; got ${difference.toFixed(3)}′`);
});

test.todo('1991 Golden Case phase origin: dynamic anchor yields Leo 28°27′, while locked Golden target is Leo 28°26′; resolve the 1′ discrepancy before merge');

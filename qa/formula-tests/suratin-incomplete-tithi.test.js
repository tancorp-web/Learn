import test from 'node:test';
import assert from 'node:assert/strict';

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

function birthTithi(suratin, avamanAtta, tithiAtta) {
  const avamanNumerator = suratin * 11 + avamanAtta;
  const quotient = Math.floor(avamanNumerator / 692);
  return {
    avamanBirth: mod(avamanNumerator, 692),
    tithiBirth: mod(quotient + suratin + tithiAtta, 30)
  };
}

function correctedSuratin(suratin, weekdayRemainder, tithi) {
  return weekdayRemainder !== tithi ? suratin - 1 : suratin;
}

test('22 May 2557: weekday remainder and tithi differ, so Suratin retreats one day', () => {
  const source = {
    suratin: 36,
    horakhunBirth: 502633,
    weekdayRemainder: 5,
    avamanAtta: 137,
    tithiAtta: 17,
    printedTithi: 13
  };
  const derived = birthTithi(source.suratin, source.avamanAtta, source.tithiAtta);
  assert.equal(source.horakhunBirth % 7, source.weekdayRemainder);
  assert.equal(derived.avamanBirth, 533);
  assert.equal(derived.tithiBirth, 23);
  // The source's printed final tithi=13 conflicts with its intermediate
  // arithmetic, but both values differ from weekday remainder 5.
  assert.notEqual(source.weekdayRemainder, source.printedTithi);
  assert.notEqual(source.weekdayRemainder, derived.tithiBirth);
  assert.equal(correctedSuratin(source.suratin, source.weekdayRemainder, derived.tithiBirth), 35);
});

test('2 March 2557: matching weekday remainder and tithi leaves Suratin unchanged', () => {
  const source = {
    suratin: 320,
    horakhunBirth: 502552,
    weekdayRemainder: 1,
    avamanAtta: 274,
    tithiAtta: 6
  };
  const derived = birthTithi(source.suratin, source.avamanAtta, source.tithiAtta);
  assert.equal(source.horakhunBirth % 7, source.weekdayRemainder);
  assert.equal(derived.avamanBirth, 334);
  assert.equal(derived.tithiBirth, 1);
  assert.equal(correctedSuratin(source.suratin, source.weekdayRemainder, derived.tithiBirth), 320);
});

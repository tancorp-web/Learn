import test from 'node:test';
import assert from 'node:assert/strict';

// Source-transcribed example from "ทำอัตตากำเนิด", 22 May 2557.
// The published example states Suratin=36, Horakhun birth=502633,
// weekday remainder=5, and tithi=13. The rule is applied only after
// comparing weekday remainder with tithi.
function correctedSuratin(suratin, weekdayRemainder, tithi) {
  return weekdayRemainder !== tithi ? suratin - 1 : suratin;
}

test('source example 22 May 2557: unequal weekday remainder and tithi retreats Suratin by one day', () => {
  const source = {
    suratin: 36,
    horakhunBirth: 502633,
    weekdayRemainder: 5,
    tithi: 13
  };
  assert.equal(source.horakhunBirth % 7, source.weekdayRemainder);
  assert.notEqual(source.weekdayRemainder, source.tithi);
  assert.equal(correctedSuratin(source.suratin, source.weekdayRemainder, source.tithi), 35);
});

test('matching weekday remainder and tithi does not retreat Suratin', () => {
  assert.equal(correctedSuratin(36, 13, 13), 36);
});

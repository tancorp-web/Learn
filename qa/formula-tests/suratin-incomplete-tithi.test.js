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

test('source example 22 May 2557: calculate tithi from the stated atta inputs and retreat on mismatch', () => {
  // Source values: Suratin=36, Horakhun birth=502633, weekday remainder=5,
  // Avaman atta=137 and tithi atta=17. The printed final tithi is 13, but
  // the displayed intermediate arithmetic appears to yield 23 (36+17=53,
  // remainder 23); preserve this discrepancy rather than silently choosing.
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
  assert.notEqual(source.weekdayRemainder, derived.tithiBirth);
  assert.notEqual(source.weekdayRemainder, source.printedTithi);
  assert.equal(correctedSuratin(source.suratin, source.weekdayRemainder, derived.tithiBirth), 35);
});

test('matching weekday remainder and tithi does not retreat Suratin', () => {
  assert.equal(correctedSuratin(36, 13, 13), 36);
});

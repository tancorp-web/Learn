import test from 'node:test';
import assert from 'node:assert/strict';

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

function ketuFromHorakhunBirth(horakhunBirth) {
  const remainder679 = mod(horakhunBirth - 344, 679);
  let remainder = remainder679 * 12;
  const rasi = Math.floor(remainder / 679);
  remainder = mod(remainder, 679) * 30;
  const degree = Math.floor(remainder / 679);
  remainder = mod(remainder, 679) * 60;
  const minute = Math.floor(remainder / 679);
  const meanArcMinutes = rasi * 1800 + degree * 60 + minute;
  const trueArcMinutes = mod(21600 - meanArcMinutes, 21600);
  const trueRasi = Math.floor(trueArcMinutes / 1800);
  const trueRemainder = mod(trueArcMinutes, 1800);
  return {
    remainder679,
    true: {
      rasi: trueRasi,
      degree: Math.floor(trueRemainder / 60),
      minute: mod(trueRemainder, 60)
    }
  };
}

test('Ketu: mismatch case retreats Horakhun birth and shifts the 679 result by 32 arcminutes', () => {
  // 22 May 2557: weekday remainder 5 differs from both source-printed tithi
  // 13 and the tithi 23 derived from the stated atta inputs.
  const uncorrected = ketuFromHorakhunBirth(502633);
  const corrected = ketuFromHorakhunBirth(502632);
  assert.equal(uncorrected.remainder679, 508);
  assert.deepEqual(uncorrected.true, { rasi: 3, degree: 0, minute: 40 });
  assert.equal(corrected.remainder679, 507);
  assert.deepEqual(corrected.true, { rasi: 3, degree: 1, minute: 12 });
});

test('Ketu: matching case must not retreat, unlike an unconditional Horakhun-minus-one step', () => {
  // 2 March 2557: weekday remainder 1 equals the derived tithi 1.
  const sourceCorrect = ketuFromHorakhunBirth(502552);
  const unconditionalMinusOne = ketuFromHorakhunBirth(502551);
  assert.deepEqual(sourceCorrect.true, { rasi: 4, degree: 13, minute: 37 });
  assert.deepEqual(unconditionalMinusOne.true, { rasi: 4, degree: 14, minute: 9 });
});

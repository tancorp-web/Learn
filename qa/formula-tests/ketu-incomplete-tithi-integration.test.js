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
    mean: { rasi, degree, minute },
    true: {
      rasi: trueRasi,
      degree: Math.floor(trueRemainder / 60),
      minute: mod(trueRemainder, 60)
    }
  };
}

test('Ketu integration diagnostic: source birth-atta retreat changes 679 result by 32 arcminutes', () => {
  // Source example 22 May 2557: Suratin=36 and Horakhun birth=502633.
  // Weekday remainder=5 differs from both the published final tithi (13) and
  // the tithi (23) derived from the printed atta inputs, so Suratin retreats
  // to 35 and Horakhun birth becomes 502632 before the Ketu calculation.
  const uncorrected = ketuFromHorakhunBirth(502633);
  const corrected = ketuFromHorakhunBirth(502632);
  assert.equal(uncorrected.remainder679, 508);
  assert.deepEqual(uncorrected.true, { rasi: 3, degree: 0, minute: 40 });
  assert.equal(corrected.remainder679, 507);
  assert.deepEqual(corrected.true, { rasi: 3, degree: 1, minute: 12 });
  const uncorrectedArc = uncorrected.true.rasi * 1800 + uncorrected.true.degree * 60 + uncorrected.true.minute;
  const correctedArc = corrected.true.rasi * 1800 + corrected.true.degree * 60 + corrected.true.minute;
  assert.equal(correctedArc - uncorrectedArc, 32);
});

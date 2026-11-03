import test from 'node:test';
import assert from 'node:assert/strict';

// Independent QA transcription of the published "ทำอัตตากำเนิด" steps.
// This deliberately does not import or change the production engine.
const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

function civilJulianDay(year, month, day) {
  const y = month > 2 ? year : year - 1;
  const m = month > 2 ? month + 1 : month + 13;
  const century = Math.floor(y / 100);
  return Math.floor(y * 365.25) + Math.floor(m * 30.6) + day + 1720997
    - century + Math.floor(century / 4);
}

function thaloengSok(chulaSakarat) {
  const horakhun = Math.floor((292207 * chulaSakarat + 373) / 800) + 1;
  const equationUnits = chulaSakarat * 207 + 800 * (
    Math.trunc((chulaSakarat + 38) / 100)
    - Math.trunc((chulaSakarat + 2) / 4)
    - Math.trunc((chulaSakarat + 238) / 400)
  ) - 4427;
  const remainder = equationUnits % 800;
  return {
    horakhun,
    fractionalDaySeconds: remainder === 0 ? 0 : remainder * 108
  };
}

function birthAttaForDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  const horakhun = civilJulianDay(year, month, day) - 1954167;
  const candidateCs = year + 543 - 1181;
  const candidate = thaloengSok(candidateCs);
  const chulaSakarat = horakhun < candidate.horakhun
    || (horakhun === candidate.horakhun && candidate.fractionalDaySeconds >= 0)
    ? candidateCs - 1
    : candidateCs;
  const thaloeng = thaloengSok(chulaSakarat);
  const suratin = horakhun - thaloeng.horakhun - 1;
  const horakhunBirth = thaloeng.horakhun + suratin;

  const avamanThaloengSok = mod(thaloeng.horakhun * 11 + 650, 692);
  const tithiThaloengSok = mod(
    Math.floor((thaloeng.horakhun * 11 + 650) / 692)
      + thaloeng.horakhun,
    30
  );
  const avamanBirth = mod(suratin * 11 + avamanThaloengSok, 692);
  const quotient = Math.floor((suratin * 11 + avamanThaloengSok) / 692);
  const tithiBirth = mod(quotient + suratin + tithiThaloengSok, 30);
  const weekdayRemainder = mod(horakhunBirth, 7);

  // The source says: if the weekday remainder does NOT agree with tithi,
  // step Suratin atta back by one. Compare before applying the correction.
  const correctionDays = weekdayRemainder !== tithiBirth ? 1 : 0;
  return {
    horakhunBirth,
    suratin,
    weekdayRemainder,
    tithiBirth,
    correctionDays,
    correctedSuratin: suratin - correctionDays
  };
}

test('incomplete-tithi rule: unequal weekday remainder and tithi steps Suratin back one day', () => {
  const result = birthAttaForDate('2014-05-22');
  assert.equal(result.weekdayRemainder, 4);
  assert.equal(result.tithiBirth, 22);
  assert.equal(result.correctionDays, 1);
  assert.equal(result.correctedSuratin, result.suratin - 1);
});

test('incomplete-tithi rule: equal weekday remainder and tithi does not step Suratin back', () => {
  const result = birthAttaForDate('2014-03-02');
  assert.equal(result.weekdayRemainder, 0);
  assert.equal(result.tithiBirth, 0);
  assert.equal(result.correctionDays, 0);
  assert.equal(result.correctedSuratin, result.suratin);
});

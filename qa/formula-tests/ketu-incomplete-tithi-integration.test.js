import test from 'node:test';
import assert from 'node:assert/strict';

// Independent QA transcription of the published Suriyayatra birth-atta
// sequence and the classical Ketu 344/679 -> Ujjani subtraction sequence.
// Diagnostic only: this test does NOT authorize applying the one-day
// incomplete-tithi retreat to the production Ketu branch.
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
  return { horakhun, fractionalDaySeconds: remainder === 0 ? 0 : remainder * 108 };
}

function birthAtta(date) {
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
  const totalThaloeng = thaloeng.horakhun * 11 + 650;
  const avamanThaloeng = mod(totalThaloeng, 692);
  const tithiThaloeng = mod(Math.floor(totalThaloeng / 692) + thaloeng.horakhun, 30);
  const quotientBirth = Math.floor((suratin * 11 + avamanThaloeng) / 692);
  const tithiBirth = mod(quotientBirth + suratin + tithiThaloeng, 30);
  const weekdayRemainder = mod(horakhunBirth, 7);
  const correctionDays = weekdayRemainder !== tithiBirth ? 1 : 0;
  return {
    horakhunBirth,
    suratin,
    weekdayRemainder,
    tithiBirth,
    correctionDays,
    correctedHorakhunBirth: horakhunBirth - correctionDays
  };
}

function ketuFromHorakhunBirth(horakhunBirth) {
  const remainder679 = mod(horakhunBirth - 344, 679);
  let remainder = remainder679 * 12;
  const rasi = Math.floor(remainder / 679);
  remainder = mod(remainder, 679) * 30;
  const degree = Math.floor(remainder / 679);
  remainder = mod(remainder, 679) * 60;
  const minute = Math.floor(remainder / 679);

  // Ujjani 11|29|60 is exactly 12 signs (360 degrees).
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

for (const sample of [
  { date: '1991-10-14', weekday: 1, tithi: 5, before: 494376, after: 494375, uncorrected: [4, 28, 28], corrected: [4, 29, 0] },
  { date: '1991-12-14', weekday: 6, tithi: 7, before: 494437, after: 494436, uncorrected: [3, 26, 7], corrected: [3, 26, 39] },
  { date: '1975-10-14', weekday: 2, tithi: 8, before: 488532, after: 488531, uncorrected: [0, 6, 54], corrected: [0, 7, 26] }
]) {
  test(`Ketu diagnostic ${sample.date}: one-day retreat shifts the 679-day result`, () => {
    const atta = birthAtta(sample.date);
    assert.equal(atta.weekdayRemainder, sample.weekday);
    assert.equal(atta.tithiBirth, sample.tithi);
    assert.equal(atta.correctionDays, 1);
    assert.equal(atta.horakhunBirth, sample.before);
    assert.equal(atta.correctedHorakhunBirth, sample.after);

    const uncorrected = ketuFromHorakhunBirth(atta.horakhunBirth).true;
    const corrected = ketuFromHorakhunBirth(atta.correctedHorakhunBirth).true;
    assert.deepEqual([uncorrected.rasi, uncorrected.degree, uncorrected.minute], sample.uncorrected);
    assert.deepEqual([corrected.rasi, corrected.degree, corrected.minute], sample.corrected);
  });
}

test('matching weekday remainder and tithi leaves Ketu input unchanged', () => {
  const atta = birthAtta('2014-03-02');
  assert.equal(atta.weekdayRemainder, 0);
  assert.equal(atta.tithiBirth, 0);
  assert.equal(atta.correctionDays, 0);
  assert.equal(atta.correctedHorakhunBirth, atta.horakhunBirth);
});

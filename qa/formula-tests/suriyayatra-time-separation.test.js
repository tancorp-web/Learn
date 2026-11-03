import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra, localTimeCorrectionMinutes } from '../../js/astronomy/suriyayatra-engine.js';

test('planetary Suriyayatra time is independent of province longitude', () => {
  const bkk = calculateSuriyayatra({date:'1975-10-14', time:'01:05', longitude:100.494066});
  const khonkaen = calculateSuriyayatra({date:'1975-10-14', time:'01:05', longitude:102.8236});

  assert.equal(bkk.metadata.calculationTimeMinutes, 47);
  assert.equal(khonkaen.metadata.calculationTimeMinutes, 65);
  assert.equal(bkk.metadata.planetaryTimeOffsetMinutes, -18);
  assert.equal(khonkaen.metadata.planetaryTimeOffsetMinutes, -18);
  assert.notEqual(bkk.metadata.localTimeCorrectionMinutes, khonkaen.metadata.localTimeCorrectionMinutes);
  assert.deepEqual(
    bkk.planets.map(p => p.arcMinutes),
    khonkaen.planets.map(p => p.arcMinutes)
  );
});

test('province correction remains available for Anto-natee ascendant stage', () => {
  assert.equal(
    localTimeCorrectionMinutes(100.494066),
    4 * (105 - 100.494066)
  );
  assert.equal(
    localTimeCorrectionMinutes(102.8236),
    4 * (105 - 102.8236)
  );
});


test('planetary clock rolls to the previous civil day before 00:18 Thai time', () => {
  const before = calculateSuriyayatra({date:'2026-11-03', time:'00:17', longitude:105, includeMotion:false});
  const boundary = calculateSuriyayatra({date:'2026-11-03', time:'00:18', longitude:105, includeMotion:false});
  assert.equal(before.metadata.calculationTimeMinutes, 1439);
  assert.equal(before.metadata.planetaryHorakhun, before.harakun - 1);
  assert.equal(boundary.metadata.calculationTimeMinutes, 0);
  assert.equal(boundary.metadata.planetaryHorakhun, boundary.harakun);
});

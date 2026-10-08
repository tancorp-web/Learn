import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra, localTimeCorrectionMinutes } from '../../js/astronomy/suriyayatra-engine.js';

test('Horakhun reference is date-based and independent of province longitude', () => {
  const bkk = calculateSuriyayatra({date:'1975-10-14', time:'01:05', longitude:100.494066});
  const khonkaen = calculateSuriyayatra({date:'1975-10-14', time:'01:05', longitude:102.8236});
  assert.equal(bkk.harakun, 488535);
  assert.equal(khonkaen.harakun, 488535);
});

test('local-meridian correction is exposed but does not alter planetary positions', () => {
  const bkk = calculateSuriyayatra({date:'1975-10-14', time:'01:05', longitude:100.494066});
  const khonkaen = calculateSuriyayatra({date:'1975-10-14', time:'01:05', longitude:102.8236});
  assert.equal(localTimeCorrectionMinutes(100.494066), 4 * (105 - 100.494066));
  assert.equal(localTimeCorrectionMinutes(102.8236), 4 * (105 - 102.8236));
  assert.deepEqual(
    bkk.planets.map(p => p.arcMinutes),
    khonkaen.planets.map(p => p.arcMinutes)
  );
  assert.equal(bkk.metadata.calculationTimeMinutes, 65);
  assert.equal(khonkaen.metadata.calculationTimeMinutes, 65);
});

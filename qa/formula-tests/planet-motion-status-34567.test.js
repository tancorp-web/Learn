import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDailyLongitudeDeltaArcmin,
  calculateSuriyayatra,
  classifyPlanetMotionStatus
} from '../../js/astronomy/suriyayatra-engine.js';

const limits = {
  'อังคาร': [25, 39],
  'พุธ': [35, 97],
  'พฤหัสบดี': [5, 8],
  'ศุกร์': [25, 72],
  'เสาร์': [2, 5]
};

for (const [planet, [manda, sarit]] of Object.entries(limits)) {
  test(planet + ' uses its confirmed daily motion boundaries', () => {
    assert.equal(classifyPlanetMotionStatus(planet, -0.001), 'พักร์');
    assert.equal(classifyPlanetMotionStatus(planet, 0), 'มณฑ์');
    assert.equal(classifyPlanetMotionStatus(planet, manda - 0.001), 'มณฑ์');
    assert.equal(classifyPlanetMotionStatus(planet, manda), 'ปกติ');
    assert.equal(classifyPlanetMotionStatus(planet, sarit), 'ปกติ');
    assert.equal(classifyPlanetMotionStatus(planet, sarit + 0.001), 'เสริด');
  });
}

test('daily longitude delta wraps correctly across 360 degrees', () => {
  assert.ok(Math.abs(calculateDailyLongitudeDeltaArcmin(0.1, 359.9) - 12) < 1e-9);
  assert.ok(Math.abs(calculateDailyLongitudeDeltaArcmin(359.9, 0.1) + 12) < 1e-9);
});

test('daily delta and classifier reject invalid input', () => {
  assert.throws(() => calculateDailyLongitudeDeltaArcmin(Number.NaN, 1), /DAILY_LONGITUDE_INVALID/);
  assert.throws(() => classifyPlanetMotionStatus('อังคาร', Number.NaN), /PLANET_MOTION_DELTA_INVALID/);
  assert.equal(classifyPlanetMotionStatus('มฤตยู', -0.021), 'พักร์');
  assert.equal(classifyPlanetMotionStatus('มฤตยู', -0.02), 'มณฑ์');
  assert.equal(classifyPlanetMotionStatus('มฤตยู', 0), 'มณฑ์');
  assert.equal(classifyPlanetMotionStatus('มฤตยู', 0.679), 'มณฑ์');
  assert.equal(classifyPlanetMotionStatus('มฤตยู', 0.68), 'ปกติ');
  assert.equal(classifyPlanetMotionStatus('มฤตยู', 0.72), 'ปกติ');
  assert.equal(classifyPlanetMotionStatus('มฤตยู', 0.721), 'เสริด');
  assert.throws(() => classifyPlanetMotionStatus('เนปจูน', 0.5), /PLANET_MOTION_UNSUPPORTED/);
});

test('engine exposes the same today-minus-yesterday delta and status for planets 3–7', () => {
  const date = '2026-11-03';
  const time = '12:00';
  const longitude = 105;
  const current = calculateSuriyayatra({ date, time, longitude });
  const previous = calculateSuriyayatra({ date: '2026-11-02', time, longitude, includeMotion: false });
  for (const planet of Object.keys(limits)) {
    const now = current.planets.find(item => item.name === planet);
    const yesterday = previous.planets.find(item => item.name === planet);
    const expectedDelta = calculateDailyLongitudeDeltaArcmin(now.longitude, yesterday.longitude);
    assert.ok(Math.abs(now.speedArcminPerDay - expectedDelta) < 1e-9, planet + ' daily delta');
    assert.equal(now.motionState, classifyPlanetMotionStatus(planet, expectedDelta), planet + ' status');
  }
});


test('Uranus exposes its wrapped today-minus-yesterday delta and six-planet model metadata', () => {
  const date = '2026-11-03';
  const time = '12:00';
  const longitude = 105;
  const current = calculateSuriyayatra({ date, time, longitude });
  const previous = calculateSuriyayatra({ date: '2026-11-02', time, longitude, includeMotion:false });
  const now = current.planets.find(item => item.name === 'มฤตยู');
  const yesterday = previous.planets.find(item => item.name === 'มฤตยู');
  const expectedDelta = calculateDailyLongitudeDeltaArcmin(now.longitude, yesterday.longitude);
  assert.ok(Math.abs(now.speedArcminPerDay - expectedDelta) < 1e-9);
  assert.equal(now.motionState, classifyPlanetMotionStatus('มฤตยู', expectedDelta));
  assert.equal(now.meanSpeedArcminPerDay, 0.7);
  assert.match(current.metadata.motionModel, /Uranus/);
});

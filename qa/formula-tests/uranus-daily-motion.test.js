import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyUranusDailyMotion } from '../../js/astronomy/suriyayatra-engine.js';

test('Uranus daily motion follows Excel 69.xlsx thresholds', () => {
  assert.equal(classifyUranusDailyMotion(-0.01), 'พักร์');
  assert.equal(classifyUranusDailyMotion(0), 'มณฑ์');
  assert.equal(classifyUranusDailyMotion(0.5), 'มณฑ์');
  assert.equal(classifyUranusDailyMotion(0.999), 'มณฑ์');
  assert.equal(classifyUranusDailyMotion(1), '');
  assert.equal(classifyUranusDailyMotion(1.001), 'เสริด');
});

test('Uranus daily motion rejects invalid deltas', () => {
  assert.throws(() => classifyUranusDailyMotion(Number.NaN), /URANUS_DAILY_DELTA_INVALID/);
});

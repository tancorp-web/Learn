import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getConfirmedPlanetaryStandards,
  getPlanetaryDignities,
  DIGNITY_DATA_VERSION
} from '../../js/data/planetary-dignities.js';

test('confirmed sign-based standards are used by runtime classification', () => {
  assert.ok(getPlanetaryDignities('อาทิตย์', 'มีน').includes('อุจจาวิลาส'));
  assert.ok(getPlanetaryDignities('พุธ', 'มีน').includes('ประ'));
  assert.ok(getPlanetaryDignities('ศุกร์', 'กันย์').includes('นิจ'));
});

test('maha exaltation/debilitation require the confirmed exact degree', () => {
  assert.ok(getPlanetaryDignities('อาทิตย์', 'เมษ', 10, 0, 0).includes('มหาอุจจ์'));
  assert.ok(!getPlanetaryDignities('อาทิตย์', 'เมษ', 9, 59, 0).includes('มหาอุจจ์'));
  assert.ok(getPlanetaryDignities('อาทิตย์', 'ตุล', 10, 0, 0).includes('มหานิจ'));
  assert.ok(!getPlanetaryDignities('อาทิตย์', 'ตุล', 11, 0, 0).includes('มหานิจ'));
});

test('moolatrikona uses inclusive lower and exclusive upper boundaries', () => {
  assert.ok(getPlanetaryDignities('อาทิตย์', 'สิงห์', 0, 0, 0).includes('มูลตรีโกณ'));
  assert.ok(getPlanetaryDignities('อาทิตย์', 'สิงห์', 19, 59, 59).includes('มูลตรีโกณ'));
  assert.ok(!getPlanetaryDignities('อาทิตย์', 'สิงห์', 20, 0, 0).includes('มูลตรีโกณ'));
});

test('unconfirmed planet rules are not invented', () => {
  assert.deepEqual(getConfirmedPlanetaryStandards('เกตุ', 'เมษ', 10, 0, 0), []);
});

test('runtime dignity data version identifies confirmed standards integration', () => {
  assert.equal(DIGNITY_DATA_VERSION, '1.2.0-confirmed-standards-runtime');
});

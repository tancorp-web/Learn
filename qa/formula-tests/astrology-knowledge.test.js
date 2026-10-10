import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { classifyPlanetInSign, getNatalPlanetFacts } from '../../js/astrology/knowledge.js';

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(resolve(here, '../../data/astrology/planetary_dignities.json'), 'utf8'));

test('rule registry remains discovery-only', () => {
  assert.equal(registry.status, 'DISCOVERY');
  assert.ok(registry.rules.length > 0);
});

test('Mars in Aries returns all matching labels and rule IDs', () => {
  const result = classifyPlanetInSign({ planet: 'อังคาร', sign: 'เมษ', registry });
  assert.equal(result.status, 'MATCHED');
  assert.ok(result.matches.some(x => x.ruleId === 'DIGNITY-KASET-MARS-ARIES' && x.category === 'เกษตร'));
  assert.ok(result.matches.every(x => x.status === 'DISCOVERY'));
  assert.equal(result.registryStatus, 'DISCOVERY');
});

test('personal natal house is joined to the same planet/sign lookup', () => {
  const result = getNatalPlanetFacts({
    planet: 'Mars',
    longitude: 15,
    ascendantLongitude: 60,
    registry
  });
  assert.equal(result.sign, 'aries');
  assert.equal(result.signThai, 'เมษ');
  assert.equal(result.houseNumber, 11);
  assert.equal(result.houseName, 'ลาภะ');
  assert.ok(result.dignity.matches.some(x => x.category === 'เกษตร'));
  assert.equal(result.dignity.registryStatus, 'DISCOVERY');
});

test('unknown planet/sign does not invent a mapping', () => {
  const result = classifyPlanetInSign({ planet: 'เกตุ', sign: 'เมษ', registry });
  assert.equal(result.status, 'NO_RECORDED_MATCH');
  assert.deepEqual(result.matches, []);
});

test('caller can exclude all unverified rules', () => {
  const result = classifyPlanetInSign({
    planet: 'mars', sign: 'aries', registry, includeUnverified: false
  });
  assert.equal(result.status, 'NO_RECORDED_MATCH');
});

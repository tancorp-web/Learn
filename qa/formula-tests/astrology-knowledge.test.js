import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { classifyPlanetInSign, getNatalPlanetFacts } from '../../js/astrology/knowledge.js';

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(resolve(here, '../../data/knowledge/planetary-sign-standards.json'), 'utf8'));

test('structured registry is marked discovery and not enabled by default', () => {
  assert.equal(registry.status, 'DISCOVERY');
  assert.equal(registry.defaultEnabled, false);
});

test('Mars in Aries can be queried by Thai planet and sign names', () => {
  const result = classifyPlanetInSign({ planet: 'อังคาร', sign: 'เมษ', registry });
  assert.equal(result.status, 'MATCHED');
  assert.ok(result.matches.some(x => x.id === 'kaset' && x.name === 'เกษตร'));
  // Preserve the recorded table as-is; do not silently resolve overlapping mappings.
  assert.ok(result.matches.some(x => x.id === 'pra' && x.name === 'ประ/ประเกษตร'));
  assert.equal(result.registryStatus, 'DISCOVERY');
});

test('planet names and sign names accept English aliases and numeric sign index', () => {
  const result = classifyPlanetInSign({ planet: 'Mars', sign: 0, registry });
  assert.equal(result.planet, 'อังคาร');
  assert.equal(result.sign, 'เมษ');
  assert.ok(result.matches.some(x => x.id === 'kaset'));
});

test('personal natal house is calculated from this chart’s ascendant longitude', () => {
  const result = getNatalPlanetFacts({
    planet: 'Mars',
    longitude: 15,
    ascendantLongitude: 60,
    registry
  });
  assert.equal(result.sign, 'เมษ');
  assert.equal(result.houseNumber, 11);
  assert.equal(result.houseName, 'ลาภะ');
  assert.ok(result.dignity.matches.some(x => x.id === 'kaset'));
});

test('unknown planet/sign does not invent a standard mapping', () => {
  const result = classifyPlanetInSign({ planet: 'เกตุ', sign: 'เมษ', registry });
  assert.equal(result.status, 'NO_RECORDED_MATCH');
  assert.deepEqual(result.matches, []);
});

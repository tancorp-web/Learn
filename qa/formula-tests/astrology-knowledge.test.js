import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { classifyPlanetInSign, getNatalPlanetFacts } from '../../js/astrology/knowledge.js';

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(resolve(here, '../../data/astrology/planetary_dignities.json'), 'utf8'));

test('rule registry identifies the source-workbook dataset and its mixed verification states', () => {
  assert.equal(registry.schema_version, '1.3.0');
  assert.equal(registry.status, 'SOURCE_WORKBOOK_WITH_USER_CONFIRMED_OVERRIDES');
  assert.ok(registry.rules.length > 0);

  const statuses = new Set(registry.rules.map(rule => rule.status));
  assert.deepEqual(
    [...statuses].sort(),
    ['CONFIRMED_BY_USER', 'DISCOVERY', 'SOURCE_WORKBOOK'].sort()
  );
});

test('Mars in Aries returns both discovery and source-workbook records without promoting either', () => {
  const result = classifyPlanetInSign({ planet: 'อังคาร', sign: 'เมษ', registry });
  assert.equal(result.status, 'MATCHED');
  assert.equal(result.registryStatus, 'SOURCE_WORKBOOK_WITH_USER_CONFIRMED_OVERRIDES');

  const byId = new Map(result.matches.map(match => [match.ruleId, match]));
  assert.equal(byId.get('DIGNITY-KASET-MARS-ARIES')?.category, 'เกษตร');
  assert.equal(byId.get('DIGNITY-KASET-MARS-ARIES')?.status, 'DISCOVERY');
  assert.equal(byId.get('WB69-------MARS-ARIES')?.category, 'เกษตร');
  assert.equal(byId.get('WB69-------MARS-ARIES')?.status, 'SOURCE_WORKBOOK');
});

test('personal natal house is joined to the same planet/sign lookup and preserves registry provenance', () => {
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
  assert.equal(result.dignity.registryStatus, 'SOURCE_WORKBOOK_WITH_USER_CONFIRMED_OVERRIDES');
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

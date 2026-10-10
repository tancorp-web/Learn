import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPECIAL_CRITERIA_SIGN_ORDER,
  getWholeSignHouse,
  buildZodiacSignComparison,
  compareSpecialCriteria
} from '../../js/astrology/special-criteria-comparison.js';

test('comparison module provides all twelve zodiac signs in fixed order', () => {
  const result = buildZodiacSignComparison({ ascendantSign: 'เมษ' });
  assert.deepEqual(result.map(item => item.sign), SPECIAL_CRITERIA_SIGN_ORDER);
  assert.equal(result.length, 12);
  assert.equal(result.find(item => item.sign === 'เมษ').houseFromAscendant, 1);
  assert.equal(result.find(item => item.sign === 'กรกฎ').houseFromAscendant, 4);
  assert.equal(result.find(item => item.sign === 'ตุล').houseFromAscendant, 7);
  assert.equal(result.find(item => item.sign === 'มกร').houseFromAscendant, 10);
});

test('whole-sign house counting rejects unknown zodiac signs', () => {
  assert.equal(getWholeSignHouse('เมษ', 'กุมภ์'), 11);
  assert.equal(getWholeSignHouse('ไม่ทราบ', 'เมษ'), null);
  assert.equal(getWholeSignHouse('เมษ', 'ไม่ทราบ'), null);
});

test('zodiac comparison shows planetary occupants and reference criteria by sign', () => {
  const rows = buildZodiacSignComparison({
    ascendantSign: 'เมษ',
    planetPositions: [
      { planet: 'อาทิตย์', sign: 'เมษ' },
      { planet: 'เสาร์', sign: 'พฤษภ' },
      { planet: 'อังคาร', sign: 'กันย์' }
    ]
  });
  assert.deepEqual(rows.find(item => item.sign === 'เมษ').occupants, ['อาทิตย์']);
  assert.equal(rows.find(item => item.sign === 'เมษ').isAscendantSign, true);
  assert.ok(rows.find(item => item.sign === 'พฤษภ').criteria.some(item => item.id === 'SPECIAL-SAO-CHAI-FOUR-POSTS'));
  assert.ok(rows.find(item => item.sign === 'กันย์').criteria.some(item => item.id === 'SPECIAL-PRAK-KENDRA'));
});

test('Padum reference rule matches only when all recorded planet-house conditions are present', () => {
  const result = compareSpecialCriteria({
    ascendantSign: 'เมษ',
    planetPositions: [
      { planet: 'จันทร์', sign: 'กุมภ์' },
      { planet: 'พฤหัสบดี', sign: 'กรกฎ' },
      { planet: 'ศุกร์', sign: 'มิถุน' }
    ]
  });
  const padum = result.criteria.find(item => item.id === 'SPECIAL-PADUM-KENDRA');
  assert.equal(padum.resultType, 'reference-match');
  assert.equal(padum.fullMatch, true);
  assert.equal(padum.evaluatedAgainstReferenceOnly, true);
  assert.equal(result.summary.noAutomaticJudgment, true);

  const incomplete = compareSpecialCriteria({
    ascendantSign: 'เมษ',
    planetPositions: [{ planet: 'จันทร์', sign: 'กุมภ์' }]
  }).criteria.find(item => item.id === 'SPECIAL-PADUM-KENDRA');
  assert.equal(incomplete.fullMatch, false);
  assert.ok(incomplete.missingPlanets.includes('พฤหัสบดี'));
});

test('Ascendant alone does not satisfy unresolved coffin-pattern occupancy', () => {
  const result = compareSpecialCriteria({
    ascendantSign: 'กุมภ์',
    planetPositions: [
      { planet: 'อาทิตย์', sign: 'มิถุน' },
      { planet: 'จันทร์', sign: 'สิงห์' },
      { planet: 'อังคาร', sign: 'ธนู' }
    ]
  });
  const coffin = result.criteria.find(item => item.id === 'SPECIAL-COFFIN');
  assert.equal(coffin.fullMatch, false);
  assert.deepEqual(coffin.missingRequiredSigns, ['กุมภ์']);
  assert.equal(coffin.ascendantOccupancyUnresolved, true);
});

test('comparison never enables any rule and excludes merged duplicate entries', () => {
  const result = compareSpecialCriteria({});
  assert.ok(result.criteria.every(item => item.execution !== 'ENABLED'));
  assert.equal(result.criteria.some(item => item.id === 'SPECIAL-COFFIN-CHEST'), false);
  assert.equal(result.zodiacComparison.length, 12);
});

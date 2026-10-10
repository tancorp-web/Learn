import test from 'node:test';
import assert from 'node:assert/strict';
import {
  THAI_SPECIAL_ASTROLOGY_CRITERIA,
  THAI_SPECIAL_CRITERIA_DECISIONS,
  THAI_SPECIAL_NAME_MERGE_DECISIONS,
  CRITERION_STATUS,
  getThaiSpecialCriterionById,
  getThaiSpecialCriteriaByName,
  getThaiSpecialCriteriaSummary
} from '../../js/data/thai-special-criteria.js';

test('special-criteria catalogue has unique stable IDs and names', () => {
  const ids = THAI_SPECIAL_ASTROLOGY_CRITERIA.map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(THAI_SPECIAL_ASTROLOGY_CRITERIA.length >= 30);
  assert.ok(THAI_SPECIAL_ASTROLOGY_CRITERIA.every(x => x.id && x.name && x.category && x.status));
});

test('catalogue does not silently enable unverified astrology rules', () => {
  assert.ok(THAI_SPECIAL_ASTROLOGY_CRITERIA.every(x => x.execution !== 'ENABLED'));
  assert.ok(THAI_SPECIAL_ASTROLOGY_CRITERIA.some(x => x.status === CRITERION_STATUS.NEEDS_SOURCE));
  assert.ok(THAI_SPECIAL_ASTROLOGY_CRITERIA.some(x => x.status === CRITERION_STATUS.SOURCE_VARIANT));
  assert.equal(getThaiSpecialCriteriaSummary().executable, 0);
});

test('coffin pattern records the four stated signs and unspecified planet identities', () => {
  const rule = getThaiSpecialCriterionById('SPECIAL-COFFIN');
  assert.deepEqual(rule.requiredSigns, ['มิถุน', 'สิงห์', 'ธนู', 'กุมภ์']);
  assert.ok(rule.acceptedOccupants.includes('ลัคนา'));
  assert.match(rule.planets, /ดาวใดก็ได้/);
  assert.equal(rule.execution, 'REFERENCE_ONLY');
});

test('known specific planet conditions remain explicit and provisional', () => {
  const rule = getThaiSpecialCriterionById('SPECIAL-PADUM-KENDRA');
  assert.equal(rule.status, CRITERION_STATUS.REFERENCE_PROVISIONAL);
  assert.deepEqual(rule.planetConditions, [
    { planet: 'จันทร์', houseFromAscendant: 11 },
    { planet: 'พฤหัสบดี', houseFromAscendant: 4 },
    { planet: 'ศุกร์', houseFromAscendant: 3 }
  ]);
  assert.equal(rule.execution, 'REFERENCE_ONLY');
});

test('unverified names are preserved without invented planet formulas', () => {
  for (const id of ['SPECIAL-DOK-UTTAPHIT', 'SPECIAL-NAM-PHON', 'SPECIAL-TAM-PHON']) {
    const rule = getThaiSpecialCriterionById(id);
    assert.ok(rule);
    assert.equal(rule.status, CRITERION_STATUS.NEEDS_SOURCE);
    assert.equal(rule.execution, 'DISABLED');
    assert.equal(rule.ruleType, null);
  }
});

test('lookup returns all matches and unknown names return an empty list', () => {
  assert.equal(getThaiSpecialCriteriaByName('ดอกพิกุล')[0].id, 'SPECIAL-DOK-PHIKUN');
  assert.deepEqual(getThaiSpecialCriteriaByName('ชื่อที่ไม่มีในคลัง'), []);
});


test('advisor variant decisions are recorded but none are enabled', () => {
  assert.deepEqual(
    THAI_SPECIAL_CRITERIA_DECISIONS.map(x => [x.criterionId, x.selectedVariant]),
    [
      ['SPECIAL-COFFIN', 'A'],
      ['SPECIAL-ELEMENT-KENDRA', 'A'],
      ['SPECIAL-CHATUSADAI', 'A'],
      ['SPECIAL-KITA-KENDRA', 'B']
    ]
  );
  assert.ok(THAI_SPECIAL_CRITERIA_DECISIONS.every(x => x.state === 'RECORDED_NOT_ENABLED'));
  assert.equal(THAI_SPECIAL_ASTROLOGY_CRITERIA.some(x => x.execution === 'ENABLED'), false);
});

test('confirmed name merges resolve to one canonical catalogue entry', () => {
  assert.equal(THAI_SPECIAL_NAME_MERGE_DECISIONS.length, 6);
  for (const name of ['ดอกอุตพิด', 'นำพล', 'ขับพล', 'ดวงโลงศพ', 'ดวงหนุมาน', 'มาลัยโยค', 'อัฒจักร']) {
    assert.equal(getThaiSpecialCriteriaByName(name).length, 1, name);
  }
  assert.equal(getThaiSpecialCriteriaByName('ดวงโลงศพ')[0].id, 'SPECIAL-COFFIN');
  assert.equal(getThaiSpecialCriteriaByName('ดวงหนุมาน')[0].id, 'SPECIAL-CHART-TRIANGLE');
  assert.equal(getThaiSpecialCriteriaByName('มาลัยโยค')[0].id, 'SPECIAL-CHANDRA-HALF');
});

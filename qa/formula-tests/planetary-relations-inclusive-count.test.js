import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInclusiveSignCount,
  checkCountedRelationship,
  checkCompleteCountedPattern
} from '../../js/data/planetary-relations.js';

test('inclusive sign count counts the starting sign as position 1', () => {
  assert.equal(getInclusiveSignCount('เมษ', 'เมษ'), 1);
  assert.equal(getInclusiveSignCount('เมษ', 'กรกฎ'), 4);
  assert.equal(getInclusiveSignCount('เมษ', 'สิงห์'), 5);
  assert.equal(getInclusiveSignCount('มีน', 'เมษ'), 2);
  assert.equal(getInclusiveSignCount('unknown', 'เมษ'), null);
});

test('trine checks the fifth counted sign from a planet or ascendant', () => {
  assert.equal(checkCountedRelationship({
    relation: 'ตรีโกณ', fromSign: 'เมษ', toSign: 'สิงห์', startPointType: 'planet'
  }).matches, true);
  assert.equal(checkCountedRelationship({
    relation: 'ตรีโกณ', fromSign: 'เมษ', toSign: 'สิงห์', startPointType: 'ascendant'
  }).matches, true);
  assert.equal(checkCountedRelationship({
    relation: 'ตรีโกณ', fromSign: 'เมษ', toSign: 'กรกฎ', startPointType: 'planet'
  }).matches, false);
});

test('chatu-kona checks the fourth counted sign from a planet or ascendant', () => {
  assert.equal(checkCountedRelationship({
    relation: 'จตุโกณ', fromSign: 'เมษ', toSign: 'กรกฎ', startPointType: 'planet'
  }).matches, true);
  assert.equal(checkCountedRelationship({
    relation: 'จตุโกณ', fromSign: 'เมษ', toSign: 'กรกฎ', startPointType: 'ascendant'
  }).matches, true);
  assert.equal(checkCountedRelationship({
    relation: 'จตุโกณ', fromSign: 'เมษ', toSign: 'สิงห์', startPointType: 'ascendant'
  }).matches, false);
});

test('rejects unspecified start point types and unsupported relations', () => {
  assert.equal(checkCountedRelationship({
    relation: 'ตรีโกณ', fromSign: 'เมษ', toSign: 'สิงห์', startPointType: 'other'
  }).reason, 'invalid-start-point-type');
  assert.equal(checkCountedRelationship({
    relation: 'ฉาก', fromSign: 'เมษ', toSign: 'สิงห์', startPointType: 'planet'
  }).reason, 'unsupported-relation');
});

test('trine requires planets in all three counted signs: 1, 5, and 9', () => {
  assert.equal(checkCompleteCountedPattern({ relation: 'ตรีโกณ', fromSign: 'เมษ', occupiedSigns: ['เมษ', 'สิงห์', 'ธนู'], startPointType: 'planet' }).matches, true);
  const partial = checkCompleteCountedPattern({ relation: 'ตรีโกณ', fromSign: 'เมษ', occupiedSigns: ['เมษ', 'สิงห์'], startPointType: 'ascendant' });
  assert.equal(partial.matches, false);
  assert.deepEqual(partial.missingSigns, ['ธนู']);
});

test('chatu-kona requires planets in all four counted signs: 1, 4, 7, and 10', () => {
  assert.equal(checkCompleteCountedPattern({ relation: 'จตุโกณ', fromSign: 'เมษ', occupiedSigns: ['เมษ', 'กรกฎ', 'ตุล', 'มกร'], startPointType: 'ascendant' }).matches, true);
  const partial = checkCompleteCountedPattern({ relation: 'จตุโกณ', fromSign: 'เมษ', occupiedSigns: ['เมษ', 'กรกฎ', 'มกร'], startPointType: 'planet' });
  assert.equal(partial.matches, false);
  assert.deepEqual(partial.missingSigns, ['ตุล']);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getInclusiveSignCount,
  checkCountedRelationship
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

import test from 'node:test';
import assert from 'node:assert/strict';
import { findSignBoundaryEvents } from '../../js/astronomy/sign-boundary-search.js';

test('adaptive scan detects a short leave-and-return hidden between equal six-hour samples', async () => {
  const hour = 3_600_000;
  const start = 0;
  let evaluations = 0;
  const positionAt = stamp => {
    evaluations++;
    const t = stamp / hour;
    // A narrow prograde-then-retrograde excursion across 30°,
    // peaking at hour 9; all six-hour coarse samples stay below 30°.
    return 29.7 + 0.4 * Math.max(0, 1 - ((t - 8) / 3.5) ** 2);
  };
  const events = await findSignBoundaryEvents({
    start,
    planet: 'ดาวทดสอบ',
    longitude: 0,
    targetSign: 0,
    direction: 1,
    step: 6 * hour,
    maxSpanMs: 12 * hour,
    positionAt
  });
  assert.deepEqual(events.map(item => item.type), ['ออก', 'เข้า']);
  assert.ok(events[0].stamp < 8 * hour);
  assert.ok(events[1].stamp > 8 * hour);
  assert.ok(events[1].stamp - events[0].stamp < 4 * hour);
  assert.ok(evaluations < 100, 'station refinement must use bounded evaluations, not a minute-by-minute scan');
});

test('ordinary sign ingress and egress remain detected with coarse samples', async () => {
  const hour = 3_600_000;
  const events = await findSignBoundaryEvents({
    start: 0,
    planet: 'ดาวทดสอบ',
    longitude: 0,
    targetSign: 0,
    direction: 1,
    step: 6 * hour,
    maxSpanMs: 18 * hour,
    positionAt: stamp => 29 + stamp / hour * 0.2
  });
  assert.deepEqual(events.map(item => item.type), ['ออก']);
});

test('adaptive station scan also finds the nearest reverse-time leave-and-return events', async () => {
  const hour = 3_600_000;
  const positionAt = stamp => {
    const t = stamp / hour;
    return 29.7 + 0.4 * Math.max(0, 1 - ((t - 8) / 3.5) ** 2);
  };
  const events = await findSignBoundaryEvents({
    start: 18 * hour,
    planet: 'ดาวทดสอบ',
    longitude: 0,
    targetSign: 0,
    direction: -1,
    step: 6 * hour,
    maxSpanMs: 18 * hour,
    positionAt
  });
  assert.deepEqual(events.map(item => item.type), ['เข้า', 'ออก']);
  assert.ok(events[0].stamp > events[1].stamp);
});

test('adaptive station scan detects a leave-and-return excursion hidden between twelve-hour samples', async () => {
  const hour = 3_600_000;
  const positionAt = stamp => {
    const t = stamp / hour;
    // The peak is between the 12-hour samples; both endpoints remain in sign 0.
    return 29.7 + 0.4 * Math.max(0, 1 - ((t - 15) / 5) ** 2);
  };
  const events = await findSignBoundaryEvents({
    start: 0,
    planet: 'ดาวทดสอบ',
    longitude: 0,
    targetSign: 0,
    direction: 1,
    step: 12 * hour,
    maxSpanMs: 24 * hour,
    positionAt
  });
  assert.deepEqual(events.map(item => item.type), ['ออก', 'เข้า']);
  assert.ok(events[0].stamp < 15 * hour);
  assert.ok(events[1].stamp > 15 * hour);
  assert.ok(events[1].stamp - events[0].stamp < 6 * hour);
});

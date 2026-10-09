import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMonth88StartForRecheck
} from '../../js/astronomy/suriyayatra-engine.js';
import {
  THAI_LUNAR_LEAP_MONTH_REFERENCE,
  compareCalculatedMonth88Start,
  getThaiLunarLeapMonthRecord,
  hasVerifiedMonth88Start
} from '../../js/data/thai-lunar-leap-months.js';

const reference = THAI_LUNAR_LEAP_MONTH_REFERENCE;
const years = Object.keys(reference.records).map(Number).sort((a, b) => a - b);

test('backup coverage is exactly the declared 201 consecutive BE years', () => {
  assert.equal(years.length, 201);
  assert.equal(years[0], reference.coverage.buddhistYearStart);
  assert.equal(years.at(-1), reference.coverage.buddhistYearEnd);
  assert.equal(years.at(-1) - years[0] + 1, years.length);

  for (let i = 0; i < years.length; i += 1) {
    assert.equal(years[i], years[0] + i, 'missing or duplicate BE year near index ' + i);
    const row = getThaiLunarLeapMonthRecord(years[i]);
    assert.equal(row.buddhistEra, years[i]);
    assert.equal(row.gregorianYear, years[i] - 543);
    assert.ok(['ปกติมาส', 'อธิกมาส', 'อธิกวาร'].includes(row.yearType));
    if (row.month88) {
      assert.match(row.month88.startDate, /^\\d{4}-\\d{2}-\\d{2}$/);
      assert.equal(row.month88.startTimeLocal, '06:00');
      assert.equal(row.month88.startDateTimeLocal, row.month88.startDate + 'T06:00:00+07:00');
      assert.equal(row.yearType, 'อธิกมาส');
    } else {
      assert.notEqual(row.yearType, 'อธิกมาส', 'an อธิกมาส year must have a month 8/8 record');
    }
  }
});

test('HORA formula is compared against backup for every year; discrepancies fail CI', () => {
  const mismatches = [];
  let matched = 0;
  let sourceVerified = 0;
  let sourceUnverified = 0;

  for (const beYear of years) {
    const record = getThaiLunarLeapMonthRecord(beYear);
    const calculated = calculateMonth88StartForRecheck(beYear);
    const expected = record.month88?.startDate ?? null;

    if (calculated === expected) matched += 1;
    else mismatches.push({ beYear, expected, calculated, validationStatus: record.validationStatus });

    if (hasVerifiedMonth88Start(beYear)) sourceVerified += 1;
    else sourceUnverified += 1;
  }

  console.log(
    '[Thai lunar recheck] total=' + years.length +
    ', formula-vs-backup-matched=' + matched +
    ', source-verified=' + sourceVerified +
    ', source-unverified=' + sourceUnverified +
    ', mismatches=' + mismatches.length
  );

  assert.deepEqual(
    mismatches,
    [],
    'HORA month 8/8 formula differs from saved backup. Investigate each year; do not auto-correct the formula. First mismatches: ' +
      JSON.stringify(mismatches.slice(0, 20))
  );
});

test('independently source-checked anchors agree with HORA formula', () => {
  assert.equal(hasVerifiedMonth88Start(2484), true);
  assert.equal(calculateMonth88StartForRecheck(2484), null);
  assert.deepEqual(compareCalculatedMonth88Start(2484, null), {
    status: 'PASS', expected: null, calculated: null
  });

  assert.equal(hasVerifiedMonth88Start(2534), true);
  assert.equal(calculateMonth88StartForRecheck(2534), '1991-07-12');
  assert.deepEqual(compareCalculatedMonth88Start(2534, '1991-07-12'), {
    status: 'PASS', expected: '1991-07-12', calculated: '1991-07-12'
  });
});

test('reference helper does not label unchecked years as verified', () => {
  assert.deepEqual(compareCalculatedMonth88Start(2533, '1990-06-24'), {
    status: 'UNVERIFIED', expected: reference.records['2533'].month88?.startDate ?? null,
    calculated: '1990-06-24'
  });
  assert.equal(compareCalculatedMonth88Start(2200, null).status, 'OUT_OF_RANGE');
  assert.throws(() => calculateMonth88StartForRecheck('2534'), TypeError);
});

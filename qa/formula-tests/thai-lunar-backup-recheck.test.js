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
      assert.match(row.month88.startDate, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(row.month88.startTimeLocal, '06:00');
      assert.equal(row.month88.startDateTimeLocal, row.month88.startDate + 'T06:00:00+07:00');
      assert.equal(row.yearType, 'อธิกมาส');
    } else {
      assert.notEqual(row.yearType, 'อธิกมาส', 'an อธิกมาส year must have a month 8/8 record');
    }
  }
});

test('compare HORA formula with all 201 backup rows and report unverified discrepancies', () => {
  const mismatches = [];
  const verifiedMismatches = [];
  let matched = 0;
  let independentlyCheckedRows = 0;

  for (const beYear of years) {
    const record = getThaiLunarLeapMonthRecord(beYear);
    const calculated = calculateMonth88StartForRecheck(beYear);
    const expected = record.month88?.startDate ?? null;

    if (calculated === expected) {
      matched += 1;
    } else {
      const mismatch = { beYear, expected, calculated, validationStatus: record.validationStatus };
      mismatches.push(mismatch);
      if (record.validationStatus === 'calendar-source-checked') {
        verifiedMismatches.push(mismatch);
      }
    }

    if (record.validationStatus === 'calendar-source-checked') independentlyCheckedRows += 1;
  }

  console.log(
    '[Thai lunar recheck] total=' + years.length +
    ', formula-vs-backup-matched=' + matched +
    ', formula-vs-backup-different=' + mismatches.length +
    ', independently-source-checked-rows=' + independentlyCheckedRows +
    ', differences-in-source-checked-rows=' + verifiedMismatches.length
  );
  if (mismatches.length) {
    console.warn('[Thai lunar recheck] First differences for manual review: ' + JSON.stringify(mismatches.slice(0, 20)));
  }

  // Unchecked backup rows are diagnostic only: they must never auto-correct
  // HORA's formula or be presented as official truth. Only source-checked rows
  // can block deployment until the reference has been independently reconciled.
  assert.deepEqual(
    verifiedMismatches,
    [],
    'HORA formula differs from an independently source-checked row: ' + JSON.stringify(verifiedMismatches)
  );
});

test('independently source-checked anchors agree with HORA formula', () => {
  const normalYear = getThaiLunarLeapMonthRecord(2484);
  assert.equal(normalYear.validationStatus, 'calendar-source-checked');
  assert.equal(normalYear.month88, null);
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
    status: 'UNVERIFIED',
    expected: reference.records['2533'].month88?.startDate ?? null,
    calculated: '1990-06-24'
  });
  assert.equal(compareCalculatedMonth88Start(2200, null).status, 'OUT_OF_RANGE');
  assert.throws(() => calculateMonth88StartForRecheck('2534'), TypeError);
});

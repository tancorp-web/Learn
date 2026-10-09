import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLegacyMonth88StartForRecheck,
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

function utcDayDifference(calculated, expected) {
  if (!calculated || !expected) return null;
  const toUtc = (date) => {
    const [year, month, day] = date.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((toUtc(calculated) - toUtc(expected)) / 86400000);
}

test('classical calendar engine preserves the verified month 8/8 anchors', () => {
  assert.equal(calculateMonth88StartForRecheck(2534), '1991-07-12');
  assert.equal(calculateMonth88StartForRecheck(2533), '1990-06-24');
});

test('report the old tithi-boundary formula separately for diagnosis', () => {
  const differences = [];
  for (const beYear of years) {
    const current = calculateMonth88StartForRecheck(beYear);
    const legacy = calculateLegacyMonth88StartForRecheck(beYear);
    if (current !== legacy) differences.push({ beYear, classical: current, legacy });
  }
  console.log('[Thai lunar recheck] classical-vs-legacy-tithi differences=' + differences.length);
  console.log('[Thai lunar recheck] first classical-vs-legacy differences=' + JSON.stringify(differences.slice(0, 15)));
});

test('compare HORA formula with all 201 backup rows and report unverified discrepancies', () => {
  const mismatches = [];
  const verifiedMismatches = [];
  const offsetCounts = new Map();
  let matched = 0;
  let independentlyCheckedRows = 0;

  for (const beYear of years) {
    const record = getThaiLunarLeapMonthRecord(beYear);
    const calculated = calculateMonth88StartForRecheck(beYear);
    const expected = record.month88?.startDate ?? null;

    if (calculated === expected) {
      matched += 1;
    } else {
      const dayOffset = utcDayDifference(calculated, expected);
      const mismatch = {
        beYear,
        expected,
        calculated,
        dayOffset,
        discrepancyType: expected === null ? 'formula-found-date-backup-says-no-month88'
          : calculated === null ? 'backup-has-month88-formula-says-none'
          : Math.abs(dayOffset) <= 1 ? 'within-one-day'
          : Math.abs(dayOffset) >= 29 && Math.abs(dayOffset) <= 30 ? 'one-lunar-month-like-offset'
          : 'other-date-offset',
        validationStatus: record.validationStatus
      };
      const offsetKey = dayOffset === null ? 'missing-date-on-one-side' : String(dayOffset);
      offsetCounts.set(offsetKey, (offsetCounts.get(offsetKey) ?? 0) + 1);
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
    console.warn('[Thai lunar recheck] Difference types: ' + JSON.stringify(
      mismatches.reduce((counts, row) => {
        counts[row.discrepancyType] = (counts[row.discrepancyType] ?? 0) + 1;
        return counts;
      }, {})
    ));
    console.warn('[Thai lunar recheck] Exact day-offset counts: ' + JSON.stringify(
      Object.fromEntries([...offsetCounts.entries()].sort((a, b) => {
        if (a[0] === 'missing-date-on-one-side') return 1;
        if (b[0] === 'missing-date-on-one-side') return -1;
        return Number(a[0]) - Number(b[0]);
      }))
    ));
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

/**
 * Thai lunar leap-month reference data for HORA Ketu calculations.
 *
 * IMPORTANT:
 * - Reference-only data. This file is intentionally NOT imported into main.js.
 * - Do not infer leap-month years using a fixed 2–3 year cycle.
 * - Add a year only after checking it against the chosen Thai lunar calendar source.
 * - Store both the astronomical new-moon timestamp and the Thai lunar calendar
 *   day boundary. They are not necessarily the same time.
 *
 * Calendar convention used for the day boundary:
 *   Thai lunar date runs from local sunrise, approximated here as 06:00 ICT,
 *   to 05:59 ICT the following civil date. If the HORA Golden convention differs,
 *   update the convention explicitly before using this data in calculations.
 *
 * Source for the 2534 BE anchor:
 *   MyHora Thai lunar calendar, 2534 BE:
 *   https://myhora.com/calendar/thai-2534.aspx
 *   It lists 12 July 1991 as ขึ้น 1 ค่ำ เดือนแปดหลัง (๘๘), with new moon at 02:06.
 *   Cross-check: https://myhora.com/calendar/thai-08-2534-rs7.aspx
 *
 * Royal Society explanation of traditional insertion:
 *   https://www.orst.go.th/FILEROOM/CABROYINWEB/DRAWER004/GENERAL/DATA0000/00000617.FLP/html/41/
 */

export const THAI_LUNAR_LEAP_MONTH_REFERENCE = {
  version: '1.0.0-reference-only',
  status: 'partial-verified-reference',
  calendar: 'Thai lunar calendar (ปฏิทินจันทรคติไทย)',
  timezone: 'Asia/Bangkok',
  timezoneOffset: '+07:00',
  lunarDayConvention: {
    startsAtLocalTime: '06:00',
    endsAtLocalTime: '05:59',
    note: 'Approximate sunrise convention; preserve the exact HORA Golden convention when integrating.',
  },
  month88: {
    thaiName: 'เดือนแปดหลัง',
    notation: '๘๘',
    insertionRule: 'In an อธิกมาส year, insert a 30-day month 8/8 after month 8 and before month 9.',
    startTimeMeaning: 'calendarDayBoundary',
  },
  records: {
    '2534': {
      buddhistEra: 2534,
      gregorianYear: 1991,
      yearType: 'อธิกมาส',
      validationStatus: 'calendar-source-checked',
      sourceUrls: [
        'https://myhora.com/calendar/thai-2534.aspx',
        'https://myhora.com/calendar/thai-08-2534-rs7.aspx',
      ],
      month8: {
        startDate: null,
        startTimeLocal: null,
        note: 'Not yet recorded here; do not substitute the month 8/8 date.',
      },
      month88: {
        startDate: '1991-07-12',
        startTimeLocal: '06:00',
        startDateTimeLocal: '1991-07-12T06:00:00+07:00',
        thaiDateAtStart: 'ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)',
        astronomicalNewMoonDateTimeLocal: '1991-07-12T02:06:00+07:00',
        sourceCalendarBoundary: 'Thai lunar date begins at approximately 06:00 local time',
        note: 'The astronomical new moon is listed at 02:06, but the Thai lunar calendar day boundary is approximately 06:00. Keep these timestamps separate.',
      },
      month9: {
        startDate: '1991-08-11',
        startTimeLocal: '06:00',
        startDateTimeLocal: '1991-08-11T06:00:00+07:00',
        thaiDateAtStart: 'ขึ้น ๑ ค่ำ เดือนเก้า (๙)',
      },
      goldenKetuAnchors: [
        {
          birthDate: '1991-10-14',
          birthTimeLocal: '01:05',
          expectedKetu: '28°26′ สิงห์',
          status: 'user-provided-golden-anchor-needs-formula-validation',
        },
        {
          birthDate: '1991-12-14',
          birthTimeLocal: '01:05',
          expectedKetu: '26°06′ กรกฎ',
          status: 'user-provided-golden-anchor-needs-formula-validation',
        },
      ],
      notes: [
        'The year is identified as อธิกมาส by the cited Thai lunar calendar.',
        'The dates/times here are calendar reference values, not a completed Ketu formula.',
        'Do not modify other planet formulas while validating this reference.',
      ],
    },
  },
};

/**
 * Retrieve an explicitly recorded year. Returns null when the year has not
 * been verified and recorded; intentionally does not guess leap-month status.
 */
export function getThaiLunarLeapMonthRecord(buddhistYear) {
  return THAI_LUNAR_LEAP_MONTH_REFERENCE.records[String(buddhistYear)] ?? null;
}

/**
 * Return the recorded month 8/8 calendar boundary as an ISO-like local value.
 * Returns null if no verified record or boundary is available.
 */
export function getMonth88Start(buddhistYear) {
  const record = getThaiLunarLeapMonthRecord(buddhistYear);
  return record?.month88?.startDateTimeLocal ?? null;
}

/**
 * Determine whether a record is usable for month 8/8 date-based calculations.
 * This checks for a verified calendar boundary, not the correctness of a Ketu
 * formula or the accuracy of a source-specific astronomical event time.
 */
export function hasVerifiedMonth88Start(buddhistYear) {
  const record = getThaiLunarLeapMonthRecord(buddhistYear);
  return Boolean(
    record &&
    record.validationStatus === 'calendar-source-checked' &&
    record.month88?.startDate &&
    record.month88?.startTimeLocal
  );
}

export default THAI_LUNAR_LEAP_MONTH_REFERENCE;

/**
 * HORA Astrology — Antō-nāthī Sāmān (อันโตนาทีสามัญ)
 * Version: 1.0.0-reference-only
 *
 * PURPOSE
 * Reference table and helper calculations for estimating daily ascendant
 * (ลัคนาจร) sign transitions and the time boundaries between zodiac signs.
 *
 * This file is intentionally standalone and is NOT imported by main.js.
 * It stores the traditional common Antō-nāthī values, not location-specific
 * astronomical ascensional times. Use a separately chosen sunrise/local-time
 * convention when turning offsets into civil clock times.
 *
 * Reference basis:
 * - AstroNeemo, Horawittaya chapter 9:
 *   https://www.astroneemo.net/articles/horawittaya-1-chapter-9-ascendant.html
 * - Horapayakorn, simplified Suriyayat ascendant method:
 *   https://www.horapayakorn.com/index.php?Id=2147525466&Ntype=1&ac=article&lay=show
 */

export const ANTO_NATHI_SAMAN_SIGNS = Object.freeze([
  { index: 0, sign: 'เมษ', english: 'Aries', minutes: 120 },
  { index: 1, sign: 'พฤษภ', english: 'Taurus', minutes: 96 },
  { index: 2, sign: 'มิถุน', english: 'Gemini', minutes: 72 },
  { index: 3, sign: 'กรกฎ', english: 'Cancer', minutes: 120 },
  { index: 4, sign: 'สิงห์', english: 'Leo', minutes: 144 },
  { index: 5, sign: 'กันย์', english: 'Virgo', minutes: 168 },
  { index: 6, sign: 'ตุลย์', english: 'Libra', minutes: 168 },
  { index: 7, sign: 'พิจิก', english: 'Scorpio', minutes: 144 },
  { index: 8, sign: 'ธนู', english: 'Sagittarius', minutes: 120 },
  { index: 9, sign: 'มกร', english: 'Capricorn', minutes: 72 },
  { index: 10, sign: 'กุมภ์', english: 'Aquarius', minutes: 96 },
  { index: 11, sign: 'มีน', english: 'Pisces', minutes: 120 },
]);

export const ANTO_NATHI_SAMAN_REFERENCE = Object.freeze({
  name: 'อันโตนาทีสามัญ',
  totalMinutesPerCycle: 1440,
  degreesPerSign: 30,
  startingReference: 'ราศีที่อาทิตย์สถิต ณ เวลาอาทิตย์อุทัย',
  elapsedMinutesFormula: '(อันโตนาทีของราศีอาทิตย์ × องศาอาทิตย์) ÷ 30',
  remainingMinutesFormula: 'อันโตนาทีของราศีอาทิตย์ − อันโตนาทีที่ล่วงแล้ว',
  nextBoundaryRule: 'หลังขอบเขตแรก ให้สะสมอันโตนาทีของราศีถัดไปตามลำดับจักรราศี',
  clockTimeRule: 'เวลาขอบเขต = เวลาอาทิตย์อุทัยที่เลือก + นาทีสะสม',
  localAdjustment: 'ต้องระบุว่าจะใช้ 06:00 น. แบบตำรา หรือเวลาอาทิตย์ขึ้น/เวลาท้องถิ่นที่ปรับแล้ว',
  useCase: 'reference for daily/transiting ascendant and sign-boundary clock times',
  runtimeIntegrated: false,
  mainJsImportRequired: false,
});

/**
 * Returns the common Antō-nāthī duration for a sign index (0=Aries ... 11=Pisces).
 */
export function getAntoNathiSamanMinutes(signIndex) {
  if (!Number.isInteger(signIndex) || signIndex < 0 || signIndex > 11) {
    throw new RangeError('signIndex must be an integer from 0 to 11');
  }
  return ANTO_NATHI_SAMAN_SIGNS[signIndex].minutes;
}

/**
 * Given the Sun's sign index and degree at the chosen sunrise reference,
 * return the elapsed and remaining common Antō-nāthī minutes within that sign.
 * sunDegree must be in [0, 30).
 */
export function getSunSignAntoNathiParts(sunSignIndex, sunDegree) {
  if (!Number.isFinite(sunDegree) || sunDegree < 0 || sunDegree >= 30) {
    throw new RangeError('sunDegree must be >= 0 and < 30');
  }
  const duration = getAntoNathiSamanMinutes(sunSignIndex);
  const elapsedMinutes = duration * sunDegree / 30;
  return Object.freeze({
    signIndex: sunSignIndex,
    sign: ANTO_NATHI_SAMAN_SIGNS[sunSignIndex].sign,
    durationMinutes: duration,
    elapsedMinutes,
    remainingMinutes: duration - elapsedMinutes,
  });
}

/**
 * Returns the next 12 sign-boundary offsets measured in minutes from the
 * chosen sunrise reference. The first boundary is the end of the Sun's sign;
 * later boundaries are accumulated durations of the following signs.
 *
 * This produces traditional common-Antō-nāthī offsets, not verified local
 * astronomical rise times. Caller must convert offsets to clock times using
 * the selected sunrise/local-time convention.
 */
export function getAscendantBoundaryOffsets(sunSignIndex, sunDegree) {
  const sunParts = getSunSignAntoNathiParts(sunSignIndex, sunDegree);
  const boundaries = [];
  let offsetMinutes = sunParts.remainingMinutes;
  let nextSignIndex = (sunSignIndex + 1) % 12;

  for (let step = 0; step < 12; step += 1) {
    boundaries.push(Object.freeze({
      offsetMinutes,
      entersSignIndex: nextSignIndex,
      entersSign: ANTO_NATHI_SAMAN_SIGNS[nextSignIndex].sign,
      leavesSignIndex: (nextSignIndex + 11) % 12,
      leavesSign: ANTO_NATHI_SAMAN_SIGNS[(nextSignIndex + 11) % 12].sign,
    }));
    offsetMinutes += ANTO_NATHI_SAMAN_SIGNS[nextSignIndex].minutes;
    nextSignIndex = (nextSignIndex + 1) % 12;
  }
  return Object.freeze(boundaries);
}

export const ANTO_NATHI_SAMAN_METADATA = Object.freeze({
  version: '1.0.0-reference-only',
  runtimeIntegrated: false,
  mainJsImportRequired: false,
});

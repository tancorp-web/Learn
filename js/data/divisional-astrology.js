/**
 * HORA Astrology — divisional astrology reference data
 * Version: 1.0.0-reference-only
 *
 * Reference data only. Intentionally NOT imported into main.js.
 * Does not alter natal planet calculations or prediction rules.
 *
 * Core geometry:
 * - 1 sign = 30 degrees
 * - 1 triyang (drekkana) = 10 degrees; 3 per sign
 * - 1 navamsa = 3 degrees 20 minutes; 9 per sign
 * - 1 nakshatra = 13 degrees 20 minutes; 4 padas of 3 degrees 20 minutes
 *
 * Terminology note:
 * "ฉินทฤกษ์" and "ภิณทฤกษ์/ฤกษ์อกแตก" appear in some muhurta traditions with
 * distinct technical definitions. Keep these as separate terms and do not
 * automatically label a nakshatra auspicious/inauspicious without selecting
 * and documenting the exact school/source.
 */

export const DIVISIONAL_ASTROLOGY_VERSION = '1.0.0-reference-only';

export const ZODIAC_SIGNS = [
  { index: 0, name: 'เมษ', element: 'ไฟ', modality: 'จรราศี' },
  { index: 1, name: 'พฤษภ', element: 'ดิน', modality: 'สถิรราศี' },
  { index: 2, name: 'มิถุน', element: 'ลม', modality: 'อุภยราศี' },
  { index: 3, name: 'กรกฎ', element: 'น้ำ', modality: 'จรราศี' },
  { index: 4, name: 'สิงห์', element: 'ไฟ', modality: 'สถิรราศี' },
  { index: 5, name: 'กันย์', element: 'ดิน', modality: 'อุภยราศี' },
  { index: 6, name: 'ตุล', element: 'ลม', modality: 'จรราศี' },
  { index: 7, name: 'พิจิก', element: 'น้ำ', modality: 'สถิรราศี' },
  { index: 8, name: 'ธนู', element: 'ไฟ', modality: 'อุภยราศี' },
  { index: 9, name: 'มกร', element: 'ดิน', modality: 'จรราศี' },
  { index: 10, name: 'กุมภ์', element: 'ลม', modality: 'สถิรราศี' },
  { index: 11, name: 'มีน', element: 'น้ำ', modality: 'อุภยราศี' }
];

export const DIVISION_SIZES = Object.freeze({
  signArcMinutes: 1800,       // 30 degrees
  triyangArcMinutes: 600,     // 10 degrees
  navamsaArcMinutes: 200,     // 3 degrees 20 minutes
  nakshatraArcMinutes: 800,   // 13 degrees 20 minutes
  nakshatraPadaArcMinutes: 200
});

export const TRIYANG_SECTIONS = [
  { number: 1, name: 'ปฐมตรียางค์', startArcMinutes: 0, endArcMinutes: 600 },
  { number: 2, name: 'ทุติยตรียางค์', startArcMinutes: 600, endArcMinutes: 1200 },
  { number: 3, name: 'ตติยตรียางค์', startArcMinutes: 1200, endArcMinutes: 1800 }
];

// Traditional Thai astrology reference: planetary rulers of triyang sections
// are assigned by the three signs of the same element, in order:
// initial element sign (ปฐม), middle element sign (ทุติย), final element sign (ตติย).
// Reference-only; this table is NOT imported by main.js and does not change runtime calculations.
// Aquarius / air-element third triyang varies by school: Rahu (8) or Saturn (7).
export const TRIYANG_RULERS_BY_ELEMENT = Object.freeze({
  ไฟ: [
    { number: 1, name: 'ปฐมตรียางค์', sign: 'เมษ', planetNumber: 3, planet: 'อังคาร' },
    { number: 2, name: 'ทุติยตรียางค์', sign: 'สิงห์', planetNumber: 1, planet: 'อาทิตย์' },
    { number: 3, name: 'ตติยตรียางค์', sign: 'ธนู', planetNumber: 5, planet: 'พฤหัสบดี' }
  ],
  ดิน: [
    { number: 1, name: 'ปฐมตรียางค์', sign: 'พฤษภ', planetNumber: 6, planet: 'ศุกร์' },
    { number: 2, name: 'ทุติยตรียางค์', sign: 'กันย์', planetNumber: 4, planet: 'พุธ' },
    { number: 3, name: 'ตติยตรียางค์', sign: 'มกร', planetNumber: 7, planet: 'เสาร์' }
  ],
  ลม: [
    { number: 1, name: 'ปฐมตรียางค์', sign: 'มิถุน', planetNumber: 4, planet: 'พุธ' },
    { number: 2, name: 'ทุติยตรียางค์', sign: 'ตุล', planetNumber: 6, planet: 'ศุกร์' },
    { number: 3, name: 'ตติยตรียางค์', sign: 'กุมภ์', planetNumber: null, planet: null, alternatives: [
      { planetNumber: 8, planet: 'ราหู' },
      { planetNumber: 7, planet: 'เสาร์' }
    ], status: 'ต้องเลือกตามตำรา' }
  ],
  น้ำ: [
    { number: 1, name: 'ปฐมตรียางค์', sign: 'กรกฎ', planetNumber: 2, planet: 'จันทร์' },
    { number: 2, name: 'ทุติยตรียางค์', sign: 'พิจิก', planetNumber: 3, planet: 'อังคาร' },
    { number: 3, name: 'ตติยตรียางค์', sign: 'มีน', planetNumber: 5, planet: 'พฤหัสบดี' }
  ]
});


// 27 nakshatras, each spanning 13°20′; each has four padas of 3°20′.
// Spellings are common Thai transliterations; variant spellings exist.
export const NAKSHATRAS = [
  'อัศวินี', 'ภรณี', 'กฤติกา', 'โรหิณี', 'มฤคศิระ', 'อารทรา',
  'ปุนรวสุ', 'ปุษยะ', 'อาศเลษา', 'มฆา', 'ปูรพผลคุนี', 'อุตตรผลคุนี',
  'หัสตะ', 'จิตรา', 'สวาติ', 'วิศาขา', 'อนุราธา', 'เชษฐา',
  'มูละ', 'ปูรพาษาฒา', 'อุตตราษาฒา', 'ศรวณะ', 'ธนิษฐา',
  'ศตภิษก์', 'ปูรพภัทรปทา', 'อุตตรภัทรปทา', 'เรวดี'
].map((name, index) => ({
  number: index + 1,
  name,
  startArcMinutes: index * DIVISION_SIZES.nakshatraArcMinutes,
  endArcMinutes: (index + 1) * DIVISION_SIZES.nakshatraArcMinutes,
  padaCount: 4,
  padaArcMinutes: DIVISION_SIZES.nakshatraPadaArcMinutes
}));

/**
 * Return the Navamsa sign for a zodiac sign and a position within that sign.
 * signIndex: 0..11 in Aries-to-Pisces order.
 * arcMinutes: 0..1799, minutes from the start of the sign.
 *
 * Standard Navamsa start rule:
 * movable signs start from themselves; fixed signs start from the 9th sign
 * from themselves; dual signs start from the 5th sign from themselves.
 */
export function getNavamsa(signIndex, arcMinutes) {
  if (!Number.isInteger(signIndex) || signIndex < 0 || signIndex > 11) {
    throw new RangeError('signIndex must be an integer from 0 to 11');
  }
  if (!Number.isFinite(arcMinutes) || arcMinutes < 0 || arcMinutes >= 1800) {
    throw new RangeError('arcMinutes must be from 0 (inclusive) to 1800 (exclusive)');
  }

  const sign = ZODIAC_SIGNS[signIndex];
  const navamsaNumber = Math.floor(arcMinutes / DIVISION_SIZES.navamsaArcMinutes) + 1;
  const offset = sign.modality === 'จรราศี' ? 0
    : sign.modality === 'สถิรราศี' ? 8
    : 4;
  const navamsaSignIndex = (signIndex + offset + navamsaNumber - 1) % 12;

  return {
    sourceSign: sign.name,
    navamsaNumber,
    startArcMinutes: (navamsaNumber - 1) * DIVISION_SIZES.navamsaArcMinutes,
    endArcMinutes: navamsaNumber * DIVISION_SIZES.navamsaArcMinutes,
    navamsaSign: ZODIAC_SIGNS[navamsaSignIndex].name,
    navamsaSignIndex
  };
}

export function getTriyang(signIndex, arcMinutes) {
  if (!Number.isInteger(signIndex) || signIndex < 0 || signIndex > 11) {
    throw new RangeError('signIndex must be an integer from 0 to 11');
  }
  if (!Number.isFinite(arcMinutes) || arcMinutes < 0 || arcMinutes >= 1800) {
    throw new RangeError('arcMinutes must be from 0 (inclusive) to 1800 (exclusive)');
  }
  const section = TRIYANG_SECTIONS[Math.floor(arcMinutes / DIVISION_SIZES.triyangArcMinutes)];
  return { sign: ZODIAC_SIGNS[signIndex].name, ...section };
}

export function getNakshatraPada(totalZodiacArcMinutes) {
  if (!Number.isFinite(totalZodiacArcMinutes) || totalZodiacArcMinutes < 0 || totalZodiacArcMinutes >= 21600) {
    throw new RangeError('totalZodiacArcMinutes must be from 0 (inclusive) to 21600 (exclusive)');
  }
  const nakshatraNumber = Math.floor(totalZodiacArcMinutes / DIVISION_SIZES.nakshatraArcMinutes);
  const withinNakshatra = totalZodiacArcMinutes % DIVISION_SIZES.nakshatraArcMinutes;
  const pada = Math.floor(withinNakshatra / DIVISION_SIZES.nakshatraPadaArcMinutes) + 1;
  return {
    nakshatraNumber: nakshatraNumber + 1,
    nakshatra: NAKSHATRAS[nakshatraNumber].name,
    pada,
    startArcMinutes: nakshatraNumber * DIVISION_SIZES.nakshatraArcMinutes
      + (pada - 1) * DIVISION_SIZES.nakshatraPadaArcMinutes,
    endArcMinutes: nakshatraNumber * DIVISION_SIZES.nakshatraArcMinutes
      + pada * DIVISION_SIZES.nakshatraPadaArcMinutes
  };
}

// Source-sensitive classifications: retain terminology without applying it
// until the user confirms the chosen traditional reference.
export const NAKSHATRA_CLASSIFICATION_TERMS = [
  { term: 'ฉินทฤกษ์', status: 'needs-source-specific-rule' },
  { term: 'ภิณทฤกษ์', aliases: ['ฤกษ์อกแตก'], status: 'needs-source-specific-rule' }
];

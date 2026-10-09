/**
 * HORA Astrology — Thaksa reference data
 * Version: 1.0.0-reference-only
 *
 * PURPOSE
 * Reference-only data for Thaksa, weekday naming, age-yang, and the central
 * position ("taklang"). This file is intentionally NOT imported by main.js
 * and does not change any calculation/runtime behavior.
 *
 * IMPORTANT: Traditional schools and printed manuals can differ in details.
 * Treat the conventions below as explicit reference data, not as an automatic
 * calculation rule until a source-specific method has been selected and tested.
 */

/** Eight Thaksa positions, in the traditional sequence. */
export const THAKSA_POSITIONS = Object.freeze([
  { key: 'บริวาร', order: 1, meaning: 'ญาติ บริวาร ผู้สนับสนุน' },
  { key: 'อายุ', order: 2, meaning: 'อายุ สุขภาพ ความเป็นอยู่' },
  { key: 'เดช', order: 3, meaning: 'อำนาจ บารมี ความกล้าหาญ' },
  { key: 'ศรี', order: 4, meaning: 'สิริมงคล เสน่ห์ ความสำเร็จ' },
  { key: 'มูละ', order: 5, meaning: 'ทรัพย์สิน หลักฐาน ความมั่นคง' },
  { key: 'อุตสาหะ', order: 6, meaning: 'ความเพียร การงาน ความพยายาม' },
  { key: 'มนตรี', order: 7, meaning: 'ผู้ใหญ่ คำแนะนำ ความช่วยเหลือ' },
  { key: 'กาลกิณี', order: 8, meaning: 'อุปสรรค สิ่งที่ควรระวังตามตำรา' },
]);

/**
 * Traditional 3×3 diagram often used to explain the eight directions and
 * the central Ketu position. 9 is the central position, not a ninth Thaksa
 * category; the eight named Thaksa positions remain the eight directions.
 */
export const THAKSA_NINE_CELL_DIAGRAM = Object.freeze([
  Object.freeze([1, 2, 3]),
  Object.freeze([6, 9, 4]),
  Object.freeze([8, 5, 7]),
]);

export const THAKSA_CENTER = Object.freeze({
  cell: 9,
  planet: 'เกตุ',
  label: 'ตากลาง',
  isOneOfEightThaksaPositions: false,
});

/**
 * Birth-time day-boundary convention requested for this project:
 * before 06:00 local Thailand time, use the previous calendar date to derive
 * the weekday for Thaksa/naming/age-yang. At exactly 06:00 or later, use the
 * calendar date as entered. This rule is kept here as data and is not wired
 * into main.js.
 */
export const THAKSA_BIRTH_DAY_CUTOFF = Object.freeze({
  timezone: 'Asia/Bangkok',
  cutoffHour: 6,
  cutoffMinute: 0,
  beforeCutoff: 'previous-calendar-day',
  atOrAfterCutoff: 'entered-calendar-day',
  examples: Object.freeze([
    { localTime: '05:59', calendarDate: '14 October', effectiveDate: '13 October' },
    { localTime: '06:00', calendarDate: '14 October', effectiveDate: '14 October' },
    { localTime: '06:01', calendarDate: '14 October', effectiveDate: '14 October' },
  ]),
});

/**
 * Age-yang / taklang notes:
 * - Determine the effective weekday first using THAKSA_BIRTH_DAY_CUTOFF.
 * - The traditional age-yang count is described in some manuals as moving
 *   clockwise through the Thaksa chart, with the central cell (9/Ketu)
 *   passed through between 1/Sun and 2/Moon.
 * - Some manuals specify Jupiter (5) as the moving "บริวาร" when the count
 *   lands exactly on the central cell. Do not implement this as universal
 *   until the selected manual/source is recorded and cross-checked.
 */
export const AGE_YANG_REFERENCE = Object.freeze({
  countDirection: 'clockwise',
  centralCellInterposedBetween: Object.freeze([1, 2]),
  exactCenterRule: 'source-specific; some manuals assign Jupiter (5) as บริวารจร',
  implementationStatus: 'reference-only; not connected to runtime',
});

/**
 * Naming reference:
 * Letter-to-Thaksa assignments are weekday-dependent and should be stored as
 * a separately verified table once the project selects its authoritative
 * Thai reference. This file deliberately does not invent a universal mapping.
 */
export const THAKSA_NAMING_REFERENCE = Object.freeze({
  basis: 'effective weekday after applying the 06:00 birth-day cutoff',
  groups: Object.freeze([
    'บริวาร', 'อายุ', 'เดช', 'ศรี',
    'มูละ', 'อุตสาหะ', 'มนตรี', 'กาลกิณี',
  ]),
  letterMappingsStatus: 'not populated; requires source-specific verification',
});

/**
 * Thaksa-char (ทักษาจร): age-based movement through the 9-cell chart.
 * The cycle order below follows the cited public explanation; verify against
 * the project's chosen Thai manual before using it to produce predictions.
 * Count from the birth-day planet as cell 1, pass through center 9 as cell 2,
 * then continue around the outer cells: 2, 3, 4, 7, 5, 8, 6, and repeat.
 * The cell reached is used as บริวารจร; set up the eight Thaksa positions
 * from that moving point according to the selected chart convention.
 */
export const THAKSA_CHAR_REFERENCE = Object.freeze({
  name: 'ทักษาจร / เสวยทักษา',
  countingPath: Object.freeze([1, 9, 2, 3, 4, 7, 5, 8, 6]),
  firstCell: 'birth-weekday planet',
  reachedCellRole: 'บริวารจร',
  ruleStatus: 'reference-only; confirm exact age counting and boundary convention',
  sourceUrls: Object.freeze([
    'https://vibhishana.com/library/thaksa-chorn',
  ]),
});

/**
 * Mahathaksa / planetary age periods (มหาทักษาเสวยอายุ).
 * This is distinct from the 8-position Thaksa chart and from Thaksa-char.
 * Each major planet occupies a period equal to its traditionalกำลัง; the
 * periods sum to 108 years. The inner/intervening planet is calculated as
 * major-period-years × sub-period-planet-years / 108.
 */
export const MAHA_THakSA_PLANETS = Object.freeze([
  { planet: 'อาทิตย์', number: 1, years: 6, weekday: 'อาทิตย์' },
  { planet: 'จันทร์', number: 2, years: 15, weekday: 'จันทร์' },
  { planet: 'อังคาร', number: 3, years: 8, weekday: 'อังคาร' },
  { planet: 'พุธ', number: 4, years: 17, weekday: 'พุธกลางวัน' },
  { planet: 'เสาร์', number: 7, years: 10, weekday: 'เสาร์' },
  { planet: 'พฤหัสบดี', number: 5, years: 19, weekday: 'พฤหัสบดี' },
  { planet: 'ราหู', number: 8, years: 12, weekday: 'พุธกลางคืน' },
  { planet: 'ศุกร์', number: 6, years: 21, weekday: 'ศุกร์' },
]);

export const MAHA_THakSA_REFERENCE = Object.freeze({
  name: 'มหาทักษา / ดาวเสวยอายุและดาวแทรก',
  cycleOrder: Object.freeze([1, 2, 3, 4, 7, 5, 8, 6]),
  totalCycleYears: 108,
  subPeriodFormula: '(majorPlanetYears * subPlanetYears) / 108',
  ageBasis: 'completed age including years, months, and days; confirm exact manual',
  startPlanetBasis: 'planet assigned to effective weekday; Wednesday night uses Rahu',
  sourceUrls: Object.freeze([
    'https://horasatthai.com/horasat/maha-taksa',
    'https://www.astroneemo.net/articles.html',
  ]),
  implementationStatus: 'reference-only; not connected to runtime',
});

export const THAKSA_REFERENCE_METADATA = Object.freeze({
  version: '1.1.0-reference-only',
  runtimeIntegrated: false,
  mainJsImportRequired: false,
});

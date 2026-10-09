/**
 * HORA Astrology — 12-house reference data
 * Version: 1.0.0-reference-only
 *
 * House 1 (Tanu) begins at the natal ascendant sign.
 * Houses proceed through zodiac signs in order, wrapping after Pisces.
 *
 * IMPORTANT:
 * - This module is reference data only; it is not wired into the runtime.
 * - It does not calculate the ascendant or planetary positions.
 * - It assumes whole-sign house mapping: the ascendant's sign is house 1.
 * - Do not change any planetary calculation formulas when integrating this file.
 */

export const ASTROLOGICAL_HOUSES_VERSION = '1.0.0-reference-only';

export const ZODIAC_SIGNS = Object.freeze([
  'เมษ',
  'พฤษภ',
  'มิถุน',
  'กรกฎ',
  'สิงห์',
  'กันย์',
  'ตุล',
  'พิจิก',
  'ธนู',
  'มกร',
  'กุมภ์',
  'มีน',
]);

export const HOUSE_DEFINITIONS = Object.freeze([
  { house: 1, name: 'ตนุ', aliases: [], coreTopics: ['ตัวตน', 'รูปร่าง', 'บุคลิก', 'พื้นฐานชีวิต'] },
  { house: 2, name: 'กดุมภะ', aliases: ['กฎุมภะ', 'กฎุมพะ'], coreTopics: ['ทรัพย์สิน', 'รายได้', 'การเงิน', 'คำพูด'] },
  { house: 3, name: 'สหัชชะ', aliases: ['สหัชชะ', 'สหัสชะ', 'สหัชชะ'], coreTopics: ['พี่น้อง', 'การสื่อสาร', 'ความกล้า', 'การเดินทางใกล้'] },
  { house: 4, name: 'พันธุ', aliases: [], coreTopics: ['บ้าน', 'ครอบครัว', 'รากฐาน', 'ที่อยู่อาศัย'] },
  { house: 5, name: 'ปุตตะ', aliases: [], coreTopics: ['บุตร', 'บริวาร', 'ความคิดสร้างสรรค์', 'ผลงาน'] },
  { house: 6, name: 'อริ', aliases: [], coreTopics: ['อุปสรรค', 'หนี้สิน', 'คู่แข่ง', 'ภาระและโรคภัย'] },
  { house: 7, name: 'ปัตนิ', aliases: ['ปัตนิ'], coreTopics: ['คู่ครอง', 'หุ้นส่วน', 'คู่สัญญา', 'ความสัมพันธ์แบบหนึ่งต่อหนึ่ง'] },
  { house: 8, name: 'มรณะ', aliases: [], coreTopics: ['การเปลี่ยนแปลง', 'วิกฤต', 'มรดก', 'ทรัพย์สินร่วม'] },
  { house: 9, name: 'ศุภะ', aliases: ['สุภะ'], coreTopics: ['ครู', 'ความรู้ขั้นสูง', 'ความเชื่อ', 'การเดินทางไกล'] },
  { house: 10, name: 'กัมมะ', aliases: ['กรรมะ'], coreTopics: ['การงาน', 'อาชีพ', 'หน้าที่', 'สถานะสังคม'] },
  { house: 11, name: 'ลาภะ', aliases: [], coreTopics: ['ผลประโยชน์', 'กำไร', 'เครือข่าย', 'ความปรารถนา'] },
  { house: 12, name: 'วินาศ', aliases: ['วินาศะ', 'วินาสน์'], coreTopics: ['รายจ่าย', 'เรื่องเบื้องหลัง', 'การสูญเสีย', 'การปลีกตัว'] },
]);

const normalizeSign = (sign) => {
  if (typeof sign !== 'string') return null;
  const value = sign.trim();
  return ZODIAC_SIGNS.includes(value) ? value : null;
};

/**
 * Return all 12 whole-sign houses starting from the natal ascendant sign.
 * Each item contains the house number/name and its corresponding zodiac sign.
 * Returns null if the ascendant sign is not one of the canonical Thai sign names.
 */
export function getHousesFromAscendant(ascendantSign) {
  const ascSign = normalizeSign(ascendantSign);
  if (!ascSign) return null;

  const startIndex = ZODIAC_SIGNS.indexOf(ascSign);
  return HOUSE_DEFINITIONS.map((definition, index) => ({
    ...definition,
    sign: ZODIAC_SIGNS[(startIndex + index) % ZODIAC_SIGNS.length],
  }));
}

/**
 * Return the house number for a canonical Thai zodiac sign,
 * given the natal ascendant sign. Returns null for invalid signs.
 */
export function getHouseNumberForSign(ascendantSign, targetSign) {
  const ascSign = normalizeSign(ascendantSign);
  const sign = normalizeSign(targetSign);
  if (!ascSign || !sign) return null;

  return ((ZODIAC_SIGNS.indexOf(sign) - ZODIAC_SIGNS.indexOf(ascSign) + 12) % 12) + 1;
}

/**
 * Return the canonical house definition for a house number (1–12).
 * Returns null for invalid house numbers.
 */
export function getHouseDefinition(houseNumber) {
  if (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 12) return null;
  return HOUSE_DEFINITIONS[houseNumber - 1];
}

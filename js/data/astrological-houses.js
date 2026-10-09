/**
 * HORA Astrology — 12-house reference data
 * Version: 1.1.0-reference-with-meanings
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

export const ASTROLOGICAL_HOUSES_VERSION = '1.1.0-reference-with-meanings';

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
  { house: 1, name: 'ตนุ', aliases: [], meaning: 'ตัวเจ้าชะตาโดยตรง รูปร่าง หน้าตา บุคลิก อุปนิสัย สุขภาพพื้นฐาน ความเป็นอยู่ และแนวทางชีวิต', coreTopics: ['ตัวตน', 'รูปร่าง', 'บุคลิก', 'สุขภาพ', 'พื้นฐานชีวิต'] },
  { house: 2, name: 'กดุมภะ', aliases: ['กฎุมภะ', 'กฎุมพะ', 'กุฎุมพะ'], meaning: 'ทรัพย์สิน เงินทอง รายได้ที่หาได้และสะสมไว้ การกินอยู่ ครอบครัวใกล้ชิด และวาจาหรือคำพูด', coreTopics: ['ทรัพย์สิน', 'รายได้', 'เงินสะสม', 'ครอบครัวใกล้ชิด', 'คำพูด'] },
  { house: 3, name: 'สหัชชะ', aliases: ['สหัสชะ', 'สหัชชะ'], meaning: 'พี่น้อง เพื่อนบ้าน คนใกล้ตัว การติดต่อสื่อสาร ข่าวสาร เอกสาร ความกล้าลงมือ และการเดินทางระยะใกล้', coreTopics: ['พี่น้อง', 'เพื่อนใกล้ตัว', 'การสื่อสาร', 'เอกสาร', 'ความกล้า', 'การเดินทางใกล้'] },
  { house: 4, name: 'พันธุ', aliases: [], meaning: 'บ้าน ที่อยู่อาศัย ที่ดิน อสังหาริมทรัพย์ ครอบครัว รากเหง้า ญาติผู้ใหญ่ ความมั่นคงภายใน และความเป็นส่วนตัว', coreTopics: ['บ้าน', 'ที่ดิน', 'ครอบครัว', 'รากเหง้า', 'ความมั่นคงใจ'] },
  { house: 5, name: 'ปุตตะ', aliases: [], meaning: 'บุตรธิดา ลูกหลาน ผู้ใต้การดูแล ความรักแบบเสน่หา ความคิดสร้างสรรค์ การเรียนรู้ ความสามารถเฉพาะตัว และการเสี่ยงหรือเก็งกำไรตามแนวตำรา', coreTopics: ['บุตร', 'บริวาร', 'ความรัก', 'การเรียนรู้', 'ความคิดสร้างสรรค์', 'การเสี่ยงโชค'] },
  { house: 6, name: 'อริ', aliases: [], meaning: 'อุปสรรค ศัตรูหรือคู่แข่ง หนี้สิน คดีข้อพิพาท โรคภัย ภาระงานประจำ การรับใช้ และเรื่องที่ต้องใช้ความพยายามแก้ไข', coreTopics: ['อุปสรรค', 'ศัตรู', 'คู่แข่ง', 'หนี้สิน', 'คดีความ', 'โรคภัย', 'ภาระงาน'] },
  { house: 7, name: 'ปัตนิ', aliases: [], meaning: 'คู่ครอง คู่สมรส คนรักในฐานะคู่สัมพันธ์ หุ้นส่วน ลูกค้า คู่สัญญา การร่วมมือแบบหนึ่งต่อหนึ่ง และฝ่ายตรงข้ามที่เปิดเผย', coreTopics: ['คู่ครอง', 'คู่สัมพันธ์', 'หุ้นส่วน', 'ลูกค้า', 'คู่สัญญา', 'ฝ่ายตรงข้าม'] },
  { house: 8, name: 'มรณะ', aliases: [], meaning: 'การสิ้นสุดและเปลี่ยนแปลงครั้งสำคัญ การสูญเสีย มรดก พินัยกรรม เงินหรือทรัพย์สินที่เกี่ยวข้องกับผู้อื่น หนี้ภาษี วิกฤต และเรื่องที่ซ่อนลึก', coreTopics: ['การเปลี่ยนแปลง', 'การสูญเสีย', 'มรดก', 'พินัยกรรม', 'ทรัพย์สินร่วม', 'วิกฤต'] },
  { house: 9, name: 'ศุภะ', aliases: ['สุภะ'], meaning: 'ครู อาจารย์ ผู้ชี้แนะ บิดาตามบางแนวตำรา ศีลธรรม ความเชื่อ ศาสนา ปรัชญา การศึกษาระดับสูง โชคเกื้อหนุน และการเดินทางไกลหรือต่างประเทศ', coreTopics: ['ครู', 'ผู้ใหญ่', 'ความเชื่อ', 'ศาสนา', 'การศึกษาสูง', 'โชคเกื้อหนุน', 'เดินทางไกล'] },
  { house: 10, name: 'กัมมะ', aliases: ['กรรมะ'], meaning: 'การงาน อาชีพ หน้าที่ ความรับผิดชอบ กิจการ การลงมือทำ ตำแหน่ง เกียรติยศ ชื่อเสียง และบทบาทที่ปรากฏต่อสังคม', coreTopics: ['การงาน', 'อาชีพ', 'กิจการ', 'หน้าที่', 'ตำแหน่ง', 'ชื่อเสียง'] },
  { house: 11, name: 'ลาภะ', aliases: [], meaning: 'ลาภผล กำไร รายได้เสริม ผลตอบแทนจากความพยายาม ความช่วยเหลือจากมิตรหรือเครือข่าย กลุ่มสังคม ผู้สนับสนุน และความหวังที่ต้องการให้สำเร็จ', coreTopics: ['ลาภผล', 'กำไร', 'รายได้เสริม', 'เพื่อน', 'เครือข่าย', 'ผู้สนับสนุน', 'ความหวัง'] },
  { house: 12, name: 'วินาศ', aliases: ['วินาศะ', 'วินาสน์'], meaning: 'รายจ่ายและสิ่งที่รั่วไหล การสูญเสีย เรื่องลับหรือเบื้องหลัง การพลัดพราก การจำกัดอิสรภาพ การอยู่ห่างไกล ต่างแดน การพักฟื้น และการปลีกตัว', coreTopics: ['รายจ่าย', 'การสูญเสีย', 'เรื่องลับ', 'เบื้องหลัง', 'ต่างแดน', 'การพักฟื้น', 'การปลีกตัว'] },
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

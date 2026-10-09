/**
 * HORA Astrology — Planetary Dignity Reference Data
 * -------------------------------------------------
 * แยกข้อมูลมาตรฐานดาวออกจาก main.js เพื่อให้ตรวจสอบ/ขยายข้อมูลได้เป็นอิสระ
 *
 * ขอบเขตเวอร์ชัน 1:
 * - runtime classification ที่เปิดใช้แล้ว: เกษตร, อุจจ์, นิจ
 * - องศาอุจจ์/นิจ และมูลตรีโกณเก็บเป็นข้อมูลอ้างอิงเท่านั้น ยังไม่เปลี่ยนผลแสดงผล
 * - ราหู เกตุ มฤตยู: ไม่กำหนดเกษตร/อุจจ์/นิจในชุดนี้ เพราะหลักเกณฑ์แตกต่างกันตามตำรา
 * - ประ, มหาจักร, ราชาโชค, เทวีโชค, จุลจักร และมาตรฐานอื่น ๆ ยังไม่เปิดใช้
 *   จนกว่าจะกำหนดตำรา/เงื่อนไขที่ HORA ยึดถืออย่างชัดเจน
 *
 * Coordinate convention:
 * - signIndex: เมษ=0, พฤษภ=1, มิถุน=2, กรกฎ=3, สิงห์=4, กันย์=5,
 *   ตุล=6, พิจิก=7, ธนู=8, มกร=9, กุมภ์=10, มีน=11
 * - degreeInSign ใช้ช่วง 0 ถึงน้อยกว่า 30 องศา
 * - exaltation/debilitation exact degrees เป็นข้อมูลตามชุดเกณฑ์ดั้งเดิมที่ใช้กันทั่วไป
 *   ควรยืนยันกับตำราเฉพาะของโครงการก่อนนำไปคำนวณคะแนนหรือคำทำนาย
 */

export const DIGNITY_DATA_VERSION = '1.0.0-reference-only';

export const ZODIAC_SIGNS = Object.freeze([
  { index: 0, name: 'เมษ', english: 'Aries', element: 'ไฟ' },
  { index: 1, name: 'พฤษภ', english: 'Taurus', element: 'ดิน' },
  { index: 2, name: 'มิถุน', english: 'Gemini', element: 'ลม' },
  { index: 3, name: 'กรกฎ', english: 'Cancer', element: 'น้ำ' },
  { index: 4, name: 'สิงห์', english: 'Leo', element: 'ไฟ' },
  { index: 5, name: 'กันย์', english: 'Virgo', element: 'ดิน' },
  { index: 6, name: 'ตุล', english: 'Libra', element: 'ลม' },
  { index: 7, name: 'พิจิก', english: 'Scorpio', element: 'น้ำ' },
  { index: 8, name: 'ธนู', english: 'Sagittarius', element: 'ไฟ' },
  { index: 9, name: 'มกร', english: 'Capricorn', element: 'ดิน' },
  { index: 10, name: 'กุมภ์', english: 'Aquarius', element: 'ลม' },
  { index: 11, name: 'มีน', english: 'Pisces', element: 'น้ำ' }
]);

/**
 * ข้อมูลรายดาว:
 * domicileSigns ใช้ตรวจเกษตรใน runtime ปัจจุบัน
 * exaltation/debilitation เก็บทั้งราศีและองศา แต่ runtime ปัจจุบันตรวจเฉพาะราศี
 * moolatrikona เป็นข้อมูลอ้างอิง ไม่ได้นำมารวมเป็นเกษตรโดยอัตโนมัติ
 */
export const PLANETARY_DIGNITY_DATA = Object.freeze({
  อาทิตย์: {
    planet: 'อาทิตย์',
    planetNumber: '๑',
    system: 'classical-seven',
    domicileSigns: ['สิงห์'],
    exaltation: { sign: 'เมษ', signIndex: 0, degreeInSign: 10 },
    debilitation: { sign: 'ตุล', signIndex: 6, degreeInSign: 10 },
    moolatrikona: { sign: 'สิงห์', signIndex: 4, fromDegree: 0, toDegreeExclusive: 20 },
    dignityPolicy: 'classical-reference',
    notes: 'การแสดงอุจจ์/นิจใน runtime ปัจจุบันพิจารณาราศี ไม่ได้พิจารณาองศาเฉพาะ'
  },
  จันทร์: {
    planet: 'จันทร์',
    planetNumber: '๒',
    system: 'classical-seven',
    domicileSigns: ['กรกฎ'],
    exaltation: { sign: 'พฤษภ', signIndex: 1, degreeInSign: 3 },
    debilitation: { sign: 'พิจิก', signIndex: 7, degreeInSign: 3 },
    moolatrikona: { sign: 'พฤษภ', signIndex: 1, fromDegree: 4, toDegreeExclusive: 30 },
    dignityPolicy: 'classical-reference',
    notes: 'ข้อมูลนี้เป็นเกณฑ์สถานะดาว ไม่เปลี่ยนสูตรคำนวณลองจิจูดของจันทร์'
  },
  อังคาร: {
    planet: 'อังคาร',
    planetNumber: '๓',
    system: 'classical-seven',
    domicileSigns: ['เมษ', 'พิจิก'],
    exaltation: { sign: 'มกร', signIndex: 9, degreeInSign: 28 },
    debilitation: { sign: 'กรกฎ', signIndex: 3, degreeInSign: 28 },
    moolatrikona: { sign: 'เมษ', signIndex: 0, fromDegree: 0, toDegreeExclusive: 12 },
    dignityPolicy: 'classical-reference'
  },
  พุธ: {
    planet: 'พุธ',
    planetNumber: '๔',
    system: 'classical-seven',
    domicileSigns: ['มิถุน', 'กันย์'],
    exaltation: { sign: 'กันย์', signIndex: 5, degreeInSign: 15 },
    debilitation: { sign: 'มีน', signIndex: 11, degreeInSign: 15 },
    moolatrikona: { sign: 'กันย์', signIndex: 5, fromDegree: 16, toDegreeExclusive: 20 },
    dignityPolicy: 'classical-reference',
    notes: 'องศาอุจจ์/นิจและช่วงมูลตรีโกณอาจระบุแตกต่างกันในบางสำนัก'
  },
  พฤหัสบดี: {
    planet: 'พฤหัสบดี',
    planetNumber: '๕',
    system: 'classical-seven',
    domicileSigns: ['ธนู', 'มีน'],
    exaltation: { sign: 'กรกฎ', signIndex: 3, degreeInSign: 5 },
    debilitation: { sign: 'มกร', signIndex: 9, degreeInSign: 5 },
    moolatrikona: { sign: 'ธนู', signIndex: 8, fromDegree: 0, toDegreeExclusive: 10 },
    dignityPolicy: 'classical-reference'
  },
  ศุกร์: {
    planet: 'ศุกร์',
    planetNumber: '๖',
    system: 'classical-seven',
    domicileSigns: ['พฤษภ', 'ตุล'],
    exaltation: { sign: 'มีน', signIndex: 11, degreeInSign: 27 },
    debilitation: { sign: 'กันย์', signIndex: 5, degreeInSign: 27 },
    moolatrikona: { sign: 'ตุล', signIndex: 6, fromDegree: 0, toDegreeExclusive: 15 },
    dignityPolicy: 'classical-reference'
  },
  เสาร์: {
    planet: 'เสาร์',
    planetNumber: '๗',
    system: 'classical-seven',
    domicileSigns: ['มกร', 'กุมภ์'],
    exaltation: { sign: 'ตุล', signIndex: 6, degreeInSign: 20 },
    debilitation: { sign: 'เมษ', signIndex: 0, degreeInSign: 20 },
    moolatrikona: { sign: 'กุมภ์', signIndex: 10, fromDegree: 0, toDegreeExclusive: 20 },
    dignityPolicy: 'classical-reference'
  },
  ราหู: {
    planet: 'ราหู',
    planetNumber: '๘',
    system: 'tradition-dependent',
    domicileSigns: [],
    exaltation: null,
    debilitation: null,
    moolatrikona: null,
    dignityPolicy: 'not-configured',
    notes: 'ห้ามอนุมานตำแหน่งเกษตร/อุจจ์/นิจจนกว่าจะเลือกสำนักและระบุหลักเกณฑ์'
  },
  เกตุ: {
    planet: 'เกตุ',
    planetNumber: '๙',
    system: 'tradition-dependent',
    domicileSigns: [],
    exaltation: null,
    debilitation: null,
    moolatrikona: null,
    dignityPolicy: 'not-configured',
    notes: 'แยกจากราหูโดยชัดเจน ไม่ใช้ตำแหน่งราหูแทนโดยอัตโนมัติ'
  },
  มฤตยู: {
    planet: 'มฤตยู',
    planetNumber: '๐',
    system: 'modern-or-tradition-dependent',
    domicileSigns: [],
    exaltation: null,
    debilitation: null,
    moolatrikona: null,
    dignityPolicy: 'not-configured',
    notes: 'ไม่กำหนดเกษตร/อุจจ์/นิจในชุดเกณฑ์ดาวคลาสสิกนี้'
  }
});

export const ADDITIONAL_DIGNITY_RULES = Object.freeze({
  เกษตร: {
    id: 'domicile',
    description: 'ดาวอยู่ในราศีเจ้าของดาวตาม domicileSigns',
    runtimeEnabled: true
  },
  อุจจ์: {
    id: 'exaltation',
    description: 'ชุด runtime ปัจจุบันตรวจราศีอุจจ์ ยังไม่บังคับองศาอุจจ์เฉพาะ',
    runtimeEnabled: true
  },
  นิจ: {
    id: 'debilitation',
    description: 'ชุด runtime ปัจจุบันตรวจราศีนิจ ยังไม่บังคับองศานิจเฉพาะ',
    runtimeEnabled: true
  },
  ประ: {
    id: 'detriment-or-system-specific',
    description: 'ยังไม่เปิดใช้: ต้องยืนยันนิยามและตารางราศีจากตำราที่โครงการเลือก',
    runtimeEnabled: false
  },
  มหาจักร: {
    id: 'mahachakra',
    description: 'ยังไม่เปิดใช้: ต้องระบุเกณฑ์เฉพาะของสำนัก',
    runtimeEnabled: false
  },
  ราชาโชค: {
    id: 'raja-yoga-or-raja-chok',
    description: 'ยังไม่เปิดใช้: ต้องระบุเกณฑ์เฉพาะของสำนัก',
    runtimeEnabled: false
  },
  เทวีโชค: {
    id: 'devi-chok',
    description: 'ยังไม่เปิดใช้: ต้องระบุเกณฑ์เฉพาะของสำนัก',
    runtimeEnabled: false
  },
  จุลจักร: {
    id: 'chula-chak',
    description: 'ยังไม่เปิดใช้: ต้องระบุเกณฑ์เฉพาะของสำนัก',
    runtimeEnabled: false
  },
  มูลตรีโกณ: {
    id: 'moolatrikona',
    description: 'เก็บราศีและช่วงองศาเป็นข้อมูลอ้างอิง แต่ยังไม่รวมในผล runtime',
    runtimeEnabled: false
  }
});

/** คืนรายการสถานะที่ runtime ปัจจุบันใช้ โดยรักษาพฤติกรรมเดิมของ main.js */
export function getPlanetaryDignities(planetName, signName) {
  const data = PLANETARY_DIGNITY_DATA[planetName];
  if (!data) return [];
  const result = [];
  if (data.domicileSigns.includes(signName)) result.push('เกษตร');
  if (data.exaltation?.sign === signName) result.push('อุจจ์');
  if (data.debilitation?.sign === signName) result.push('นิจ');
  return result;
}

/** คืนระเบียนอ้างอิงของดาว; ไม่มีระเบียนจะได้ null */
export function getPlanetaryDignityRecord(planetName) {
  return PLANETARY_DIGNITY_DATA[planetName] ?? null;
}

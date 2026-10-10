/**
 * HORA Astrology — Planetary Dignity Reference Data
 * -------------------------------------------------
 * แยกข้อมูลมาตรฐานดาวออกจาก main.js เพื่อให้ตรวจสอบ/ขยายข้อมูลได้เป็นอิสระ
 *
 * ขอบเขต runtime:
 * - เกณฑ์ที่ผู้ใช้ยืนยันแล้วจากราศี องศาเฉพาะ และช่วงมูลตรีโกณ ถูกใช้แสดงในตารางดาวกำเนิด/ดาวจร
 * - เกณฑ์ที่ยังเป็นข้อมูลค้นคว้าแสดงแยกเป็นป้ายอ้างอิง·รอยืนยัน ไม่ปะปนกับผลยืนยัน
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

export const DIGNITY_DATA_VERSION = '1.2.0-confirmed-standards-runtime';

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

/**
 * กฎจาก data/astrology/planetary_dignities.json ที่เชื่อมเข้ามาเพื่อแสดงในคอลัมน์
 * ข้อมูลชุดนี้ยังเป็น DISCOVERY จึงต้องติดป้ายรอยืนยันเสมอ ไม่ใช้เป็นผลยืนยัน
 * และไม่ปะปนกับผลมาตรฐาน runtime ที่เปิดใช้แล้ว
 */
export const PLANETARY_DIGNITY_REFERENCE_RULES = Object.freeze([
  {
    "id": "DIGNITY-KASET-SUN-LEO",
    "planet": "อาทิตย์",
    "sign": "สิงห์",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-MOON-CANCER",
    "planet": "จันทร์",
    "sign": "กรกฎ",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-MARS-ARIES",
    "planet": "อังคาร",
    "sign": "เมษ",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-MARS-SCORPIO",
    "planet": "อังคาร",
    "sign": "พิจิก",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-MERCURY-GEMINI",
    "planet": "พุธ",
    "sign": "มิถุน",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-MERCURY-VIRGO",
    "planet": "พุธ",
    "sign": "กันย์",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-JUPITER-SAGITTARIUS",
    "planet": "พฤหัสบดี",
    "sign": "ธนู",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-JUPITER-PISCES",
    "planet": "พฤหัสบดี",
    "sign": "มีน",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-VENUS-TAURUS",
    "planet": "ศุกร์",
    "sign": "พฤษภ",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-VENUS-LIBRA",
    "planet": "ศุกร์",
    "sign": "ตุล",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-SATURN-CAPRICORN",
    "planet": "เสาร์",
    "sign": "มกร",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-KASET-RAHU-AQUARIUS",
    "planet": "ราหู",
    "sign": "กุมภ์",
    "category": "เกษตร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-SUN-AQUARIUS",
    "planet": "อาทิตย์",
    "sign": "กุมภ์",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-MOON-CAPRICORN",
    "planet": "จันทร์",
    "sign": "มกร",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-MARS-LIBRA",
    "planet": "อังคาร",
    "sign": "ตุล",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-MARS-TAURUS",
    "planet": "อังคาร",
    "sign": "พฤษภ",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-MERCURY-SAGITTARIUS",
    "planet": "พุธ",
    "sign": "ธนู",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-MERCURY-PISCES",
    "planet": "พุธ",
    "sign": "มีน",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-JUPITER-GEMINI",
    "planet": "พฤหัสบดี",
    "sign": "มิถุน",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-JUPITER-VIRGO",
    "planet": "พฤหัสบดี",
    "sign": "กันย์",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-VENUS-SCORPIO",
    "planet": "ศุกร์",
    "sign": "พิจิก",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-VENUS-ARIES",
    "planet": "ศุกร์",
    "sign": "เมษ",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-SATURN-CANCER",
    "planet": "เสาร์",
    "sign": "กรกฎ",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-PRA-RAHU-LEO",
    "planet": "ราหู",
    "sign": "สิงห์",
    "category": "ประ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-SUN-ARIES",
    "planet": "อาทิตย์",
    "sign": "เมษ",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-MOON-TAURUS",
    "planet": "จันทร์",
    "sign": "พฤษภ",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-MARS-CAPRICORN",
    "planet": "อังคาร",
    "sign": "มกร",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-MERCURY-VIRGO",
    "planet": "พุธ",
    "sign": "กันย์",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-JUPITER-CANCER",
    "planet": "พฤหัสบดี",
    "sign": "กรกฎ",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-VENUS-PISCES",
    "planet": "ศุกร์",
    "sign": "มีน",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-SATURN-LIBRA",
    "planet": "เสาร์",
    "sign": "ตุล",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCH-RAHU-SCORPIO",
    "planet": "ราหู",
    "sign": "พิจิก",
    "category": "อุจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-SUN-LIBRA",
    "planet": "อาทิตย์",
    "sign": "ตุล",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-MOON-SCORPIO",
    "planet": "จันทร์",
    "sign": "พิจิก",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-MARS-CANCER",
    "planet": "อังคาร",
    "sign": "กรกฎ",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-MERCURY-PISCES",
    "planet": "พุธ",
    "sign": "มีน",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-JUPITER-CAPRICORN",
    "planet": "พฤหัสบดี",
    "sign": "มกร",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-VENUS-VIRGO",
    "planet": "ศุกร์",
    "sign": "กันย์",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-SATURN-ARIES",
    "planet": "เสาร์",
    "sign": "เมษ",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-NICH-RAHU-TAURUS",
    "planet": "ราหู",
    "sign": "พฤษภ",
    "category": "นิจ",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-SUN-GEMINI",
    "planet": "อาทิตย์",
    "sign": "มิถุน",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-MOON-VIRGO",
    "planet": "จันทร์",
    "sign": "กันย์",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-MARS-TAURUS",
    "planet": "อังคาร",
    "sign": "พฤษภ",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-MERCURY-LEO",
    "planet": "พุธ",
    "sign": "สิงห์",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-JUPITER-ARIES",
    "planet": "พฤหัสบดี",
    "sign": "เมษ",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-VENUS-CANCER",
    "planet": "ศุกร์",
    "sign": "กรกฎ",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-SATURN-SCORPIO",
    "planet": "เสาร์",
    "sign": "พิจิก",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-RACHA-CHOK-RAHU-LIBRA",
    "planet": "ราหู",
    "sign": "ตุล",
    "category": "ราชาโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-SUN-CANCER",
    "planet": "อาทิตย์",
    "sign": "กรกฎ",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-MOON-ARIES",
    "planet": "จันทร์",
    "sign": "เมษ",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-MARS-VIRGO",
    "planet": "อังคาร",
    "sign": "กันย์",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-MERCURY-LEO",
    "planet": "พุธ",
    "sign": "สิงห์",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-JUPITER-SCORPIO",
    "planet": "พฤหัสบดี",
    "sign": "พิจิก",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-VENUS-SAGITTARIUS",
    "planet": "ศุกร์",
    "sign": "ธนู",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-SATURN-TAURUS",
    "planet": "เสาร์",
    "sign": "พฤษภ",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-MAHA-CHAK-RAHU-CAPRICORN",
    "planet": "ราหู",
    "sign": "มกร",
    "category": "มหาจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-SUN-CAPRICORN",
    "planet": "อาทิตย์",
    "sign": "มกร",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-MOON-LIBRA",
    "planet": "จันทร์",
    "sign": "ตุล",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-MARS-PISCES",
    "planet": "อังคาร",
    "sign": "มีน",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-MERCURY-AQUARIUS",
    "planet": "พุธ",
    "sign": "กุมภ์",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-JUPITER-TAURUS",
    "planet": "พฤหัสบดี",
    "sign": "พฤษภ",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-VENUS-GEMINI",
    "planet": "ศุกร์",
    "sign": "มิถุน",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-SATURN-SCORPIO",
    "planet": "เสาร์",
    "sign": "พิจิก",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-CHULA-CHAK-RAHU-CANCER",
    "planet": "ราหู",
    "sign": "กรกฎ",
    "category": "จุลจักร",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-SUN-TAURUS",
    "planet": "อาทิตย์",
    "sign": "พฤษภ",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-MOON-GEMINI",
    "planet": "จันทร์",
    "sign": "มิถุน",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-MARS-AQUARIUS",
    "planet": "อังคาร",
    "sign": "กุมภ์",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-MERCURY-LIBRA",
    "planet": "พุธ",
    "sign": "ตุล",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-JUPITER-LEO",
    "planet": "พฤหัสบดี",
    "sign": "สิงห์",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-VENUS-ARIES",
    "planet": "ศุกร์",
    "sign": "เมษ",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-SATURN-SCORPIO",
    "planet": "เสาร์",
    "sign": "พิจิก",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-UCHCHA-ABHIMUK-RAHU-SAGITTARIUS",
    "planet": "ราหู",
    "sign": "ธนู",
    "category": "อุจจาภิมุข",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-SUN-SAGITTARIUS",
    "planet": "อาทิตย์",
    "sign": "ธนู",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-MOON-PISCES",
    "planet": "จันทร์",
    "sign": "มีน",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-MARS-SCORPIO",
    "planet": "อังคาร",
    "sign": "พิจิก",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-MERCURY-AQUARIUS",
    "planet": "พุธ",
    "sign": "กุมภ์",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-JUPITER-LIBRA",
    "planet": "พฤหัสบดี",
    "sign": "ตุล",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-VENUS-CAPRICORN",
    "planet": "ศุกร์",
    "sign": "มกร",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-SATURN-TAURUS",
    "planet": "เสาร์",
    "sign": "พฤษภ",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  },
  {
    "id": "DIGNITY-THEWI-CHOK-RAHU-ARIES",
    "planet": "ราหู",
    "sign": "เมษ",
    "category": "เทวีโชค",
    "status": "DISCOVERY",
    "source": "Anonymized project reference; verify against an approved standard."
  }
].map(rule => Object.freeze(rule)));

export function getPlanetaryDignityReferences(planetName, signName) {
  return PLANETARY_DIGNITY_REFERENCE_RULES
    .filter(rule => rule.planet === planetName && rule.sign === signName)
    .map(rule => rule.category)
    .filter((category, index, all) => all.indexOf(category) === index);
}

/** เกณฑ์มาตรฐานดาวที่ผู้ใช้ยืนยันแล้ว — ใช้เป็นกฎ runtime; ไม่คำนวณหรือแก้ตำแหน่งดาว */
export const CONFIRMED_PLANETARY_STANDARDS = Object.freeze({
  "schema_version": "1.0.0",
  "title": "HORA confirmed planetary standards",
  "language": "th",
  "status": "CONFIRMED_BY_USER",
  "runtime_status": "REFERENCE_ONLY_NOT_YET_CONNECTED_TO_RUNTIME",
  "notes": [
    "รายการนี้บันทึกเกณฑ์ที่ผู้ใช้ยืนยันแล้ว ห้ามเปลี่ยนสูตรคำนวณตำแหน่งดาว",
    "เครื่องหมาย - หมายถึงไม่มีเกณฑ์ที่ยืนยันไว้ในชุดนี้",
    "นิจทั่วไปตรวจจากราศีนิจ ไม่จำเป็นต้องตรงองศามหานิจ",
    "มหาอุจจ์และมหานิจมีองศาเฉพาะตามตาราง",
    "อุจจาวิลาสคำนวณจากราศีอุจจ์ถอยหลังหนึ่งราศีเต็ม"
  ],
  "signs_order": [
    "เมษ",
    "พฤษภ",
    "มิถุน",
    "กรกฎ",
    "สิงห์",
    "กันย์",
    "ตุล",
    "พิจิก",
    "ธนู",
    "มกร",
    "กุมภ์",
    "มีน"
  ],
  "planet_order": [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
    "ราหู",
    "เกตุ",
    "มฤตยู"
  ],
  "sign_based_rules": {
    "ประ": {
      "อาทิตย์": [
        "กุมภ์"
      ],
      "จันทร์": [
        "มกร"
      ],
      "อังคาร": [
        "ตุล",
        "พฤษภ"
      ],
      "พุธ": [
        "ธนู",
        "มีน"
      ],
      "พฤหัสบดี": [
        "มิถุน",
        "กันย์"
      ],
      "ศุกร์": [
        "พิจิก",
        "เมษ"
      ],
      "เสาร์": [
        "กรกฎ"
      ],
      "ราหู": [
        "สิงห์"
      ],
      "เกตุ": [],
      "มฤตยู": []
    },
    "ราชาโชค": {
      "อาทิตย์": [
        "มิถุน"
      ],
      "จันทร์": [
        "กันย์"
      ],
      "อังคาร": [
        "พฤษภ"
      ],
      "พุธ": [
        "สิงห์"
      ],
      "พฤหัสบดี": [
        "เมษ"
      ],
      "ศุกร์": [
        "กรกฎ"
      ],
      "เสาร์": [
        "พิจิก"
      ],
      "ราหู": [
        "ตุล"
      ],
      "เกตุ": [],
      "มฤตยู": []
    },
    "มหาจักร": {
      "อาทิตย์": [
        "กรกฎ"
      ],
      "จันทร์": [
        "เมษ"
      ],
      "อังคาร": [
        "กันย์"
      ],
      "พุธ": [
        "สิงห์"
      ],
      "พฤหัสบดี": [
        "พิจิก"
      ],
      "ศุกร์": [
        "ธนู"
      ],
      "เสาร์": [
        "พฤษภ"
      ],
      "ราหู": [
        "มกร"
      ],
      "เกตุ": [],
      "มฤตยู": []
    },
    "จุลจักร": {
      "อาทิตย์": [
        "มกร"
      ],
      "จันทร์": [
        "ตุล"
      ],
      "อังคาร": [
        "มีน"
      ],
      "พุธ": [
        "กุมภ์"
      ],
      "พฤหัสบดี": [
        "พฤษภ"
      ],
      "ศุกร์": [
        "มิถุน"
      ],
      "เสาร์": [
        "พิจิก"
      ],
      "ราหู": [
        "กรกฎ"
      ],
      "เกตุ": [],
      "มฤตยู": []
    },
    "เทวีโชค": {
      "อาทิตย์": [
        "ธนู"
      ],
      "จันทร์": [
        "มีน"
      ],
      "อังคาร": [
        "พิจิก"
      ],
      "พุธ": [
        "กุมภ์"
      ],
      "พฤหัสบดี": [
        "ตุล"
      ],
      "ศุกร์": [
        "มกร"
      ],
      "เสาร์": [
        "พฤษภ"
      ],
      "ราหู": [
        "เมษ"
      ],
      "เกตุ": [],
      "มฤตยู": []
    },
    "อุจจาภิมุข": {
      "อาทิตย์": [
        "พฤษภ"
      ],
      "จันทร์": [
        "มิถุน"
      ],
      "อังคาร": [
        "กุมภ์"
      ],
      "พุธ": [
        "ตุล"
      ],
      "พฤหัสบดี": [
        "สิงห์"
      ],
      "ศุกร์": [
        "เมษ"
      ],
      "เสาร์": [
        "พิจิก"
      ],
      "ราหู": [
        "ธนู"
      ],
      "เกตุ": [],
      "มฤตยู": []
    },
    "อุจจาวิลาส": {
      "อาทิตย์": [
        "มีน"
      ],
      "จันทร์": [
        "เมษ"
      ],
      "อังคาร": [
        "ธนู"
      ],
      "พุธ": [
        "สิงห์"
      ],
      "พฤหัสบดี": [
        "มิถุน"
      ],
      "ศุกร์": [
        "กุมภ์"
      ],
      "เสาร์": [
        "กันย์"
      ],
      "ราหู": [],
      "เกตุ": [],
      "มฤตยู": []
    },
    "อุจจ์": {
      "อาทิตย์": [
        "เมษ"
      ],
      "จันทร์": [
        "พฤษภ"
      ],
      "อังคาร": [
        "มกร"
      ],
      "พุธ": [
        "กันย์"
      ],
      "พฤหัสบดี": [
        "กรกฎ"
      ],
      "ศุกร์": [
        "มีน"
      ],
      "เสาร์": [
        "ตุล"
      ],
      "ราหู": [],
      "เกตุ": [],
      "มฤตยู": []
    },
    "นิจ": {
      "อาทิตย์": [
        "ตุล"
      ],
      "จันทร์": [
        "พิจิก"
      ],
      "อังคาร": [
        "กรกฎ"
      ],
      "พุธ": [
        "มีน"
      ],
      "พฤหัสบดี": [
        "มกร"
      ],
      "ศุกร์": [
        "กันย์"
      ],
      "เสาร์": [
        "เมษ"
      ],
      "ราหู": [],
      "เกตุ": [],
      "มฤตยู": []
    }
  },
  "exact_degree_rules": {
    "มหาอุจจ์": {
      "อาทิตย์": {
        "sign": "เมษ",
        "degree": 10
      },
      "จันทร์": {
        "sign": "พฤษภ",
        "degree": 3
      },
      "อังคาร": {
        "sign": "มกร",
        "degree": 28
      },
      "พุธ": {
        "sign": "กันย์",
        "degree": 15
      },
      "พฤหัสบดี": {
        "sign": "กรกฎ",
        "degree": 5
      },
      "ศุกร์": {
        "sign": "มีน",
        "degree": 27
      },
      "เสาร์": {
        "sign": "ตุล",
        "degree": 20
      },
      "ราหู": null,
      "เกตุ": null,
      "มฤตยู": null
    },
    "มหานิจ": {
      "อาทิตย์": {
        "sign": "ตุล",
        "degree": 10
      },
      "จันทร์": {
        "sign": "พิจิก",
        "degree": 3
      },
      "อังคาร": {
        "sign": "กรกฎ",
        "degree": 28
      },
      "พุธ": {
        "sign": "มีน",
        "degree": 15
      },
      "พฤหัสบดี": {
        "sign": "มกร",
        "degree": 5
      },
      "ศุกร์": {
        "sign": "กันย์",
        "degree": 27
      },
      "เสาร์": {
        "sign": "เมษ",
        "degree": 20
      },
      "ราหู": null,
      "เกตุ": null,
      "มฤตยู": null
    }
  },
  "sign_only_policies": {
    "นิจ": "ถือเป็นนิจเมื่ออยู่ในราศีนิจ ไม่จำเป็นต้องตรงองศามหานิจ",
    "อุจจ์": "ถือเป็นอุจจ์เมื่ออยู่ในราศีอุจจ์ ไม่จำเป็นต้องตรงองศามหาอุจจ์"
  },
  "moolatrikona": {
    "อาทิตย์": {
      "sign": "สิงห์",
      "from_degree_inclusive": 0,
      "to_degree_exclusive": 20
    },
    "จันทร์": {
      "sign": "พฤษภ",
      "from_degree_inclusive": 4,
      "to_degree_exclusive": 30
    },
    "อังคาร": {
      "sign": "เมษ",
      "from_degree_inclusive": 0,
      "to_degree_exclusive": 12
    },
    "พุธ": {
      "sign": "กันย์",
      "from_degree_inclusive": 16,
      "to_degree_exclusive": 20
    },
    "พฤหัสบดี": {
      "sign": "ธนู",
      "from_degree_inclusive": 0,
      "to_degree_exclusive": 10
    },
    "ศุกร์": {
      "sign": "ตุล",
      "from_degree_inclusive": 0,
      "to_degree_exclusive": 15
    },
    "เสาร์": {
      "sign": "กุมภ์",
      "from_degree_inclusive": 0,
      "to_degree_exclusive": 20
    },
    "ราหู": null,
    "เกตุ": null,
    "มฤตยู": null
  }
});

/**
 * ตรวจสถานะตามเกณฑ์ที่ยืนยันแล้วจากราศีและองศาภายในราศี (0 <= degree < 30).
 * คืนทุกสถานะที่เข้าเงื่อนไข และไม่สร้างเกณฑ์ให้ดาว/สถานะที่ระบุเป็น null หรือไม่มีรายการ
 */
export function getConfirmedPlanetaryStandards(planetName, signName, degreeInSign = null, minuteInSign = 0, secondInSign = 0) {
  const result = [];
  const rules = CONFIRMED_PLANETARY_STANDARDS.sign_based_rules || {};
  for (const [category, planets] of Object.entries(rules)) {
    if ((planets[planetName] || []).includes(signName)) result.push(category);
  }
  const exactPosition = degreeInSign === null || degreeInSign === undefined
    ? null : Number(degreeInSign) + Number(minuteInSign || 0) / 60 + Number(secondInSign || 0) / 3600;
  for (const [category, planets] of Object.entries(CONFIRMED_PLANETARY_STANDARDS.exact_degree_rules || {})) {
    const rule = planets[planetName];
    if (rule && rule.sign === signName && exactPosition !== null && Math.abs(exactPosition - rule.degree) < (0.5 / 3600)) result.push(category);
  }
  const mt = CONFIRMED_PLANETARY_STANDARDS.moolatrikona?.[planetName];
  if (mt && mt.sign === signName && exactPosition !== null && exactPosition >= mt.from_degree_inclusive && exactPosition < mt.to_degree_exclusive) result.push('มูลตรีโกณ');
  return [...new Set(result)];
}

/** คืนรายการสถานะที่ runtime ปัจจุบันใช้ โดยรักษาพฤติกรรมเดิมของ main.js */
export function getPlanetaryDignities(planetName, signName, degreeInSign = null, minuteInSign = 0, secondInSign = 0) {
  const data = PLANETARY_DIGNITY_DATA[planetName];
  const result = getConfirmedPlanetaryStandards(planetName, signName, degreeInSign, minuteInSign, secondInSign);
  // เกษตรคงใช้ข้อมูล runtime เดิม; ไม่อนุมานเกษตรของราหู/เกตุ/มฤตยู
  if (data && data.domicileSigns.includes(signName)) result.push('เกษตร');
  return [...new Set(result)];
}

/** คืนระเบียนอ้างอิงของดาว; ไม่มีระเบียนจะได้ null */
export function getPlanetaryDignityRecord(planetName) {
  return PLANETARY_DIGNITY_DATA[planetName] ?? null;
}

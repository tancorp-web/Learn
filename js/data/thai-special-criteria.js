/**
 * HORA Astrology — Thai special-criteria catalogue
 * Data/reference layer only. Does not modify chart calculations or auto-interpretation.
 * Statuses describe evidence within this project, not scientific validity.
 */

export const THAI_SPECIAL_CRITERIA_VERSION = '1.0.0-discovery';

export const CRITERION_STATUS = Object.freeze({
  REFERENCE_PROVISIONAL: 'REFERENCE_PROVISIONAL',
  DISCOVERY: 'DISCOVERY',
  NEEDS_SOURCE: 'NEEDS_SOURCE',
  SOURCE_VARIANT: 'SOURCE_VARIANT'
});

export const THAI_SPECIAL_ASTROLOGY_CRITERIA = Object.freeze([
  {
    id: 'SPECIAL-COFFIN',
    name: 'ดวงโลงผี',
    aliases: ['โลงผี', 'โลงผี-แคล้วคลาด'],
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.REFERENCE_PROVISIONAL,
    ruleType: 'sign-occupancy',
    requiredSigns: ['มิถุน', 'สิงห์', 'ธนู', 'กุมภ์'],
    acceptedOccupants: ['ดาวกำเนิด', 'ลัคนา'],
    requiredOccupancy: 'มีสิ่งแทนตำแหน่งอย่างน้อยหนึ่งรายการในแต่ละราศีที่กำหนด',
    planets: 'ดาวใดก็ได้; ไม่พบข้อกำหนดว่าต้องเป็นดาวเฉพาะดวง',
    notes: [
      'แหล่งอธิบายที่พบระบุว่ามีดาวหรือลัคนาอยู่ครบทั้งสี่ราศี และบางคำอธิบายยอมรับเฉพาะดาวก็ได้',
      'มีแหล่งอีกแนวที่กล่าวถึงราศีกรกฎ/มังกรว่างเป็นเงื่อนไขประกอบ จึงเก็บเป็นข้อแตกต่างที่ต้องให้อาจารย์แทนตัดสิน',
      'คำพยากรณ์เรื่องแคล้วคลาดเป็นความเชื่อตามตำรา ไม่ใช่ข้อเท็จจริงที่ระบบยืนยันได้'
    ],
    execution: 'REFERENCE_ONLY',
    evidence: 'พบคำอธิบายสูตรสี่ราศีในบทความโหราศาสตร์มากกว่าหนึ่งแหล่ง; ยังต้องยืนยันข้อกำหนดผู้ครองตำแหน่งและเงื่อนไขราศีว่าง'
  },
  {
    id: 'SPECIAL-DOK-PHIKUN',
    name: 'ดวงดอกพิกุล',
    aliases: ['ดอกพิกุล'],
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'sign-occupancy-from-ascendant',
    housesFromAscendant: [1, 3, 5, 7, 9, 11],
    planets: 'ยังไม่ยืนยันว่าต้องใช้ดาวใดบ้าง หรือจำเป็นต้องครบทุกตำแหน่งหรือไม่',
    notes: [
      'ในโค้ดเดิมมีตัวตรวจแบบตำแหน่งราศีที่ 1, 3, 5, 7, 9, 11 จากลัคนา แต่ให้ถือเป็นแบบร่างอ้างอิงเท่านั้น',
      'ห้ามนำตัวตรวจนี้ไปสรุปว่าดวงเข้าเกณฑ์ตามทุกสำนัก จนกว่าจะยืนยันว่าดาวและลัคนานับอย่างไร'
    ],
    execution: 'REFERENCE_ONLY',
    evidence: 'พบคำอธิบายรูปแบบดวงในบทเรียนออนไลน์ แต่เงื่อนไขรายละเอียดต่างกัน/ยังไม่ครบ'
  },
  {
    id: 'SPECIAL-DOK-UTTAPHIT',
    name: 'ดอกอุตพิต',
    aliases: ['ดอกอุตพิด', 'อุตพิต'],
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    notes: ['ยังไม่มีสูตรต้นฉบับที่ยืนยันได้ ห้ามอนุมานจากชื่อหรือเทียบกับดอกพิกุล'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-NAM-PHON',
    name: 'นำผล',
    aliases: [],
    category: 'เกณฑ์ชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    notes: ['คำว่า “นำผล” กับ “นำพล” ยังห้ามรวมเป็นเกณฑ์เดียวกันจนกว่าอาจารย์แทนจะยืนยัน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-TAM-PHON',
    name: 'ตามผล',
    aliases: [],
    category: 'เกณฑ์ชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    notes: ['คำว่า “ตามผล” กับ “ตามพล” ยังห้ามรวมเป็นเกณฑ์เดียวกันจนกว่าจะยืนยัน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHART-TRIANGLE',
    name: 'ดวงสามเหลี่ยม',
    aliases: [],
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าต้องใช้ดาวใดและครบกี่ตำแหน่ง',
    notes: ['ห้ามใช้แทนความสัมพันธ์ตรีโกณแบบนับราศีโดยอัตโนมัติ'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHANDRA-HALF',
    name: 'ดวงจันทร์ครึ่งซีก',
    aliases: [],
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าดาวทุกดวงหรือเฉพาะดาวเคราะห์ใดเป็นตัวนับ',
    notes: ['ชื่อเหล่านี้ถูกรวมเป็นชื่อพ้องชั่วคราวจากแหล่งที่พบ ต้องให้ผู้รู้ยืนยันก่อนถือเป็นคำเดียวกัน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-MERU-POLE',
    name: 'ดวงเสาพระสุเมรุ',
    aliases: [],
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-RAMA',
    name: 'ดวงพระราม',
    aliases: [],
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PALI',
    name: 'ดวงพญาพาลี',
    aliases: [],
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-SUKRIP',
    name: 'ดวงสุครีพ',
    aliases: [],
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-HANUMAN',
    name: 'ดวงหนุมาน',
    aliases: ['ดวงสามเหลี่ยม (ต้องตรวจความสัมพันธ์)'],
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าต้องใช้ดาวใด',
    notes: ['บางแหล่งกล่าวรวมกับรูปสามเหลี่ยม แต่ยังไม่ควรถือว่าเป็นสูตรเดียวกัน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-POINT-SPEAR',
    name: 'เกณฑ์มุมปลายหอก',
    aliases: [],
    category: 'เกณฑ์มุม/รูปแบบดวง',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHART-TRIAD',
    name: 'ดวงสามเส้า',
    aliases: [],
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-COFFIN-CHEST',
    name: 'ดวงโลงศพ',
    aliases: [],
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าเหมือนดวงโลงผีหรือไม่',
    notes: ['เก็บแยกจากดวงโลงผีจนกว่าจะยืนยันว่าเป็นชื่อพ้อง'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PADUM-KENDRA',
    name: 'ปทุมเกณฑ์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาวเทียบลัคนา',
    status: CRITERION_STATUS.REFERENCE_PROVISIONAL,
    ruleType: 'planet-house-from-ascendant',
    planetConditions: [
      { planet: 'จันทร์', houseFromAscendant: 11 },
      { planet: 'พฤหัสบดี', houseFromAscendant: 4 },
      { planet: 'ศุกร์', houseFromAscendant: 3 }
    ],
    planets: 'จันทร์ (๒), พฤหัสบดี (๕), ศุกร์ (๖)',
    notes: ['เป็นสูตรที่พบในแหล่งอธิบายหนึ่งชุด ต้องยืนยันว่าต้องครบทั้งสามดวงหรือไม่ และใช้ระบบภพ/การนับใด'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-ELEMENT-KENDRA',
    name: 'องค์เกณฑ์',
    aliases: ['องค์เกณฑ์ 4 ประเภท'],
    category: 'เกณฑ์ตำแหน่งดาวเทียบลัคนา',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'ascendant-type-and-house',
    variants: [
      { ascendantType: 'ปัศวะ', houseFromAscendant: 10, requiredPlanets: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พฤหัสบดี'] },
      { ascendantType: 'นระ', houseFromAscendant: 1, requiredPlanets: ['อาทิตย์', 'พฤหัสบดี', 'เสาร์'] },
      { ascendantType: 'อัมพุ', houseFromAscendant: 4, requiredPlanets: ['จันทร์', 'พุธ', 'พฤหัสบดี', 'ศุกร์'] },
      { ascendantType: 'กีฏะ', houseFromAscendant: 7, requiredPlanets: ['ราหู'] }
    ],
    planets: 'ขึ้นกับประเภทลัคนา: ปัศวะ ๑/๒/๓/๕; นระ ๑/๕/๗; อัมพุ ๒/๔/๕/๖; กีฏะ ๘',
    notes: [
      'เป็นชุดเงื่อนไขที่ถอดได้จากแหล่งตำราหนึ่ง แต่การแบ่งราศีเป็นประเภทปัศวะ/นระ/อัมพุ/กีฏะต่างกันได้ตามสำนัก',
      'ต้องยืนยันประเภทของราศีและว่าต้องมีดาวครบทุกดวงก่อนเปิดใช้'
    ],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-UDOM-KENDRA',
    name: 'อุดมเกณฑ์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาวเทียบลัคนา',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'แหล่งที่พบอธิบายตามประเภทลัคนาและภพ แต่ยังไม่ถอดเป็นกฎครบถ้วนที่ตรวจทดสอบได้',
    notes: ['ไม่สร้าง mapping ดาว/ภพเพิ่มจากบทกลอนหรือคำสรุปที่ยังไม่ครบ'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHANDRA-KENDRA',
    name: 'จันทร์เกณฑ์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ชื่อระบุจันทร์ แต่ยังไม่มีสูตรที่ยืนยันได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-ORGAN-KENDRA',
    name: 'อัมพุเกณฑ์',
    aliases: [],
    category: 'เกณฑ์องค์เกณฑ์',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'planet-house-from-ascendant',
    planetConditions: [
      { planet: 'จันทร์', houseFromAscendant: 4 },
      { planet: 'พุธ', houseFromAscendant: 4 },
      { planet: 'พฤหัสบดี', houseFromAscendant: 4 },
      { planet: 'ศุกร์', houseFromAscendant: 4 }
    ],
    planets: 'จันทร์ (๒), พุธ (๔), พฤหัสบดี (๕), ศุกร์ (๖)',
    notes: ['ต้องมีลัคนาประเภทอัมพุตามระบบที่เลือก; เงื่อนไขดาวครบทุกดวงและการจำแนกราศีต้องตรวจจากตำรามาตรฐาน'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-NARA-KENDRA',
    name: 'นรเกณฑ์',
    aliases: ['นระเกณฑ์'],
    category: 'เกณฑ์องค์เกณฑ์',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'planet-house-from-ascendant',
    planetConditions: [
      { planet: 'อาทิตย์', houseFromAscendant: 1 },
      { planet: 'พฤหัสบดี', houseFromAscendant: 1 },
      { planet: 'เสาร์', houseFromAscendant: 1 }
    ],
    planets: 'อาทิตย์ (๑), พฤหัสบดี (๕), เสาร์ (๗)',
    notes: ['ต้องตรวจว่าต้องกุมลัคนาครบสามดวงและราศีใดนับเป็นนระในสำนักที่เลือก'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-PASHU-KENDRA',
    name: 'ปัศวเกณฑ์',
    aliases: ['ปัศวะเกณฑ์'],
    category: 'เกณฑ์องค์เกณฑ์',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'planet-house-from-ascendant',
    planetConditions: [
      { planet: 'อาทิตย์', houseFromAscendant: 10 },
      { planet: 'จันทร์', houseFromAscendant: 10 },
      { planet: 'อังคาร', houseFromAscendant: 10 },
      { planet: 'พฤหัสบดี', houseFromAscendant: 10 }
    ],
    planets: 'อาทิตย์ (๑), จันทร์ (๒), อังคาร (๓), พฤหัสบดี (๕)',
    notes: ['ต้องตรวจประเภทปัศวะและเงื่อนไขว่าต้องครบทั้งสี่ดวง'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-KITA-KENDRA',
    name: 'กีฏะเกณฑ์',
    aliases: ['กีฏเกณฑ์', 'กีรฏะเกณฑ์'],
    category: 'เกณฑ์องค์เกณฑ์',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'planet-house-from-ascendant',
    planetConditions: [
      { planet: 'ราหู', houseFromAscendant: 7 }
    ],
    planets: 'ราหู (๘); บางคำอธิบายกล่าวถึงอังคาร (๓) ร่วมด้วย จึงต้องยืนยันสูตรต้นฉบับ',
    notes: ['มีความแตกต่างระหว่างแหล่งในชุดดาวที่กำหนดไว้ จึงห้ามตัดสินอัตโนมัติ'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-CHANDRA-GURU-SURYA',
    name: 'จันทร์ครุสุริยา',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.REFERENCE_PROVISIONAL,
    ruleType: 'planet-sign-class',
    planets: 'อาทิตย์ (๑), จันทร์ (๒), พฤหัสบดี (๕)',
    notes: ['แหล่งที่พบกล่าวถึงดาวทั้งสามในกลุ่มทวารราศี เมษ/กรกฎ/ตุล/มกร แต่ยังต้องยืนยันว่าดาวแต่ละดวงต้องอยู่ราศีใดและต้องครบทุกดวงหรือไม่'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-CHATUSADAI',
    name: 'จตุสดัยเกณฑ์',
    aliases: ['จตุโกณ (ต้องแยกตามบริบท)'],
    category: 'ความสัมพันธ์ภพ',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'house-relationship',
    housesFromAscendant: [1, 4, 7, 10],
    planets: 'ดาวใดก็ได้สำหรับความสัมพันธ์พื้นฐาน; บางสูตรกำหนดดาวเฉพาะเพิ่มเติม',
    notes: ['อย่ารวมกับมุม 90 องศาแบบดาราศาสตร์หรือจตุโกณอื่นโดยอัตโนมัติ'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-PANCHA-MAHAPURUSA',
    name: 'ปัญจมหาบุรุษโยค',
    aliases: [],
    category: 'โยคมาตรฐาน',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: null,
    planets: 'อังคาร พุธ พฤหัสบดี ศุกร์ เสาร์; ต้องตรวจสูตรย่อยและเงื่อนไขราศี/ภพตามสำนักที่เลือก',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-NEECHA-BHANGA-RAJA',
    name: 'นิจภังคะราชาโยค',
    aliases: ['นีจภังคะราชโยค'],
    category: 'โยคมาตรฐาน',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: null,
    planets: 'ต้องตรวจดาวนิจ เจ้าเรือน และเงื่อนไขภังคะตามตำราที่เลือก',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-DHANA-YOGA',
    name: 'ธนะโยค',
    aliases: ['ธนะโยคเล็ก', 'ธนะโยคใหญ่'],
    category: 'โยคมาตรฐาน',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้โดยไม่มีสูตรสำนักที่เลือก',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHATURAPIT',
    name: 'จตุรพิธ',
    aliases: [],
    category: 'เกณฑ์ชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PINDUBAT',
    name: 'พินทุบาทว์',
    aliases: ['ภิณทุบาทว์', 'ภินทุบาทว์'],
    category: 'เกณฑ์เคราะห์',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ต้องตรวจสูตรวันเกิด/ตำแหน่งดาวและข้อยกเว้นจากตำรา',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-RAHU-HUNTS-MOON',
    name: 'ราหูล่าจันทร์',
    aliases: [],
    category: 'เกณฑ์สัมพันธ์ดาว',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ราหู (๘), จันทร์ (๒); ต้องยืนยันความหมายว่าเป็นมุม ตำแหน่ง หรือช่วงโคจร',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-MOON-HUNTS-RAHU',
    name: 'จันทร์ล่าราหู',
    aliases: [],
    category: 'เกณฑ์สัมพันธ์ดาว',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'จันทร์ (๒), ราหู (๘); ต้องยืนยันความหมายว่าเป็นมุม ตำแหน่ง หรือช่วงโคจร',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PRUETTHI-KENDRA',
    name: 'พฤฒิเกณฑ์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: 'planet-sign',
    planetConditions: [{ planet: 'อาทิตย์', signs: ['เมษ', 'สิงห์', 'ธนู'] }],
    planets: 'อาทิตย์ (๑)',
    notes: ['พบคำอธิบายเบื้องต้น แต่ยังไม่ยืนยันตำราและความหมายของชื่อเกณฑ์'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-PRAK-KENDRA',
    name: 'ปรักเกณฑ์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: 'planet-sign',
    planetConditions: [{ planet: 'อังคาร', signs: ['พฤษภ', 'กันย์', 'มกร'] }],
    planets: 'อังคาร (๓)',
    notes: ['พบคำอธิบายเบื้องต้น ต้องยืนยันต้นฉบับก่อนใช้'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-CHAKRA-KENDRA',
    name: 'จักรเกณฑ์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: 'planet-sign',
    planetConditions: [{ planet: 'เสาร์', signs: ['มิถุน', 'ตุล', 'กุมภ์'] }],
    planets: 'เสาร์ (๗)',
    notes: ['พบคำอธิบายเบื้องต้น ต้องยืนยันต้นฉบับก่อนใช้'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-THAI-KENDRA',
    name: 'ไทยเกณฑ์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: 'planet-sign',
    planetConditions: [{ planet: 'ราหู', signs: ['กรกฎ', 'พิจิก', 'มีน'] }],
    planets: 'ราหู (๘)',
    notes: ['พบคำอธิบายเบื้องต้น ต้องยืนยันต้นฉบับก่อนใช้'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-CHART-LUCK',
    name: 'ดวงวาสนา',
    aliases: [],
    category: 'รูปแบบดวง/คำพยากรณ์',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: null,
    planets: 'บางแหล่งกล่าวถึงอาทิตย์ มฤตยู และเนปจูน แต่ไม่ใช่สูตรยืนยัน',
    notes: ['ห้ามเปิดใช้เพราะระบบ HORA ไม่ได้ใช้เนปจูนเป็นดาวมาตรฐานในการคำนวณพื้นฐาน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PLANET-LEAD',
    name: 'ดาวชูโรง',
    aliases: [],
    category: 'แนวทางตีความ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ขึ้นกับนิยามของสำนัก ไม่ใช่สูตรตำแหน่งเดียว',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PLANET-EXCHANGE',
    name: 'ดาวแลกเรือนเกษตร',
    aliases: ['ปริวรรตเกษตร'],
    category: 'ความสัมพันธ์เจ้าเรือน',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: null,
    planets: 'ดาวเจ้าเรือนสองดวงที่สลับอยู่ในราศีของกันและกัน; ต้องใช้ตารางเจ้าเรือนของระบบที่เลือก',
    notes: ['ต้องตรวจว่าตำรานับกรณีร่วมเรือน/เกษตรร่วมอย่างไร'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-ANU-KASET',
    name: 'อนุเกษตร',
    aliases: [],
    category: 'มาตรฐานดาว',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ต้องมีตารางดาว-ราศีจากสำนักที่เลือก',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PHRUEKSA-CHATA',
    name: 'พฤกษาชะตา',
    aliases: [],
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHOM-FA',
    name: 'จุดจอมฟ้า',
    aliases: [],
    category: 'จุดคำนวณ/เกณฑ์เฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-PLANET-VIWAT',
    name: 'ดาววิวัฒน์',
    aliases: [],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-SUNYAPAH',
    name: 'ศูนยพาหะ',
    aliases: [],
    category: 'เกณฑ์ชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-ANGA-RELATION',
    name: 'ความสัมพันธ์ดาว: กุม/ทับ/เล็ง/โยค/ตรีโกณ/จตุโกณ/ฉาก',
    aliases: ['มุมสัมพันธ์ดาว'],
    category: 'ความสัมพันธ์ดาว',
    status: CRITERION_STATUS.REFERENCE_PROVISIONAL,
    ruleType: 'see-js-data-planetary-relations',
    planets: 'ใช้ดาวหรือจุดที่นำมาตรวจคู่กัน; ทับต้องแยกบริบทดาวจรเทียบดาวเดิม',
    notes: ['กฎความสัมพันธ์เชิงราศีและมุมองศาเป็นคนละชุด ห้ามใช้แทนกันโดยไม่ระบุระบบ'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-FOUR-ELEMENTS',
    name: 'ปัศวะ/นระ/อัมพุ/กีฏะ',
    aliases: ['ประเภทลัคนาองค์เกณฑ์'],
    category: 'การจำแนกประเภทลัคนา',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'ascendant-sign-class',
    planets: 'ไม่ใช่เกณฑ์ดาวโดยตัวเอง แต่ใช้จัดประเภทลัคนาเพื่อเลือกกฎองค์เกณฑ์',
    notes: ['รายการราศีของแต่ละประเภทต่างกันได้ตามตำรา; ห้ามฝัง mapping จนกว่าจะเลือกมาตรฐาน'],
    execution: 'REFERENCE_ONLY'
  },
  {
    id: 'SPECIAL-NAVAMSA-DIVISION',
    name: 'นวางค์/ตรียางค์ในฐานะเกณฑ์ประกอบ',
    aliases: [],
    category: 'เกณฑ์แบ่งส่วนราศี',
    status: CRITERION_STATUS.REFERENCE_PROVISIONAL,
    ruleType: 'divisional-chart',
    planets: 'พิจารณาตำแหน่งดาวแต่ละดวงตามสูตรแบ่งส่วนที่เลือก; ไม่ใช่ชื่อเกณฑ์เดียว',
    notes: ['แยกดาวเดิมกับดาวจรและแยกสูตรนวางค์จากตรียางค์; ไม่เปลี่ยนสูตรตำแหน่งดาวหลัก'],
    execution: 'REFERENCE_ONLY'
  }
]);

export function getThaiSpecialCriterionById(id) {
  return THAI_SPECIAL_ASTROLOGY_CRITERIA.find(item => item.id === id) ?? null;
}

export function getThaiSpecialCriteriaByName(name) {
  const normalized = String(name ?? '').trim();
  if (!normalized) return [];
  return THAI_SPECIAL_ASTROLOGY_CRITERIA.filter(item =>
    item.name === normalized || item.aliases?.includes(normalized)
  );
}

/** Only returns records that are safe to inspect as a reference; nothing is auto-enabled. */
export function getThaiSpecialCriteriaSummary() {
  return {
    version: THAI_SPECIAL_CRITERIA_VERSION,
    total: THAI_SPECIAL_ASTROLOGY_CRITERIA.length,
    executable: THAI_SPECIAL_ASTROLOGY_CRITERIA.filter(item => item.execution === 'ENABLED').length,
    byStatus: Object.fromEntries(Object.values(CRITERION_STATUS).map(status => [
      status,
      THAI_SPECIAL_ASTROLOGY_CRITERIA.filter(item => item.status === status).length
    ]))
  };
}

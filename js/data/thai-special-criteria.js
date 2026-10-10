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

/**
 * Advisor-confirmed discovery decisions, recorded separately from executable rules.
 * Name merges confirm naming/alias handling only; they do not prove that source formulas are identical.
 */
export const THAI_SPECIAL_CRITERIA_DECISIONS = Object.freeze([
  {
    id: 'DECISION-COFFIN',
    criterionId: 'SPECIAL-COFFIN',
    selectedVariant: 'A',
    selectedRule: 'ตรวจเฉพาะเมถุน สิงห์ ธนู และกุมภ์; ไม่เพิ่มเงื่อนไขกรกฎ/มังกรว่างใน variant A',
    state: 'RECORDED_NOT_ENABLED',
    unresolved: ['นับเฉพาะดาวหรือดาวร่วมกับลัคนา', 'เงื่อนไขดาว/การครองตำแหน่งที่ต้องใช้']
  },
  {
    id: 'DECISION-ELEMENT-KENDRA',
    criterionId: 'SPECIAL-ELEMENT-KENDRA',
    selectedVariant: 'A',
    selectedRule: 'จำแนกประเภทลัคนาตามราศีเต็ม ไม่ใช้การแบ่งตามช่วงองศาแบบ B',
    state: 'RECORDED_NOT_ENABLED',
    unresolved: ['การจัดราศีแต่ละประเภทตามสำนักที่เลือก', 'ต้องมีดาวครบทุกดวงหรือไม่']
  },
  {
    id: 'DECISION-CHATUSADAI',
    criterionId: 'SPECIAL-CHATUSADAI',
    selectedVariant: 'A',
    selectedRule: 'ความสัมพันธ์ภพ 1, 4, 7, 10; แยกจากสูตรดาว/ราศีเฉพาะแบบ B',
    state: 'RECORDED_NOT_ENABLED',
    unresolved: ['จุดตั้งต้น/วิธีนับภพ', 'ต้องใช้ดาวใดและต้องครบทุกภพหรือไม่', 'แหล่งของ variant B']
  },
  {
    id: 'DECISION-KITA-KENDRA',
    criterionId: 'SPECIAL-KITA-KENDRA',
    selectedVariant: 'B',
    selectedRule: 'อังคารและราหูอยู่ภพ 7 ตาม variant B',
    state: 'RECORDED_NOT_ENABLED',
    unresolved: ['ประเภทลัคนา/เงื่อนไขการใช้เกณฑ์', 'ต้องอยู่ภพ 7 พร้อมกันหรือไม่', 'แหล่งอ้างอิงของสำนัก']
  }
]);

export const THAI_SPECIAL_NAME_MERGE_DECISIONS = Object.freeze([
  { id: 'NAME-MERGE-01', names: ['ดอกอุตพิต', 'ดอกอุตพิด'], state: 'MERGE_CONFIRMED', canonicalId: 'SPECIAL-DOK-UTTAPHIT', mergeScope: 'NAME_ALIAS_ONLY' },
  { id: 'NAME-MERGE-02', names: ['นำผล', 'นำพล'], state: 'MERGE_CONFIRMED', canonicalId: 'SPECIAL-NAM-PHON', mergeScope: 'NAME_ALIAS_ONLY' },
  { id: 'NAME-MERGE-03', names: ['ตามผล', 'ขับพล'], state: 'MERGE_CONFIRMED', canonicalId: 'SPECIAL-TAM-PHON', mergeScope: 'NAME_ALIAS_ONLY' },
  { id: 'NAME-MERGE-04', names: ['ดวงโลงผี', 'ดวงโลงศพ'], state: 'MERGE_CONFIRMED', canonicalId: 'SPECIAL-COFFIN', mergeScope: 'NAME_ALIAS_ONLY' },
  { id: 'NAME-MERGE-05', names: ['ดวงสามเหลี่ยม', 'ดวงหนุมาน'], state: 'MERGE_CONFIRMED', canonicalId: 'SPECIAL-CHART-TRIANGLE', mergeScope: 'NAME_ALIAS_ONLY' },
  { id: 'NAME-MERGE-06', names: ['ดวงจันทร์เสี้ยว', 'ดวงจันทร์ครึ่งซีก', 'มาลัยโยค', 'อัฒจักร'], state: 'MERGE_CONFIRMED', canonicalId: 'SPECIAL-CHANDRA-HALF', mergeScope: 'NAME_ALIAS_ONLY' }
]);

export const THAI_SPECIAL_ASTROLOGY_CRITERIA = Object.freeze([
  {
    id: 'SPECIAL-COFFIN',
    name: 'ดวงโลงผี',
    aliases: ['โลงผี', 'โลงผี-แคล้วคลาด', 'ดวงโลงศพ'],
    advisorDecision: { selectedVariant: 'A', state: 'RECORDED_NOT_ENABLED', unresolved: ['นับเฉพาะดาวหรือดาวร่วมกับลัคนา'] },
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.REFERENCE_PROVISIONAL,
    ruleType: 'sign-occupancy',
    requiredSigns: ['มิถุน', 'สิงห์', 'ธนู', 'กุมภ์'],
    acceptedOccupants: ['ดาวกำเนิด', 'ลัคนา'],
    requiredOccupancy: 'มีสิ่งแทนตำแหน่งอย่างน้อยหนึ่งรายการในแต่ละราศีที่กำหนด',
    planets: 'ดาวใดก็ได้; ไม่พบข้อกำหนดว่าต้องเป็นดาวเฉพาะดวง',
    notes: [
      'ข้อสรุปอาจารย์แทน: เลือกแบบ A ให้ตรวจเฉพาะเมถุน สิงห์ ธนู และกุมภ์; ไม่เพิ่มเงื่อนไขกรกฎ/มังกรว่างของแบบ B',
      'ยังต้องยืนยันว่าจะนับเฉพาะดาวหรือรวมลัคนาด้วย; จึงคงสถานะไม่เปิดใช้',
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
    decision: {
      selectedVariants: ['A', 'B'],
      selectedRule: 'เก็บแบบ A และ B แยกกันตามสำนัก ห้ามรวมเป็นสูตรเดียว',
      decidedBy: 'อาจารย์แทน',
      decisionDate: '2026-10-10',
      state: 'RECORDED_NOT_ENABLED',
      sourcePolicy: 'KEEP_VARIANTS_SEPARATE',
      variants: [
        {
          id: 'A',
          status: 'SELECTED_REFERENCE_NOT_ENABLED',
          rule: 'ตรวจช่อง/ภพ 1, 3, 5, 7, 9, 11 จากลัคนา',
          unresolved: ['ดาวใดนับได้', 'ต้องครบทุกตำแหน่งหรือไม่', 'นับลัคนาร่วมหรือไม่']
        },
        {
          id: 'B',
          status: 'SEPARATE_VARIANT_UNCONFIRMED_NOT_ENABLED',
          rule: 'ตรวจรูปแบบโยค/ความสัมพันธ์ของดาวที่ส่งต่อกันตามลำดับรอบจักรราศี',
          sourceSchool: 'ยังไม่ระบุชื่อสำนัก—รออาจารย์แทนยืนยัน',
          unresolved: ['แหล่ง/สำนักของแบบ B', 'ดาวที่นับ', 'ลำดับโยค/ความสัมพันธ์', 'เงื่อนไขตำแหน่งและความครบถ้วน']
        }
      ],
      unresolved: ['ดาวใดนับได้', 'ต้องครบทุกตำแหน่งหรือไม่', 'นับลัคนาร่วมหรือไม่', 'รายละเอียดสูตรแบบ B, ลำดับโยค/ความสัมพันธ์ และสำนักที่ใช้อ้างอิง']
    },
    ruleType: 'sign-occupancy-from-ascendant',
    housesFromAscendant: [1, 3, 5, 7, 9, 11],
    planets: 'ยังไม่ยืนยันว่าต้องใช้ดาวใดบ้าง หรือจำเป็นต้องครบทุกตำแหน่งหรือไม่',
    notes: [
      'ข้อสรุปของอาจารย์แทน: เก็บแบบ A และ B แยกตามสำนัก ห้ามรวมเป็นสูตรเดียว',
      'แบบ A: ตรวจช่อง/ภพ 1, 3, 5, 7, 9, 11 จากลัคนา; เก็บเป็น variant แยกจากแบบ B',
      'แบบ B: เก็บแนวโยค/ความสัมพันธ์ของดาวที่ส่งต่อกันตามลำดับรอบจักรราศีเป็น variant แยกต่างหาก; ชื่อสำนักและเงื่อนไขดาวยังไม่ครบ จึงไม่อนุมานเพิ่ม',
      'ข้อสรุปนี้บันทึกเป็นข้อกำหนดของ HORA แล้ว แต่ทั้ง A และ B ยังไม่เปิดใช้เป็นตัวตัดสินเกณฑ์',
      'แบบ A ยังต้องยืนยันว่าดาวใดนับได้ ต้องครบทุกตำแหน่งหรือไม่ และนับลัคนาร่วมหรือไม่',
      'ห้ามรวม A/B หรือสรุปว่าดวงเข้าเกณฑ์ตามทุกสำนัก จนกว่าจะยืนยันเงื่อนไขของแต่ละ variant'
    ],
    execution: 'REFERENCE_ONLY',
    evidence: 'พบคำอธิบายรูปแบบดวงในบทเรียนออนไลน์ แต่เงื่อนไขรายละเอียดต่างกัน/ยังไม่ครบ'
  },
  {
    id: 'SPECIAL-DOK-UTTAPHIT',
    name: 'ดอกอุตพิต',
    aliases: ['ดอกอุตพิด', 'อุตพิต'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
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
    aliases: ['นำพล'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
    category: 'เกณฑ์ชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    notes: ['อาจารย์แทนยืนยันให้รวมชื่อ “นำผล/นำพล” ในฐานะชื่อพ้อง; สูตรยังไม่มีแหล่งยืนยันและยังปิดใช้งาน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-TAM-PHON',
    name: 'ตามผล',
    aliases: ['ขับพล'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
    category: 'เกณฑ์ชื่อเฉพาะ',
    status: CRITERION_STATUS.NEEDS_SOURCE,
    ruleType: null,
    planets: 'ยังระบุไม่ได้',
    notes: ['อาจารย์แทนยืนยันให้รวมชื่อ “ตามผล/ขับพล” ในฐานะชื่อพ้อง; สูตรยังไม่มีแหล่งยืนยันและยังปิดใช้งาน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHART-TRIANGLE',
    name: 'ดวงสามเหลี่ยม',
    aliases: ['ดวงหนุมาน'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าต้องใช้ดาวใดและครบกี่ตำแหน่ง',
    notes: ['อาจารย์แทนยืนยันให้รวมชื่อ “ดวงสามเหลี่ยม/ดวงหนุมาน” ในฐานะชื่อพ้อง; สูตร/เงื่อนไขยังไม่ครบและยังปิดใช้งาน', 'การรวมชื่อไม่อนุญาตให้อนุมานว่าสูตรของทุกสำนักเหมือนกัน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-MOON-CRESCENT',
    name: 'ดวงจันทร์เสี้ยว',
    aliases: ['ดวงจันทร์ครึ่งซีก', 'มาลัยโยค', 'อัฒจักร'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
    mergedInto: 'SPECIAL-CHANDRA-HALF',
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าต้องใช้ดาวใดและรูปแบบการกระจายต้องเป็นอย่างไร',
    notes: ['อาจารย์แทนยืนยันให้รวมชื่อดวงจันทร์เสี้ยว/ดวงจันทร์ครึ่งซีก/มาลัยโยค/อัฒจักรในฐานะกลุ่มชื่อเดียวกัน', 'การยืนยันชื่อไม่ใช่การยืนยันสูตร; รายละเอียดดาวและเงื่อนไขยังไม่ครบ จึงยังปิดใช้งาน'],
    execution: 'DISABLED'
  },
  {
    id: 'SPECIAL-CHANDRA-HALF',
    name: 'ดวงจันทร์ครึ่งซีก',
    aliases: ['ดวงจันทร์เสี้ยว', 'มาลัยโยค', 'อัฒจักร'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
    category: 'รูปแบบการกระจายดาว',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าดาวทุกดวงหรือเฉพาะดาวเคราะห์ใดเป็นตัวนับ',
    notes: ['อาจารย์แทนยืนยันให้รวมชื่อดวงจันทร์เสี้ยว/ดวงจันทร์ครึ่งซีก/มาลัยโยค/อัฒจักรเป็นกลุ่มชื่อเดียวกัน', 'การรวมชื่อไม่ใช่การยืนยันสูตร; รายละเอียดดาวและเงื่อนไขยังไม่ครบ จึงยังปิดใช้งาน'],
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
    aliases: ['ดวงสามเหลี่ยม (ต้องตรวจความสัมพันธ์)', 'ดวงสามเหลี่ยม'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
    mergedInto: 'SPECIAL-CHART-TRIANGLE',
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าต้องใช้ดาวใด',
    notes: ['อาจารย์แทนยืนยันให้รวมชื่อ “ดวงสามเหลี่ยม/ดวงหนุมาน” ในฐานะชื่อพ้อง; ใช้ SPECIAL-CHART-TRIANGLE เป็นรายการอ้างอิงชื่อ', 'คงรหัสเดิมไว้เพื่อความเข้ากันได้; สูตรยังไม่ครบและไม่เปิดใช้งาน'],
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
    aliases: ['ดวงโลงผี'],
    nameMergeState: 'MERGE_CONFIRMED_ALIAS_ONLY',
    mergedInto: 'SPECIAL-COFFIN',
    category: 'รูปแบบดวงชื่อเฉพาะ',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: null,
    planets: 'ยังไม่ยืนยันว่าเหมือนดวงโลงผีหรือไม่',
    notes: ['ชื่อ “ดวงโลงศพ/ดวงโลงผี” ได้รับการยืนยันให้รวมในฐานะชื่อพ้องและใช้ SPECIAL-COFFIN เป็นรายการอ้างอิง', 'คงรหัสเดิมไว้เพื่อความเข้ากันได้; ไม่สร้างตัวตรวจแยก และไม่เปิดใช้งาน'],
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
    advisorDecision: { selectedVariant: 'A', state: 'RECORDED_NOT_ENABLED', selectedRule: 'จำแนกประเภทลัคนาตามราศีเต็ม; ไม่ใช้การแบ่งตามช่วงองศาแบบ B', unresolved: ['เกณฑ์จำแนกประเภทลัคนาตามสำนัก', 'ต้องมีดาวครบทุกดวงหรือไม่'] },
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
      'ข้อสรุปอาจารย์แทน: เลือกแบบ A คือจำแนกประเภทลัคนาตามราศีเต็ม; ไม่ใช้แบบ B ที่แบ่งตามช่วงองศา',
      'ต้องยืนยันเกณฑ์จำแนกประเภทลัคนาและว่าต้องมีดาวครบทุกดวงก่อนเปิดใช้'
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
    advisorDecision: { selectedVariant: 'B', state: 'RECORDED_NOT_ENABLED', selectedRule: 'อังคารและราหูอยู่ภพ 7', unresolved: ['ต้องอยู่ภพ 7 พร้อมกันหรือไม่', 'เงื่อนไขประเภทลัคนา', 'แหล่งอ้างอิง'] },
    aliases: ['กีฏเกณฑ์', 'กีรฏะเกณฑ์'],
    category: 'เกณฑ์องค์เกณฑ์',
    status: CRITERION_STATUS.SOURCE_VARIANT,
    ruleType: 'planet-house-from-ascendant',
    variants: [
      { id: 'A', planetConditions: [{ planet: 'ราหู', houseFromAscendant: 7 }], state: 'NOT_SELECTED' },
      { id: 'B', planetConditions: [{ planet: 'อังคาร', houseFromAscendant: 7 }, { planet: 'ราหู', houseFromAscendant: 7 }], state: 'SELECTED_REFERENCE_NOT_ENABLED' }
    ],
    planetConditions: [
      { planet: 'อังคาร', houseFromAscendant: 7 },
      { planet: 'ราหู', houseFromAscendant: 7 }
    ],
    planets: 'แบบ B ที่อาจารย์แทนเลือก: อังคาร (๓) และราหู (๘) ภพ 7; แบบ A (ราหูภพ 7) ยังคงเก็บแยกใน variants',
    notes: ['ข้อสรุปอาจารย์แทน: เลือกแบบ B โดยเก็บเงื่อนไขอังคารและราหูในภพ 7 แยกจากแบบ A', 'ยังไม่เปิดใช้จนยืนยันว่าต้องอยู่ภพ 7 พร้อมกันหรือไม่ ประเภทลัคนา และแหล่งอ้างอิง'],
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
    advisorDecision: { selectedVariant: 'A', state: 'RECORDED_NOT_ENABLED', selectedRule: 'ความสัมพันธ์ภพ 1, 4, 7, 10; แยกจากสูตรดาว/ราศีเฉพาะแบบ B', unresolved: ['จุดตั้งต้น/วิธีนับภพ', 'ดาวที่นับและความครบถ้วน'] },
    notes: ['อาจารย์แทนเลือกแบบ A: ความสัมพันธ์ภพ 1, 4, 7, 10; เก็บแยกจากสูตรดาว/ราศีเฉพาะแบบ B', 'ยังไม่เปิดใช้จนเงื่อนไขดาวและวิธีนับภพครบถ้วน', 'อย่ารวมกับมุม 90 องศาแบบดาราศาสตร์หรือจตุโกณอื่นโดยอัตโนมัติ'],
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
    id: 'SPECIAL-SAO-CHAI-FOUR-POSTS',
    name: 'เสาไชย 4 ต้น',
    aliases: ['เสาร์ชัย'],
    category: 'เกณฑ์ตำแหน่งดาว',
    status: CRITERION_STATUS.DISCOVERY,
    ruleType: 'planet-sign',
    planetConditions: [{ planet: 'เสาร์', signs: ['พฤษภ', 'กันย์', 'พิจิก', 'มีน'] }],
    planets: 'เสาร์ (๗)',
    notes: ['พบคำอธิบายเบื้องต้นว่าดาวเสาร์อยู่ในราศีพฤษภ กันย์ พิจิก หรือมีน; ต้องยืนยันชื่อเกณฑ์และเงื่อนไขจากตำราต้นฉบับ'],
    execution: 'REFERENCE_ONLY'
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
    !item.mergedInto && (item.name === normalized || item.aliases?.includes(normalized))
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

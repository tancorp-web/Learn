/**
 * HORA Astrology — Planetary Relationships & Special Configurations
 * =================================================================
 * แยกฐานข้อมูล "มุม/เกณฑ์สัมพันธ์" ออกจาก main.js
 *
 * หลักการสำคัญ:
 * 1) ระบบนับราศีแบบไทยและระบบมุมองศาเป็นคนละวิธี ห้ามรวมเป็นกฎเดียวกัน
 * 2) คำว่า "ทับ" ใช้บ่อยกับดาวจรเข้าราศี/ตำแหน่งดาวเดิมหรือลัคนา ส่วน "กุม"
 *    ใช้บรรยายดาวอยู่ร่วมราศีในดวงกำเนิดได้ด้วย รายละเอียดขึ้นกับสำนัก
 * 3) คำเรียกและวิธีนับของบางเกณฑ์แตกต่างกันระหว่างตำรา จึงระบุ policy และสถานะ
 *    ให้ชัดเจน แทนการเดาว่ามีความหมายเดียวกันทุกสำนัก
 * 4) ไฟล์นี้เป็นข้อมูล/เครื่องมืออ้างอิง ไม่ได้ถูกนำไปเปลี่ยนคำพยากรณ์ใน main.js
 *
 * Convention:
 * signIndex: เมษ=0, พฤษภ=1, มิถุน=2, กรกฎ=3, สิงห์=4, กันย์=5,
 *            ตุล=6, พิจิก=7, ธนู=8, มกร=9, กุมภ์=10, มีน=11
 * countedSign = (clockwiseOffset + 1), i.e. sign itself counts as 1.
 */

export const PLANETARY_RELATIONS_VERSION = '1.0.0-reference-only';

export const SIGN_ORDER = Object.freeze([
  'เมษ', 'พฤษภ', 'มิถุน', 'กรกฎ', 'สิงห์', 'กันย์',
  'ตุล', 'พิจิก', 'ธนู', 'มกร', 'กุมภ์', 'มีน'
]);

/**
 * Sign-count relationships commonly described in Thai astrology.
 * offsets are clockwise differences modulo 12, from source sign to target sign.
 * Both directions are included where applicable, because the relationship may be
 * described as front/back (หน้า/หลัง) from a particular source point.
 */
export const SIGN_RELATION_RULES = Object.freeze({
  กุม: {
    id: 'conjunction-by-sign',
    countedSigns: [1],
    clockwiseOffsets: [0],
    description: 'ดาวอยู่ร่วมราศีเดียวกันในดวงกำเนิด',
    scope: 'natal-sign',
    enabledForReference: true
  },
  ทับ: {
    id: 'transit-over-natal',
    countedSigns: [1],
    clockwiseOffsets: [0],
    description: 'โดยทั่วไปใช้เมื่อดาวจรเข้าราศีเดียวกับดาวเดิมหรือลัคนา; หากต้องการความแม่นระดับองศาต้องตรวจตำแหน่งดาวจรเทียบจุดกำเนิดแยกต่างหาก',
    scope: 'transit-sign-or-degree',
    enabledForReference: true
  },
  เล็ง: {
    id: 'opposition-by-sign',
    countedSigns: [7],
    clockwiseOffsets: [6],
    approximateDegrees: [180],
    description: 'อยู่ราศีตรงข้ามกัน นับรวมราศีต้นทางเป็น 1 จึงเป็นราศีที่ 7',
    scope: 'sign-based',
    enabledForReference: true
  },
  โยคหน้า: {
    id: 'forward-yoga-by-sign',
    countedSigns: [3],
    clockwiseOffsets: [2],
    approximateDegrees: [60],
    description: 'นับไปข้างหน้าถึงราศีที่ 3 โดยนับราศีต้นทางเป็น 1',
    scope: 'sign-based',
    enabledForReference: true
  },
  โยคหลัง: {
    id: 'backward-yoga-by-sign',
    countedSigns: [11],
    clockwiseOffsets: [10],
    approximateDegrees: [300],
    description: 'นับย้อน/อีกทางถึงราศีที่ 11 โดยนับราศีต้นทางเป็น 1',
    scope: 'sign-based',
    enabledForReference: true
  },
  ตรีโกณ: {
    id: 'trine-by-sign',
    countedSigns: [5, 9],
    clockwiseOffsets: [4, 8],
    approximateDegrees: [120, 240],
    description: 'ราศีที่ 5 และ 9 จากจุดตั้งต้น; มักอธิบายว่าอยู่ร่วมธาตุ',
    scope: 'sign-based',
    enabledForReference: true
  },
  จตุโกณ: {
    id: 'quadrangular-kendra-by-sign',
    countedSigns: [1, 4, 7, 10],
    clockwiseOffsets: [0, 3, 6, 9],
    approximateDegrees: [0, 90, 180, 270],
    description: 'เกณฑ์ 1, 4, 7, 10; บางตำราเรียกจตุสดัยหรือเกณฑ์ และใช้ชื่อ/ขอบเขตต่างกัน จึงควรเก็บ alias ตามสำนัก',
    scope: 'sign-based',
    enabledForReference: true,
    aliases: ['จตุสดัย', 'เกณฑ์']
  },
  ฉาก: {
    id: 'square-by-degree',
    targetDegrees: [90, 270],
    description: 'มุมฉากตามองศาเป็นแนววัดมุมจริง ไม่ควรใช้แทนจตุโกณแบบนับราศีโดยอัตโนมัติ',
    scope: 'degree-based',
    enabledForReference: true
  }
});

/**
 * Additional named rules/configurations. Some are school-specific.
 * They are catalogued, but intentionally not classified automatically without
 * a precise, agreed definition for this HORA project.
 */
export const SPECIAL_RELATION_RULES = Object.freeze({
  นำพล: {
    id: 'nam-phon',
    status: 'needs-tradition-definition',
    description: 'เป็นชื่อเกณฑ์/ลักษณะดาวที่ใช้ในบางแนวตำรา แต่แหล่งที่พบยังไม่เพียงพอให้ยืนยันสูตรเชิงตำแหน่งแบบเดียวสำหรับทุกสำนัก',
    requiredToEnable: [
      'ระบุตำราหรือครูโหรที่ HORA ยึดถือ',
      'ระบุว่าตรวจจากลัคนา ดาวกำเนิด หรือดาวจร',
      'ระบุเงื่อนไขราศี/ภพ/ลำดับดาวให้ตรวจสอบได้'
    ]
  },
  ขับพล: {
    id: 'khap-phon',
    status: 'needs-tradition-definition',
    description: 'มีการกล่าวถึงเป็นเกณฑ์พิเศษร่วมกับนำพลในตำราเฉพาะ แต่ยังไม่เปิดใช้โดยไม่มีสูตรที่ตรวจสอบได้',
    requiredToEnable: [
      'ระบุตำราหรือแหล่งอ้างอิงที่ใช้เป็นมาตรฐาน',
      'ระบุรูปแบบตำแหน่งดาวและเงื่อนไขการนับ'
    ]
  },
  ดอกพิกุล: {
    id: 'dok-phikun',
    status: 'reference-definition',
    description: 'รูปดวงพิเศษที่พบในคำอธิบายบางสำนัก: มีดาวกุมลัคนา และมีดาวเรียงต่อกันตามตำแหน่งโยคหน้าไปจนถึงตำแหน่งโยคหลัง โดยโครงที่อธิบายกันบ่อยคือช่องนับ 1, 3, 5, 7, 9, 11 จากลัคนา',
    countedHousesFromAscendant: [1, 3, 5, 7, 9, 11],
    offsetsFromAscendant: [0, 2, 4, 6, 8, 10],
    caveat: 'ต้องยืนยันกับตำราที่เลือกว่าต้องมีดาวครบทุกช่องหรือไม่, นับลัคนาเป็นจุดหนึ่งหรือไม่, และรวมดาวนอก/ราหู/เกตุหรือไม่ ก่อนใช้ตัดสินผลจริง',
    sources: [
      'https://anyflip.com/pzlkh/dcge/basic/101-134',
      'https://horasad.blogspot.com/2007/11/blog-post_4958.html',
      'https://ipipek.blogspot.com/2014/11/'
    ]
  },
  ดอกอุตพิด: {
    id: 'dok-uthaphit',
    status: 'needs-tradition-definition',
    description: 'มีการกล่าวถึงเป็นรูปดวงพิเศษในเอกสารโหราศาสตร์บางชุด แต่ยังไม่มีสูตรที่ยืนยันตรงกันในฐานข้อมูลนี้',
    requiredToEnable: [
      'ระบุตำราหรือแหล่งอ้างอิง',
      'ระบุผังตำแหน่งดาวที่ใช้จำแนก'
    ]
  },
  เสี้ยวจันทร์: {
    id: 'siao-chan',
    status: 'needs-tradition-definition',
    description: 'ชื่อเกณฑ์ที่พบในบางชุดตำรา ยังไม่กำหนดเงื่อนไขคำนวณจนกว่าจะยืนยันแหล่งมาตรฐาน',
    requiredToEnable: [
      'ระบุตำราหรือแหล่งอ้างอิง',
      'ระบุจุดตั้งต้นและตำแหน่งดาวที่ต้องมี'
    ]
  }
});

/**
 * Return clockwise sign-count relationship names between two sign names.
 * This is sign-based only; it does not measure exact angular separation.
 */
export function getSignRelations(fromSign, toSign) {
  const from = SIGN_ORDER.indexOf(fromSign);
  const to = SIGN_ORDER.indexOf(toSign);
  if (from < 0 || to < 0) return [];
  const offset = (to - from + 12) % 12;
  const result = [];
  for (const [name, rule] of Object.entries(SIGN_RELATION_RULES)) {
    if (rule.clockwiseOffsets?.includes(offset)) result.push(name);
  }
  return [...new Set(result)];
}

/**
 * Check the commonly described "ดอกพิกุล" occupancy pattern.
 * Input:
 *   ascendantSign: Thai sign name
 *   occupiedSigns: array of Thai sign names containing at least one planet/point
 * This only checks whether all six target sign positions are occupied.
 * It does not decide which celestial bodies count or apply predictive meaning.
 */
export function checkDokPhikunPattern(ascendantSign, occupiedSigns) {
  const ascIndex = SIGN_ORDER.indexOf(ascendantSign);
  if (ascIndex < 0 || !Array.isArray(occupiedSigns)) {
    return { matches: false, missingHouses: [1, 3, 5, 7, 9, 11], reason: 'invalid-input' };
  }
  const occupied = new Set(occupiedSigns);
  const requiredHouses = SPECIAL_RELATION_RULES.ดอกพิกุล.countedHousesFromAscendant;
  const missingHouses = [];
  for (const house of requiredHouses) {
    const sign = SIGN_ORDER[(ascIndex + house - 1) % 12];
    if (!occupied.has(sign)) missingHouses.push(house);
  }
  return {
    matches: missingHouses.length === 0,
    requiredHouses: [...requiredHouses],
    missingHouses,
    reason: missingHouses.length === 0 ? 'all-required-signs-occupied' : 'missing-required-signs'
  };
}

/**
 * HORA Astrology — full-detail 12-sign and special-criteria comparison.
 * Reference-only: does not calculate planetary positions or enable rules.
 */
import {
  THAI_SPECIAL_ASTROLOGY_CRITERIA,
  getThaiSpecialCriterionById
} from '../data/thai-special-criteria.js';

export const SPECIAL_CRITERIA_SIGN_ORDER = Object.freeze([
  'เมษ', 'พฤษภ', 'มิถุน', 'กรกฎ', 'สิงห์', 'กันย์',
  'ตุล', 'พิจิก', 'ธนู', 'มกร', 'กุมภ์', 'มีน'
]);

const SIGN_INDEX = new Map(SPECIAL_CRITERIA_SIGN_ORDER.map((sign, index) => [sign, index]));

function isKnownSign(sign) {
  return SIGN_INDEX.has(sign);
}

function normalizePositions(planetPositions) {
  if (!Array.isArray(planetPositions)) return [];
  return planetPositions
    .filter(item => item && typeof item.planet === 'string' && isKnownSign(item.sign))
    .map(item => ({
      planet: item.planet.trim(),
      sign: item.sign,
      longitude: item.longitude ?? null,
      degree: item.degree ?? null,
      minute: item.minute ?? null,
      motion: item.motion ?? null,
      source: item.source ?? null
    }));
}

/** Whole-sign house number, with the Ascendant sign as house 1. */
export function getWholeSignHouse(ascendantSign, targetSign) {
  if (!isKnownSign(ascendantSign) || !isKnownSign(targetSign)) return null;
  return ((SIGN_INDEX.get(targetSign) - SIGN_INDEX.get(ascendantSign) + 12) % 12) + 1;
}

function getRuleConditions(rule) {
  if (Array.isArray(rule.planetConditions)) return rule.planetConditions;
  // The selected variant is explicit for KITA. Do not guess variants for other rules.
  if (rule.id === 'SPECIAL-KITA-KENDRA' && Array.isArray(rule.variants)) {
    const selected = rule.variants.find(variant => variant.id === 'B');
    if (selected?.planetConditions) return selected.planetConditions;
  }
  return [];
}

function describeCondition(condition) {
  if (Array.isArray(condition.signs)) {
    return `${condition.planet} อยู่ราศี ${condition.signs.join(' / ')}`;
  }
  if (Number.isInteger(condition.houseFromAscendant)) {
    return `${condition.planet} อยู่ภพที่ ${condition.houseFromAscendant} จากลัคนา`;
  }
  return `${condition.planet ?? 'เงื่อนไข'}: ยังไม่มีรายละเอียดที่ตรวจอัตโนมัติ`;
}

function conditionMatchesPosition(condition, position, ascendantSign) {
  if (!position) return null;
  if (Array.isArray(condition.signs)) return condition.signs.includes(position.sign);
  if (Number.isInteger(condition.houseFromAscendant)) {
    const house = getWholeSignHouse(ascendantSign, position.sign);
    return house === null ? null : house === condition.houseFromAscendant;
  }
  return null;
}

function publicRuleDetails(rule) {
  const conditions = getRuleConditions(rule);
  return {
    id: rule.id,
    name: rule.name,
    aliases: [...(rule.aliases ?? [])],
    category: rule.category ?? 'ไม่ระบุหมวด',
    status: rule.status ?? 'ไม่ระบุสถานะ',
    execution: rule.execution ?? 'REFERENCE_ONLY',
    ruleType: rule.ruleType ?? null,
    planets: rule.planets ?? null,
    requiredSigns: rule.requiredSigns ? [...rule.requiredSigns] : [],
    housesFromAscendant: rule.housesFromAscendant ? [...rule.housesFromAscendant] : [],
    conditions: conditions.map(condition => ({
      ...condition,
      description: describeCondition(condition)
    })),
    requiredOccupancy: rule.requiredOccupancy ?? null,
    acceptedOccupants: rule.acceptedOccupants ? [...rule.acceptedOccupants] : [],
    notes: [...(rule.notes ?? [])],
    evidence: rule.evidence ?? null,
    advisorDecision: rule.advisorDecision ?? rule.decision ?? null,
    variants: rule.variants ?? rule.decision?.variants ?? [],
    mergedInto: rule.mergedInto ?? null,
    detail: rule.detail ?? null
  };
}

function evaluateRule(rule, positions, ascendantSign) {
  const conditions = getRuleConditions(rule);
  const isSignOccupancy = rule.ruleType === 'sign-occupancy' && Array.isArray(rule.requiredSigns);
  const matchedConditions = [];
  const unmetConditions = [];
  const missingPlanets = [];
  let fullMatch = false;
  let resultType = 'not-evaluable';
  let evaluationNote = 'ยังไม่มีเงื่อนไขที่กำหนดครบสำหรับตรวจอัตโนมัติ';

  if (conditions.length) {
    for (const condition of conditions) {
      const position = positions.find(item => item.planet === condition.planet);
      if (!position) {
        missingPlanets.push(condition.planet);
        unmetConditions.push({
          planet: condition.planet,
          expectedSigns: condition.signs ? [...condition.signs] : undefined,
          expectedHouseFromAscendant: condition.houseFromAscendant,
          description: describeCondition(condition),
          reason: 'ไม่พบตำแหน่งดาวในข้อมูลที่ส่งเข้ามา'
        });
        continue;
      }
      const matches = conditionMatchesPosition(condition, position, ascendantSign);
      const detail = {
        planet: condition.planet,
        actualSign: position.sign,
        actualHouseFromAscendant: getWholeSignHouse(ascendantSign, position.sign),
        actualLongitude: position.longitude,
        expectedSigns: condition.signs ? [...condition.signs] : undefined,
        expectedHouseFromAscendant: condition.houseFromAscendant,
        description: describeCondition(condition)
      };
      if (matches === true) matchedConditions.push(detail);
      else if (matches === false) unmetConditions.push({
        ...detail,
        reason: 'ตำแหน่งจริงไม่ตรงกับเงื่อนไขอ้างอิง'
      });
      else unmetConditions.push({
        ...detail,
        reason: 'ยังตรวจภพไม่ได้ เพราะไม่มีลัคนาที่ถูกต้อง'
      });
    }
    fullMatch = missingPlanets.length === 0 && unmetConditions.length === 0 &&
      matchedConditions.length === conditions.length;
    resultType = fullMatch ? 'reference-match' :
      (matchedConditions.length ? 'partial-or-no-match' :
        (ascendantSign ? 'partial-or-no-match' : 'insufficient-chart-data'));
    evaluationNote = fullMatch
      ? 'ตำแหน่งตรงกับเงื่อนไขที่บันทึกไว้เท่านั้น; ไม่ได้เปิดใช้เกณฑ์หรือรับรองผลพยากรณ์'
      : 'ยังไม่ครบหรือไม่ตรงเงื่อนไขอ้างอิงที่ระบุ';
  } else if (isSignOccupancy) {
    // Ascendant is deliberately not counted as an occupant until the source rule is confirmed.
    const occupiedSigns = new Set(positions.map(item => item.sign));
    const occupiedRequiredSigns = rule.requiredSigns.filter(sign => occupiedSigns.has(sign));
    const missingRequiredSigns = rule.requiredSigns.filter(sign => !occupiedSigns.has(sign));
    const ascendantOccupancyUnresolved = Boolean(
      isKnownSign(ascendantSign) &&
      rule.acceptedOccupants?.includes('ลัคนา') &&
      rule.requiredSigns.includes(ascendantSign) &&
      !occupiedSigns.has(ascendantSign)
    );
    matchedConditions.push(...occupiedRequiredSigns.map(sign => ({
      sign, condition: 'required-sign-occupied', description: `มีดาวอย่างน้อยหนึ่งดวงในราศี${sign}`
    })));
    unmetConditions.push(...missingRequiredSigns.map(sign => ({
      sign, condition: 'required-sign-occupied', description: `ต้องมีดาวอย่างน้อยหนึ่งดวงในราศี${sign}`,
      reason: 'ไม่พบดาวในราศีที่กำหนด'
    })));
    fullMatch = missingRequiredSigns.length === 0 && isKnownSign(ascendantSign);
    resultType = fullMatch ? 'reference-match' : 'partial-or-no-match';
    evaluationNote = ascendantOccupancyUnresolved
      ? 'ไม่รวมลัคนาเป็นดาวที่ครองราศี เพราะข้อกำหนดนี้ยังไม่ยืนยัน'
      : 'ตรวจเฉพาะราศีที่กำหนด; ข้อกำหนดอื่นที่ยังไม่ยืนยันยังคงแสดงไว้';
    return {
      ...publicRuleDetails(rule),
      resultType, fullMatch, evaluationNote, matchedConditions, unmetConditions, missingPlanets,
      missingRequiredSigns, ascendantOccupancyUnresolved, evaluatedAgainstReferenceOnly: true
    };
  }

  return {
    ...publicRuleDetails(rule),
    resultType, fullMatch, evaluationNote, matchedConditions, unmetConditions, missingPlanets,
    evaluatedAgainstReferenceOnly: true
  };
}

function ruleTouchesSign(rule, sign, houseFromAscendant) {
  const conditions = getRuleConditions(rule);
  const signCondition = conditions.some(condition =>
    Array.isArray(condition.signs) && condition.signs.includes(sign));
  const houseCondition = conditions.some(condition =>
    Number.isInteger(condition.houseFromAscendant) &&
    houseFromAscendant !== null && condition.houseFromAscendant === houseFromAscendant);
  const requiredSign = rule.ruleType === 'sign-occupancy' && rule.requiredSigns?.includes(sign);
  const listedHouse = rule.housesFromAscendant?.includes(houseFromAscendant);
  return { relevant: signCondition || houseCondition || requiredSign || listedHouse,
    basis: requiredSign ? 'required-sign-occupancy' :
      (signCondition ? 'planet-sign' :
        (houseCondition || listedHouse ? 'house-from-ascendant' : null)) };
}

/**
 * Build a complete 12-sign matrix.
 * Each sign includes its occupants, degree details, house, related rules in full,
 * and a separate list of catalogued rules whose sign/house conditions are not specified.
 */
export function buildZodiacSignComparison({ planetPositions = [], ascendantSign = null } = {}) {
  const positions = normalizePositions(planetPositions);
  const validAscendant = isKnownSign(ascendantSign) ? ascendantSign : null;
  const catalog = THAI_SPECIAL_ASTROLOGY_CRITERIA.filter(rule => !rule.mergedInto);

  return SPECIAL_CRITERIA_SIGN_ORDER.map((sign, index) => {
    const occupants = positions.filter(item => item.sign === sign);
    const houseFromAscendant = validAscendant ? getWholeSignHouse(validAscendant, sign) : null;
    const relatedCriteria = [];
    const generalOrUnspecifiedCriteria = [];

    for (const rule of catalog) {
      const relation = ruleTouchesSign(rule, sign, houseFromAscendant);
      const detail = {
        ...publicRuleDetails(rule),
        relevanceBasis: relation.basis,
        evaluation: evaluateRule(rule, positions, validAscendant)
      };
      if (relation.relevant) relatedCriteria.push(detail);
      else if (!getRuleConditions(rule).length &&
        !rule.requiredSigns?.length && !rule.housesFromAscendant?.length) {
        generalOrUnspecifiedCriteria.push(detail);
      }
    }

    return {
      sign,
      signNumber: index + 1,
      signIndex: index,
      isAscendantSign: sign === validAscendant,
      ascendantSign: validAscendant,
      houseFromAscendant,
      houseName: houseFromAscendant === null ? null : `ภพที่ ${houseFromAscendant}`,
      occupants: occupants.map(item => ({
        ...item,
        houseFromAscendant,
        isAscendantSign: sign === validAscendant
      })),
      occupantNames: occupants.map(item => item.planet),
      occupiedByPlanets: occupants.length > 0,
      occupied: occupants.length > 0 || sign === validAscendant,
      criteria: relatedCriteria,
      generalOrUnspecifiedCriteria,
      criteriaCount: relatedCriteria.length,
      unspecifiedCriteriaCount: generalOrUnspecifiedCriteria.length
    };
  });
}

/**
 * Compare all catalogued criteria against supplied positions.
 * A reference match is not an enabled rule and is not a predictive judgment.
 */
export function compareSpecialCriteria({ planetPositions = [], ascendantSign = null } = {}) {
  const positions = normalizePositions(planetPositions);
  const validAscendant = isKnownSign(ascendantSign) ? ascendantSign : null;
  const signComparison = buildZodiacSignComparison({
    planetPositions: positions, ascendantSign: validAscendant
  });
  const criteria = THAI_SPECIAL_ASTROLOGY_CRITERIA
    .filter(rule => !rule.mergedInto)
    .map(rule => evaluateRule(rule, positions, validAscendant));
  const allCataloguedCriteria = THAI_SPECIAL_ASTROLOGY_CRITERIA
    .filter(rule => !rule.mergedInto)
    .map(publicRuleDetails);

  return {
    module: 'HORA_SPECIAL_CRITERIA_COMPARISON',
    mode: 'REFERENCE_ONLY',
    interpretationPolicy: 'NO_AUTOMATIC_JUDGMENT',
    inputValidation: {
      ascendantSignValid: validAscendant !== null,
      inputPositionCount: Array.isArray(planetPositions) ? planetPositions.length : 0,
      acceptedPositionCount: positions.length,
      ignoredPositionCount: (Array.isArray(planetPositions) ? planetPositions.length : 0) - positions.length,
      missingAscendantWarning: validAscendant ? null : 'ไม่มีลัคนาที่ถูกต้อง; ตรวจภพจากลัคนาไม่ได้'
    },
    ascendantSign: validAscendant,
    signOrder: [...SPECIAL_CRITERIA_SIGN_ORDER],
    zodiacComparison: signComparison,
    criteria,
    allCataloguedCriteria,
    summary: {
      signsCompared: signComparison.length,
      criteriaCompared: criteria.length,
      referenceMatches: criteria.filter(item => item.resultType === 'reference-match').map(item => item.id),
      partialOrNoMatch: criteria.filter(item => item.resultType === 'partial-or-no-match').map(item => item.id),
      notEvaluable: criteria.filter(item => item.resultType === 'not-evaluable').map(item => item.id),
      disabledOrReferenceOnly: criteria.filter(item => item.execution !== 'ENABLED').length,
      noAutomaticJudgment: true
    }
  };
}

export function getSpecialCriteriaRule(ruleId) {
  return getThaiSpecialCriterionById(ruleId);
}

/**
 * HORA Astrology — preparation and comparison for Thai special criteria.
 *
 * This module compares a supplied chart against the reference catalogue only.
 * It does not calculate planetary longitudes, change Ascendant/planet formulas,
 * or issue predictive judgments. All zodiac houses use whole-sign counting from
 * the supplied Ascendant sign for comparison purposes.
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
    .map(item => ({ planet: item.planet.trim(), sign: item.sign }));
}

/** Whole-sign house number, with the Ascendant sign as house 1. */
export function getWholeSignHouse(ascendantSign, targetSign) {
  if (!isKnownSign(ascendantSign) || !isKnownSign(targetSign)) return null;
  return ((SIGN_INDEX.get(targetSign) - SIGN_INDEX.get(ascendantSign) + 12) % 12) + 1;
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

function getRuleConditions(rule) {
  if (Array.isArray(rule.planetConditions)) return rule.planetConditions;
  // The selected variant is explicit for KITA. Do not guess variants for other rules.
  if (rule.id === 'SPECIAL-KITA-KENDRA' && Array.isArray(rule.variants)) {
    const selected = rule.variants.find(variant => variant.id === 'B');
    if (selected?.planetConditions) return selected.planetConditions;
  }
  return [];
}

function evaluateRule(rule, positions, ascendantSign) {
  const conditions = getRuleConditions(rule);
  const isSignOccupancy = rule.ruleType === 'sign-occupancy' && Array.isArray(rule.requiredSigns);
  const supported = conditions.length > 0 || isSignOccupancy;
  const matchedConditions = [];
  const unmetConditions = [];
  const missingPlanets = [];
  let fullMatch = false;
  let resultType = 'not-evaluable';

  if (conditions.length) {
    for (const condition of conditions) {
      const position = positions.find(item => item.planet === condition.planet);
      if (!position) {
        missingPlanets.push(condition.planet);
        continue;
      }
      const matches = conditionMatchesPosition(condition, position, ascendantSign);
      const detail = {
        planet: condition.planet,
        actualSign: position.sign,
        actualHouseFromAscendant: getWholeSignHouse(ascendantSign, position.sign),
        expectedSigns: condition.signs ? [...condition.signs] : undefined,
        expectedHouseFromAscendant: condition.houseFromAscendant
      };
      if (matches === true) matchedConditions.push(detail);
      else if (matches === false) unmetConditions.push(detail);
    }
    fullMatch = supported && missingPlanets.length === 0 && unmetConditions.length === 0 &&
      matchedConditions.length === conditions.length;
    resultType = fullMatch ? 'reference-match' :
      (matchedConditions.length || unmetConditions.length ? 'partial-or-no-match' : 'insufficient-chart-data');
  } else if (isSignOccupancy) {
    // Do not count the Ascendant as an occupant for matching yet: this criterion's
    // catalogue explicitly records that the Ascendant-counting rule is unresolved.
    const occupiedSigns = new Set(positions.map(item => item.sign));
    const occupiedRequiredSigns = rule.requiredSigns.filter(sign => occupiedSigns.has(sign));
    const missingRequiredSigns = rule.requiredSigns.filter(sign => !occupiedSigns.has(sign));
    const ascendantOccupancyUnresolved = Boolean(
      isKnownSign(ascendantSign) &&
      rule.acceptedOccupants?.includes('ลัคนา') &&
      rule.requiredSigns.includes(ascendantSign) &&
      !occupiedSigns.has(ascendantSign)
    );
    matchedConditions.push(...occupiedRequiredSigns.map(sign => ({ sign, condition: 'required-sign-occupied' })));
    unmetConditions.push(...missingRequiredSigns.map(sign => ({ sign, condition: 'required-sign-occupied' })));
    fullMatch = missingRequiredSigns.length === 0 && isKnownSign(ascendantSign);
    resultType = fullMatch ? 'reference-match' : 'partial-or-no-match';
    return {
      id: rule.id, name: rule.name, category: rule.category, status: rule.status,
      execution: rule.execution ?? 'REFERENCE_ONLY',
      resultType, fullMatch, matchedConditions, unmetConditions, missingPlanets,
      missingRequiredSigns, ascendantOccupancyUnresolved, evaluatedAgainstReferenceOnly: true
    };
  }

  return {
    id: rule.id, name: rule.name, category: rule.category, status: rule.status,
    execution: rule.execution ?? 'REFERENCE_ONLY',
    resultType, fullMatch, matchedConditions, unmetConditions, missingPlanets,
    evaluatedAgainstReferenceOnly: true
  };
}

/**
 * Build a 12-sign comparison matrix.
 * Input: { planetPositions: [{ planet, sign }], ascendantSign?: Thai sign name }
 */
export function buildZodiacSignComparison({ planetPositions = [], ascendantSign = null } = {}) {
  const positions = normalizePositions(planetPositions);
  const validAscendant = isKnownSign(ascendantSign) ? ascendantSign : null;

  return SPECIAL_CRITERIA_SIGN_ORDER.map((sign, index) => {
    const occupants = positions.filter(item => item.sign === sign).map(item => item.planet);
    const houseFromAscendant = validAscendant ? getWholeSignHouse(validAscendant, sign) : null;
    const signCriteria = [];

    for (const rule of THAI_SPECIAL_ASTROLOGY_CRITERIA) {
      const conditions = getRuleConditions(rule);
      const relevantCondition = conditions.some(condition =>
        (Array.isArray(condition.signs) && condition.signs.includes(sign)) ||
        (Number.isInteger(condition.houseFromAscendant) && houseFromAscendant === condition.houseFromAscendant)
      );
      const requiredSign = rule.ruleType === 'sign-occupancy' && rule.requiredSigns?.includes(sign);
      if (relevantCondition || requiredSign) {
        signCriteria.push({
          id: rule.id,
          name: rule.name,
          status: rule.status,
          execution: rule.execution ?? 'REFERENCE_ONLY',
          basis: requiredSign ? 'required-sign-occupancy' :
            (conditions.some(c => Array.isArray(c.signs) && c.signs.includes(sign) && c.houseFromAscendant === undefined)
              ? 'planet-sign' : 'house-from-ascendant')
        });
      }
    }

    return {
      sign,
      signNumber: index + 1,
      isAscendantSign: sign === validAscendant,
      houseFromAscendant,
      occupants,
      occupied: occupants.length > 0 || sign === validAscendant,
      criteria: signCriteria
    };
  });
}

/**
 * Compare all catalogued criteria against the supplied placements.
 * "reference-match" means only that the provided positions satisfy the recorded
 * reference conditions; it does not enable a rule or assert predictive validity.
 */
export function compareSpecialCriteria({ planetPositions = [], ascendantSign = null } = {}) {
  const positions = normalizePositions(planetPositions);
  const validAscendant = isKnownSign(ascendantSign) ? ascendantSign : null;
  const signComparison = buildZodiacSignComparison({ planetPositions: positions, ascendantSign: validAscendant });
  const criteria = THAI_SPECIAL_ASTROLOGY_CRITERIA
    .filter(rule => !rule.mergedInto)
    .map(rule => evaluateRule(rule, positions, validAscendant));

  return {
    module: 'HORA_SPECIAL_CRITERIA_COMPARISON',
    mode: 'REFERENCE_ONLY',
    inputValidation: {
      ascendantSignValid: validAscendant !== null,
      inputPositionCount: Array.isArray(planetPositions) ? planetPositions.length : 0,
      acceptedPositionCount: positions.length,
      ignoredPositionCount: (Array.isArray(planetPositions) ? planetPositions.length : 0) - positions.length
    },
    ascendantSign: validAscendant,
    signOrder: [...SPECIAL_CRITERIA_SIGN_ORDER],
    zodiacComparison: signComparison,
    criteria,
    summary: {
      signsCompared: signComparison.length,
      criteriaCompared: criteria.length,
      referenceMatches: criteria.filter(item => item.resultType === 'reference-match').map(item => item.id),
      notEvaluable: criteria.filter(item => item.resultType === 'not-evaluable').map(item => item.id),
      noAutomaticJudgment: true
    }
  };
}

export function getSpecialCriteriaRule(ruleId) {
  return getThaiSpecialCriterionById(ruleId);
}

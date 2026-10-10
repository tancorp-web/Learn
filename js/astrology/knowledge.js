import { SIGNS, signOf, houseFromAsc, normalize360 } from '../core/geometry.js';

const SIGN_ALIASES = new Map([
  ['เมษ','เมษ'], ['พฤษภ','พฤษภ'], ['มิถุน','มิถุน'], ['เมถุน','มิถุน'],
  ['กรกฎ','กรกฎ'], ['สิงห์','สิงห์'], ['กันย์','กันย์'], ['ตุล','ตุล'],
  ['พิจิก','พิจิก'], ['ธนู','ธนู'], ['มกร','มกร'], ['มังกร','มกร'],
  ['กุมภ์','กุมภ์'], ['มีน','มีน']
]);
const PLANET_ALIASES = new Map([
  ['อาทิตย์','อาทิตย์'], ['sun','อาทิตย์'], ['๑','อาทิตย์'], ['1','อาทิตย์'],
  ['จันทร์','จันทร์'], ['moon','จันทร์'], ['๒','จันทร์'], ['2','จันทร์'],
  ['อังคาร','อังคาร'], ['mars','อังคาร'], ['๓','อังคาร'], ['3','อังคาร'],
  ['พุธ','พุธ'], ['mercury','พุธ'], ['๔','พุธ'], ['4','พุธ'],
  ['พฤหัส','พฤหัสบดี'], ['พฤหัสบดี','พฤหัสบดี'], ['jupiter','พฤหัสบดี'], ['๕','พฤหัสบดี'], ['5','พฤหัสบดี'],
  ['ศุกร์','ศุกร์'], ['venus','ศุกร์'], ['๖','ศุกร์'], ['6','ศุกร์'],
  ['เสาร์','เสาร์'], ['saturn','เสาร์'], ['๗','เสาร์'], ['7','เสาร์'],
  ['ราหู','ราหู'], ['rahu','ราหู'], ['๘','ราหู'], ['8','ราหู'],
  ['เกตุ','เกตุ'], ['ketu','เกตุ'], ['๙','เกตุ'], ['9','เกตุ'],
  ['มฤตยู','มฤตยู'], ['uranus','มฤตยู'], ['๐','มฤตยู'], ['0','มฤตยู']
]);

function canonicalSign(value) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < 12) return SIGNS[value];
  if (typeof value !== 'string') return null;
  return SIGN_ALIASES.get(value.trim().toLowerCase()) ?? null;
}
function canonicalPlanet(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  return PLANET_ALIASES.get(String(value).trim().toLowerCase()) ?? null;
}

/**
 * Query every recorded standard matching a planet/sign pair.
 * This deliberately returns discovery data as discovery data; it does not
 * promote a source-specific mapping to an approved HORA-wide rule.
 */
export function classifyPlanetInSign({ planet, sign, registry, includeUnverified = true } = {}) {
  if (!registry || !Array.isArray(registry.standards)) {
    throw new TypeError('registry.standards is required');
  }
  const p = canonicalPlanet(planet);
  const s = canonicalSign(sign);
  if (!p || !s) {
    return { planet: p, sign: s, matches: [], status: 'INVALID_INPUT' };
  }
  const matches = registry.standards
    .filter(rule => includeUnverified || rule.status === 'APPROVED' || rule.status === 'GOLDEN')
    .filter(rule => (rule.planets?.[p] ?? []).includes(s))
    .map(rule => ({ id: rule.id, name: rule.name, status: rule.status ?? 'UNSPECIFIED' }));
  return {
    planet: p,
    sign: s,
    matches,
    status: matches.length ? 'MATCHED' : 'NO_RECORDED_MATCH',
    registryId: registry.id,
    registryStatus: registry.status,
    caution: registry.defaultEnabled === false
      ? 'ข้อมูลชุดนี้ยังไม่ใช่ค่าเริ่มต้นที่ผ่านการอนุมัติของ HORA'
      : null
  };
}

/**
 * Resolve facts for one natal planet. House calculation intentionally delegates
 * to the project's existing houseFromAsc function and never alters chart data.
 * Longitudes are absolute degrees in [0, 360); sign can be supplied instead
 * only for dignity lookup, not to calculate a personal house.
 */
export function getNatalPlanetFacts({ planet, longitude, ascendantLongitude, registry } = {}) {
  const p = canonicalPlanet(planet);
  if (!p) throw new TypeError('Unknown planet');
  if (!Number.isFinite(longitude) || longitude < 0 || longitude >= 360) {
    throw new RangeError('longitude must be absolute degrees in [0, 360)');
  }
  if (!Number.isFinite(ascendantLongitude) || ascendantLongitude < 0 || ascendantLongitude >= 360) {
    throw new RangeError('ascendantLongitude must be absolute degrees in [0, 360)');
  }
  const position = signOf(normalize360(longitude));
  const houseNumber = houseFromAsc(longitude, ascendantLongitude);
  const dignity = registry
    ? classifyPlanetInSign({ planet: p, sign: position.name, registry })
    : { planet: p, sign: position.name, matches: [], status: 'REGISTRY_NOT_PROVIDED' };
  return {
    planet: p,
    longitude: normalize360(longitude),
    sign: position.name,
    degree: position.degree,
    minute: position.minute,
    houseNumber,
    houseName: ['ตนุ','กดุมภะ','สหัชชะ','พันธุ','ปุตตะ','อริ','ปัตนิ','มรณะ','ศุภะ','กัมมะ','ลาภะ','วินาศ'][houseNumber - 1],
    dignity,
    houseMethod: 'PROJECT_EXISTING_HOUSE_FROM_ASC',
    source: 'natal-chart-input'
  };
}

export { canonicalPlanet, canonicalSign };

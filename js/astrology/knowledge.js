import { signOf, houseFromAsc, normalize360 } from '../core/geometry.js';

const SIGN_IDS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const SIGN_ALIASES = new Map([
  ['เมษ','aries'], ['พฤษภ','taurus'], ['มิถุน','gemini'], ['เมถุน','gemini'],
  ['กรกฎ','cancer'], ['สิงห์','leo'], ['กันย์','virgo'], ['ตุล','libra'],
  ['พิจิก','scorpio'], ['ธนู','sagittarius'], ['มกร','capricorn'], ['มังกร','capricorn'],
  ['กุมภ์','aquarius'], ['มีน','pisces'],
  ...SIGN_IDS.map(x => [x,x])
]);
const PLANET_ALIASES = new Map([
  ['อาทิตย์','sun'], ['sun','sun'], ['๑','sun'], ['1','sun'],
  ['จันทร์','moon'], ['moon','moon'], ['๒','moon'], ['2','moon'],
  ['อังคาร','mars'], ['mars','mars'], ['๓','mars'], ['3','mars'],
  ['พุธ','mercury'], ['mercury','mercury'], ['๔','mercury'], ['4','mercury'],
  ['พฤหัส','jupiter'], ['พฤหัสบดี','jupiter'], ['jupiter','jupiter'], ['๕','jupiter'], ['5','jupiter'],
  ['ศุกร์','venus'], ['venus','venus'], ['๖','venus'], ['6','venus'],
  ['เสาร์','saturn'], ['saturn','saturn'], ['๗','saturn'], ['7','saturn'],
  ['ราหู','rahu'], ['rahu','rahu'], ['๘','rahu'], ['8','rahu'],
  ['เกตุ','ketu'], ['ketu','ketu'], ['๙','ketu'], ['9','ketu'],
  ['มฤตยู','uranus'], ['uranus','uranus'], ['๐','uranus'], ['0','uranus']
]);

export function canonicalSign(value) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < 12) return SIGN_IDS[value];
  if (typeof value !== 'string') return null;
  return SIGN_ALIASES.get(value.trim().toLowerCase()) ?? null;
}
export function canonicalPlanet(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  return PLANET_ALIASES.get(String(value).trim().toLowerCase()) ?? null;
}

/** Query all matching rules without promoting DISCOVERY rules to approved rules. */
export function classifyPlanetInSign({ planet, sign, registry, systemId, includeUnverified = true } = {}) {
  if (!registry || !Array.isArray(registry.rules)) throw new TypeError('registry.rules is required');
  const p = canonicalPlanet(planet);
  const s = canonicalSign(sign);
  if (!p || !s) return { planet: p, sign: s, matches: [], status: 'INVALID_INPUT' };
  const selectedSystem = systemId ?? registry.system_id;
  const matches = registry.rules
    .filter(rule => rule.planet === p && rule.sign === s && rule.system_id === selectedSystem)
    .filter(rule => includeUnverified || ['APPROVED','GOLDEN','LOCKED'].includes(rule.status))
    .map(rule => ({
      ruleId: rule.rule_id,
      category: rule.category,
      status: rule.status ?? 'UNSPECIFIED',
      systemId: rule.system_id,
      version: rule.version
    }));
  return {
    planet: p, sign: s, systemId: selectedSystem, matches,
    status: matches.length ? 'MATCHED' : 'NO_RECORDED_MATCH',
    registryStatus: registry.status,
    caution: registry.status === 'DISCOVERY'
      ? 'ข้อมูลชุดนี้ยังอยู่ระหว่างตรวจสอบ ไม่ใช่มาตรฐานที่อนุมัติสำหรับคำทำนายอัตโนมัติ'
      : null
  };
}

/** Join a natal planet's computed longitude and personal house to its rule lookup. */
export function getNatalPlanetFacts({ planet, longitude, ascendantLongitude, registry, systemId } = {}) {
  const p = canonicalPlanet(planet);
  if (!p) throw new TypeError('Unknown planet');
  if (!Number.isFinite(longitude) || longitude < 0 || longitude >= 360) throw new RangeError('longitude must be absolute degrees in [0, 360)');
  if (!Number.isFinite(ascendantLongitude) || ascendantLongitude < 0 || ascendantLongitude >= 360) throw new RangeError('ascendantLongitude must be absolute degrees in [0, 360)');
  const absoluteLongitude = normalize360(longitude);
  const position = signOf(absoluteLongitude);
  const signId = SIGN_IDS[position.index];
  const houseNumber = houseFromAsc(absoluteLongitude, ascendantLongitude);
  return {
    planet: p, longitude: absoluteLongitude, sign: signId, signThai: position.name,
    degree: position.degree, minute: position.minute,
    houseNumber,
    houseName: ['ตนุ','กดุมภะ','สหัชชะ','พันธุ','ปุตตะ','อริ','ปัตนิ','มรณะ','ศุภะ','กัมมะ','ลาภะ','วินาศ'][houseNumber - 1],
    dignity: registry ? classifyPlanetInSign({ planet: p, sign: signId, registry, systemId })
      : { planet: p, sign: signId, matches: [], status: 'REGISTRY_NOT_PROVIDED' },
    houseMethod: 'PROJECT_EXISTING_HOUSE_FROM_ASC',
    source: 'natal-chart-input'
  };
}

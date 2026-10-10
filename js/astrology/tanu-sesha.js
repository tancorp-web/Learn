/**
 * ตนุเศษ — HORA project rule F-009.
 * Uses only the natal ascendant and natal planetary longitudes.
 * The 7 classical planets are numbered 1..7: Sun, Moon, Mars, Mercury,
 * Jupiter, Venus, Saturn. A remainder of zero maps to Saturn (7).
 */
const SIGN_LORDS = [
  'อังคาร', 'ศุกร์', 'พุธ', 'จันทร์', 'อาทิตย์', 'พุธ',
  'ศุกร์', 'อังคาร', 'พฤหัสบดี', 'เสาร์', 'เสาร์', 'พฤหัสบดี'
];
const PLANET_NUMBERS = new Map([
  ['อาทิตย์', 1], ['จันทร์', 2], ['อังคาร', 3], ['พุธ', 4],
  ['พฤหัสบดี', 5], ['ศุกร์', 6], ['เสาร์', 7]
]);
const PLANET_NAMES = new Map([...PLANET_NUMBERS].map(([name, number]) => [number, name]));

function longitudeSign(longitude) {
  const value = Number(longitude);
  if (!Number.isFinite(value)) return null;
  return Math.floor((((value % 360) + 360) % 360) / 30);
}
function inclusiveCount(fromSign, toSign) {
  return ((toSign - fromSign + 12) % 12) + 1;
}

/**
 * @param {{ascendantLongitude:number, planets:Array<{name:string,longitude:number}>}} input
 * @returns {null|{planetName:string,planetNumber:number,ascendantLord:string,firstCount:number|null,secondCount:number|null,product:number|null,remainder:number|null,exception:boolean,formulaId:string}}
 */
export function calculateTanuSesha({ ascendantLongitude, planets } = {}) {
  const ascSign = longitudeSign(ascendantLongitude);
  if (ascSign === null || !Array.isArray(planets)) return null;

  const ascendantLord = SIGN_LORDS[ascSign];
  const natalByName = new Map(planets.map(planet => [planet?.name, planet]));
  const ascLordPlanet = natalByName.get(ascendantLord);
  const ascLordSign = longitudeSign(ascLordPlanet?.longitude);
  if (ascLordSign === null) return null;

  // Confirmed project convention: if the ascendant lord is in the ascendant sign,
  // Tanu Sesha is the Sun (number 1), without applying the multiplication step.
  if (ascLordSign === ascSign) {
    return {
      planetName: 'อาทิตย์',
      planetNumber: 1,
      ascendantLord,
      firstCount: null,
      secondCount: null,
      product: null,
      remainder: null,
      exception: true,
      formulaId: 'F-009'
    };
  }

  const firstCount = inclusiveCount(ascSign, ascLordSign);
  const ascLordSignLord = SIGN_LORDS[ascLordSign];
  const secondLordPlanet = natalByName.get(ascLordSignLord);
  const secondLordSign = longitudeSign(secondLordPlanet?.longitude);
  if (secondLordSign === null) return null;

  const secondCount = inclusiveCount(ascLordSign, secondLordSign);
  const product = firstCount * secondCount;
  const rawRemainder = product % 7;
  const planetNumber = rawRemainder === 0 ? 7 : rawRemainder;

  return {
    planetName: PLANET_NAMES.get(planetNumber),
    planetNumber,
    ascendantLord,
    firstCount,
    secondCount,
    product,
    remainder: rawRemainder,
    exception: false,
    formulaId: 'F-009'
  };
}

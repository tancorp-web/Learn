// HORA — Classical Thai Suriyayatra engine.
// This implementation follows the integer arithmetic / interpolation sequence
// used by the classical Suriyayatra model: Horakhun -> solar/lunar mean
// positions -> phila/correction tables -> true planetary positions.
// Golden cases are QA references only; no Golden value is read here.
//
// Unit: arcminute. Full circle = 21600 arcminutes.
// Time input is Thai civil clock time. Province longitude correction is:
// local correction (minutes) = 4 * (105°E - longitude).

const MOD = (v, d) => {
  const r = v % d;
  return r < 0 ? r + d : r === 0 ? 0 : r;
};

const SIGN_DURATIONS = [120,96,72,120,144,168,168,144,120,72,96,120];
const SHADOW_TABLE = [0,244,427,488];
const SUN_TABLE = [0,35,67,94,116,129,134];
const MOON_TABLE = [0,77,148,209,256,286,296];

export const STANDARD_MERIDIAN_LONGITUDE = 105;

export function localTimeCorrectionMinutes(longitude) {
  const lon = Number(longitude);
  if (!Number.isFinite(lon)) throw new Error('LONGITUDE_INVALID');
  return 4 * (STANDARD_MERIDIAN_LONGITUDE - lon);
}

function civilJulianDay(year, month, day) {
  const y = month > 2 ? year : year - 1;
  const m = month > 2 ? month + 1 : month + 13;
  const century = Math.floor(y / 100);
  return Math.floor(y * 365.25) + Math.floor(m * 30.6) + day + 1720997
    - century + Math.floor(century / 4);
}

function interpolateTableFloor(arc, step, table, scale) {
  const index = Math.floor(arc / step);
  if (index >= table.length - 1) return table[table.length - 1] * scale;
  const numerator = table[index] * step
    + (arc - index * step) * (table[index + 1] - table[index]);
  return Math.floor(numerator * scale / step);
}

function interpolate(arc, step, table) {
  const index = Math.floor(arc / step);
  if (index >= table.length - 1) return table[table.length - 1];
  return table[index] + (arc / step - index) * (table[index + 1] - table[index]);
}

function solarIntradayUnits(timeMinutes) {
  return Math.floor(timeMinutes * 5 / 9);
}

function meanLunarApogeeArcMinutes(dayIndex, timeMinutes) {
  return Math.floor((dayIndex * 1440 + timeMinutes) * 15 / 3232) + 2;
}

function thaloengSokReference(chulaSakarat) {
  const horakhun = Math.floor((292207 * chulaSakarat + 373) / 800) + 1;
  const equationUnits = chulaSakarat * 207 + 800 * (
    Math.trunc((chulaSakarat + 38) / 100)
    - Math.trunc((chulaSakarat + 2) / 4)
    - Math.trunc((chulaSakarat + 238) / 400)
  ) - 4427;
  const remainder = equationUnits % 800;
  return {
    horakhun,
    fractionalDaySeconds: remainder === 0 ? 0 : remainder * 108
  };
}

function quadrant(anomaly) {
  const a = MOD(anomaly, 21600);
  const q = Math.floor(a / 5400);
  const arc = [a,10800-a,a-10800,21600-a][q];
  return {
    arc,
    coArc: 5400 - arc,
    direction: q < 2 ? -1 : 1,
    coDirection: q === 0 || q === 3 ? 1 : -1
  };
}

function luminary(mean, anomaly, table) {
  const q = quadrant(anomaly);
  return MOD(mean + Math.floor(interpolate(q.arc, 900, table)) * q.direction, 21600);
}

function correctedPlanet(model, meanRavi) {
  const primary = quadrant(model.primaryBase - model.anomalyOffset);
  const primaryNumerator = interpolateTableFloor(primary.arc, 1800, SHADOW_TABLE, 60);
  const coCorrection = Math.floor(interpolate(primary.coArc, 1800, SHADOW_TABLE) + 0.5);
  const denominator = model.denominator + Math.floor(coCorrection / 2) * primary.coDirection;
  const first = model.primaryBase
    + Math.floor(primaryNumerator * 60 / denominator) * primary.direction;

  const secondary = quadrant(
    MOD(first, 21600) - (model.fixed === undefined ? model.mean : meanRavi)
  );
  const secondaryNumerator = interpolateTableFloor(secondary.arc, 1800, SHADOW_TABLE, 60);
  const sineCorrection = Math.floor(Math.floor(secondaryNumerator / 60 + 0.5) / 3);
  const scaledDenominator = model.fixed === undefined
    ? Math.floor(denominator * model.scale)
    : model.fixed;
  const secondaryCoCorrection =
    Math.floor(interpolate(secondary.coArc, 1800, SHADOW_TABLE) + 0.5);
  const divisor = sineCorrection
    + scaledDenominator
    + secondaryCoCorrection * secondary.coDirection;

  if (denominator <= 0 || divisor <= 0) {
    throw new Error('PLANETARY_CORRECTION_DENOMINATOR_INVALID');
  }
  return MOD(
    first + Math.floor(secondaryNumerator * 60 / divisor) * secondary.direction,
    21600
  );
}

function parseInput(date, time) {
  const [year, month, day] = String(date).split('-').map(Number);
  const [hour, minute] = String(time).split(':').map(Number);
  if (![year,month,day,hour,minute].every(Number.isFinite)) {
    throw new Error('EPHEMERIS_INPUT_INVALID');
  }
  if (year < 1 || year > 9999 || month < 1 || month > 12 ||
      day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error('EPHEMERIS_INPUT_INVALID');
  }
  return {year,month,day,hour,minute};
}

const MOTION_MEAN_SPEED_ARCMIN_PER_DAY = { 'อังคาร': 31.4, 'พุธ': 245.4, 'พฤหัสบดี': 4.9, 'ศุกร์': 70.9, 'เสาร์': 2.0, 'มฤตยู': 0.7 };
const MOTION_STATES = { DIRECT: 'ปกติ', RETROGRADE: 'พักร์', SLOW: 'มณฑ์', FAST: 'เสริด' };

function angularDeltaDegrees(a, b) {
  return ((a - b + 180) % 360 + 360) % 360 - 180;
}

function shiftCivilDate(date, days) {
  const [y,m,d] = String(date).split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

function adhikamasInfo(chulaSakarat) {
  // Traditional 19-year cycle: remainders 3,6,9,11,14,17,0
  // (i.e. years 3,6,9,11,14,17,19) are Adhikamasa years.
  const cycleYear = MOD(chulaSakarat - 8, 19);
  const isAdhikamas = [0,3,6,9,11,14,17].includes(cycleYear);
  return { cycleYear: cycleYear === 0 ? 19 : cycleYear, isAdhikamas, lunarMonth: isAdhikamas ? '๘/๘๘' : 'ปกติมาส' };
}

function motionFor(name, date, time, longitude) {
  if (name === 'ราหู' || name === 'เกตุ') return { state: MOTION_STATES.RETROGRADE, retrograde: true, speedArcminPerDay: null, meanSpeedArcminPerDay: null };
  if (name === 'อาทิตย์' || name === 'จันทร์') return { state: MOTION_STATES.DIRECT, retrograde: false, speedArcminPerDay: null, meanSpeedArcminPerDay: null };
  const prev = calculateSuriyayatra({date: shiftCivilDate(date, -1), time, longitude, includeMotion:false});
  const next = calculateSuriyayatra({date: shiftCivilDate(date, 1), time, longitude, includeMotion:false});
  const p = prev.planets.find(x => x.name === name);
  const n = next.planets.find(x => x.name === name);
  if (!p || !n) return { state: MOTION_STATES.DIRECT, retrograde:false, speedArcminPerDay:null, meanSpeedArcminPerDay:MOTION_MEAN_SPEED_ARCMIN_PER_DAY[name] ?? null };
  const speed = angularDeltaDegrees(n.longitude, p.longitude) * 60 / 2;
  const meanSpeed = MOTION_MEAN_SPEED_ARCMIN_PER_DAY[name] ?? 0;
  const epsilon = 0.02;
  const state = speed < -epsilon ? MOTION_STATES.RETROGRADE : speed < meanSpeed ? MOTION_STATES.SLOW : MOTION_STATES.FAST;
  return { state, retrograde: state === MOTION_STATES.RETROGRADE, speedArcminPerDay: speed, meanSpeedArcminPerDay: meanSpeed };
}

export function calculateSuriyayatra({ date, time, longitude, includeMotion = true }) {
  const input = parseInput(date, time);
  const {year,month,day,hour,minute} = input;
  const timeMinutes = hour * 60 + minute;
  // Planetary Suriyayatra arithmetic uses the civil birth clock for the
  // day-based Madhyam/Horakhun sequence. Province-meridian correction is
  // applied ONLY by the separate Anto-natee ascendant calculation.
  // Golden values are QA references only and are never used as inputs.
  const correction = longitude === undefined ? 0 : localTimeCorrectionMinutes(longitude);
  const calculationTimeMinutes = timeMinutes;

  // Horakhun is tied to the civil Gregorian date, not the browser timezone.
  const julianDayNumber = civilJulianDay(year, month, day);
  const horakhun = julianDayNumber - 1954167;
  const yearBe = year + 543;
  const cs = yearBe - 1181;

  const thaloeng = thaloengSokReference(cs);
  const civilSeconds = timeMinutes * 60;
  const chulaSakarat =
    horakhun < thaloeng.horakhun ||
    (horakhun === thaloeng.horakhun && civilSeconds <= thaloeng.fractionalDaySeconds)
      ? cs - 1 : cs;

  const solarUnits = solarIntradayUnits(calculationTimeMinutes);
  const solarCycleUnits = MOD((horakhun - 1) * 800 + solarUnits - 373, 292207);
  const solarLongitudeUnits = MOD((horakhun - 1) * 800 - 373, 292207) + solarUnits;
  const remainder = MOD(solarLongitudeUnits, 24350);

  const meanSun = MOD(
    Math.trunc(solarLongitudeUnits / 24350) * 1800
      + Math.trunc(remainder / 811) * 60
      + Math.trunc(MOD(remainder, 811) / 14)
      - 3,
    21600
  );
  const meanRavi = MOD(meanSun - 23, 21600);
  // Classical "กำลังพระเคราะห์":
  // (จ.ศ. - 610) × 12 ราศี + ราศี/องศา/ลิปดาของมัธยมรวิ.
  // When represented in arcminutes, one full zodiac = 12 × 30 × 60 = 21600.
  const planetaryPowerArcMinutes =
    (chulaSakarat - 610) * 21600 + meanRavi;
  const epoch = planetaryPowerArcMinutes;

  const sun = luminary(meanSun, meanSun - 4800, SUN_TABLE);

  const lunarUnits = Math.trunc(calculationTimeMinutes * 703 / 24);
  const lunarCycle = MOD((horakhun - 1) * 703 + 650 + lunarUnits, 20760);
  const meanMoon = MOD(
    Math.floor(lunarCycle / 692) * 720
      + Math.trunc(1.04 * MOD(lunarCycle, 692))
      - 40 + meanSun,
    21600
  );
  const apogeeDayIndex = MOD(horakhun - 1 - 621, 3232);
  const lunarAnomaly = meanLunarApogeeArcMinutes(apogeeDayIndex, calculationTimeMinutes);
  const moon = luminary(meanMoon, meanMoon - lunarAnomaly, MOON_TABLE);

  const marsMean = MOD(Math.trunc(epoch / 2) + Math.floor(epoch * 16 / 505) + 5420, 21600);
  const mercuryMean = MOD(Math.trunc(epoch * 7 / 46) + Math.floor(epoch * 4) + 10642, 21600);
  const jupiterMean = MOD(Math.trunc(epoch / 12) + Math.floor(epoch / 1032) + 14297, 21600);
  const venusMean = MOD(Math.trunc(epoch * 5 / 3) - Math.floor(epoch * 10 / 243) + 10944, 21600);
  const saturnMean = MOD(Math.trunc(epoch / 30) + Math.floor(epoch * 6 / 10000) + 11944, 21600);
  const uranusMean = MOD(Math.trunc(epoch / 84) + Math.floor(epoch / 7224) + 16277, 21600);

  const arcs = {
    'อาทิตย์': sun,
    'จันทร์': moon,
    'อังคาร': correctedPlanet({
      mean: marsMean, primaryBase: marsMean, anomalyOffset: 7620,
      denominator: 2700, scale: 4 / 15
    }, meanRavi),
    'พุธ': correctedPlanet({
      mean: mercuryMean, primaryBase: meanRavi, anomalyOffset: 13200,
      denominator: 6000, fixed: 1260
    }, meanRavi),
    'พฤหัสบดี': correctedPlanet({
      mean: jupiterMean, primaryBase: jupiterMean, anomalyOffset: 10320,
      denominator: 5520, scale: 3 / 7
    }, meanRavi),
    'ศุกร์': correctedPlanet({
      mean: venusMean, primaryBase: meanRavi, anomalyOffset: 4800,
      denominator: 19200, fixed: 660
    }, meanRavi),
    'เสาร์': correctedPlanet({
      mean: saturnMean, primaryBase: saturnMean, anomalyOffset: 14820,
      denominator: 3780, scale: 7 / 6
    }, meanRavi),
    'มฤตยู': correctedPlanet({
      mean: uranusMean, primaryBase: uranusMean, anomalyOffset: 7440,
      denominator: 38640, scale: 3 / 7
    }, meanRavi),
    'ราหู': MOD(15150 - MOD(Math.trunc(epoch / 20) + Math.floor(epoch / 265), 21600), 21600),
    'เกตุ': MOD(
      21600 - Math.trunc(
        (MOD(horakhun - 1 - 344, 679) + (hour + minute / 60) / 24) * 21600 / 679
      ),
      21600
    )
  };

  const calendar = adhikamasInfo(chulaSakarat);
  const planets = Object.entries(arcs).map(([name, arc], index) => {
    const motion = includeMotion ? motionFor(name, date, time, longitude) : (['ราหู','เกตุ'].includes(name) ? {state:MOTION_STATES.RETROGRADE,retrograde:true} : {state:MOTION_STATES.DIRECT,retrograde:false});
    return {
      id:name, name, longitude:arc/60, arcMinutes:arc,
      retrograde:motion.retrograde, motionState:motion.state,
      speedArcminPerDay:motion.speedArcminPerDay ?? null,
      meanSpeedArcminPerDay:motion.meanSpeedArcminPerDay ?? null,
      idNumber:['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','ราหู','เกตุ','มฤตยู'][index]
    };
  });

  return {
    date,
    time,
    jd: julianDayNumber,
    harakun: horakhun,
    planets,
    metadata: {
      engineVersion: 'v7.3-CLASSICAL-SURIYAYATRA-ADHIKAMAS-MOTION',
      calculation: 'Horakhun -> Madhyam -> Phili/Plai corrections -> Thai Suriyayatra sidereal positions',
      ayanamsa: null,
      source: 'Classical Suriyayatra integer arithmetic / interpolation model',
      localTimeCorrectionMinutes: correction,
      calculationTimeMinutes,
      standardMeridianLongitude: STANDARD_MERIDIAN_LONGITUDE,
      solarCycleUnits,
      meanSunArcMinutes: meanSun,
      meanRaviArcMinutes: meanRavi,
      planetaryPowerArcMinutes,
      planetaryEpochArcMinutes: epoch,
      calendar,
      motionModel: 'centered 1-day angular speed; retrograde if negative; mand slower than mean daily speed; serit faster than mean daily speed'
    }
  };
}

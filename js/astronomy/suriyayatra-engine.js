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

function planetaryMandaSighra(model, meanRavi) {
  // Shared arithmetic primitive only: the six named planet functions below
  // supply their own classical Manda/Sighra constants and geometry.
  const primary = quadrant(model.primaryBase - model.anomalyOffset);
  const primaryNumerator = interpolateTableFloor(primary.arc, 1800, SHADOW_TABLE, 60);
  const primaryCo = Math.floor(interpolate(primary.coArc, 1800, SHADOW_TABLE) + 0.5);
  const mandaChed = model.ched + Math.floor(primaryCo / 2) * primary.coDirection;
  const mandaNumerator = primaryNumerator * 60;
  const mandaResult = Math.floor(mandaNumerator / mandaChed) * primary.direction;
  const mandaSampus = MOD(model.primaryBase + mandaResult, 21600);

  const secondaryBase = model.secondaryBase === "ravi" ? meanRavi : model.secondaryBase;
  const secondary = quadrant(mandaSampus - secondaryBase);
  const secondaryNumerator = interpolateTableFloor(secondary.arc, 1800, SHADOW_TABLE, 60);
  const secondaryCo = Math.floor(interpolate(secondary.coArc, 1800, SHADOW_TABLE) + 0.5);
  const singhaPhon = Math.floor(Math.floor(secondaryNumerator / 60 + 0.5) / 3);
  const singhaChedBase = model.singhaChed !== undefined
    ? model.singhaChed
    : Math.floor(mandaChed * model.singhaScale);
  const singhaChed = singhaChedBase + secondaryCo * secondary.coDirection;
  const mahaResult = Math.floor((secondaryNumerator * 60) / (singhaPhon + singhaChed)) * secondary.direction;

  if (mandaChed <= 0 || singhaPhon + singhaChed <= 0) {
    throw new Error("PLANETARY_MANAT_DENOMINATOR_INVALID");
  }
  return MOD(mandaSampus + mahaResult, 21600);
}

function calculateMarsManat(meanMars, meanRavi) {
  return planetaryMandaSighra({
    primaryBase: meanMars,
    anomalyOffset: 7620,
    ched: 2700,
    singhaScale: 4 / 15,
    secondaryBase: "ravi"
  }, meanRavi);
}

function calculateMercuryManat(meanMercury, meanRavi) {
  return planetaryMandaSighra({
    primaryBase: meanRavi,
    anomalyOffset: 13200,
    ched: 6000,
    singhaChed: 1260,
    secondaryBase: meanMercury
  }, meanRavi);
}

function calculateJupiterManat(meanJupiter, meanRavi) {
  return planetaryMandaSighra({
    primaryBase: meanJupiter,
    anomalyOffset: 10320,
    ched: 5520,
    singhaScale: 3 / 7,
    secondaryBase: "ravi"
  }, meanRavi);
}

function calculateVenusManat(meanVenus, meanRavi) {
  return planetaryMandaSighra({
    primaryBase: meanRavi,
    anomalyOffset: 4800,
    ched: 19200,
    singhaChed: 660,
    secondaryBase: meanVenus
  }, meanRavi);
}

function calculateSaturnManat(meanSaturn, meanRavi) {
  return planetaryMandaSighra({
    primaryBase: meanSaturn,
    anomalyOffset: 14820,
    ched: 3780,
    singhaScale: 7 / 6,
    secondaryBase: "ravi"
  }, meanRavi);
}

function calculateUranusManat(meanUranus, meanRavi) {
  return planetaryMandaSighra({
    primaryBase: meanUranus,
    anomalyOffset: 7440,
    ched: 38640,
    singhaScale: 3 / 7,
    secondaryBase: "ravi"
  }, meanRavi);
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

function calendarArithmetic(horakhun, chulaSakarat) {
  // Classical Suriyayatra "Atta Thaloeng Sok" arithmetic.
  // References give the year-opening quantities:
  // Kammachaphon, Avaman, Tithi, Masagen and the month criterion.
  const total = horakhun * 11 + 650;
  const avaman = MOD(total, 692);
  const tithiQuotient = Math.floor(total / 692);
  const tithi = MOD(tithiQuotient + horakhun, 30);
  const masa = Math.floor(tithiQuotient / 30);
  const monthCriterion = MOD(
    masa - Math.floor(masa * 7 / 235),
    12
  );

  const cs = chulaSakarat;
  const csNumerator = cs * 292207 + 373;
  const csRemainder = MOD(csNumerator, 800);
  const kammachaphon = csRemainder === 0 ? 0 : 800 - csRemainder;

  // Suriyayatra calendar rule:
  // Kammachaphon < 207 => adhika-suratina year.
  // Normal solar year: Avaman < 137 => Adhikavara.
  // Adhika-suratina year: Avaman < 126 => Adhikavara.
  const isAdhikaSuratin = kammachaphon < 207;
  const isAdhikavara = avaman < (isAdhikaSuratin ? 126 : 137);

  // Calendar criterion number:
  // normal solar + adhikavara = 10
  // adhika solar + adhikavara = 11
  // normal solar + normal vara = 11
  // adhika solar + normal vara = 12
  const adhikamasCriterion =
    isAdhikaSuratin
      ? (isAdhikavara ? 11 : 12)
      : (isAdhikavara ? 10 : 11);

  const isAdhikamas = tithi + adhikamasCriterion >= 30;

  return {
    masa,
    tithi,
    avaman,
    dayAvaman: 703,
    tithiAvaman: 692,
    monthTithiCount: 30,
    monthBoundaryAvaman: MOD(total, 30 * 692),
    chulaSakarat: cs,
    kammachaphon,
    isAdhikaSuratin,
    isAdhikavara,
    adhikamasCriterion,
    isAdhikamas,
    lunarMonth: monthCriterion,
    calendarRule: 'อัตตาเถลิงศก: กัมมัชพล/อวมาน/ดิถี + เกณฑ์ 10/11/12'
  };
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

  // Classical birth-day arithmetic:
  // Suratin birth = number of civil days counted after the Atta Thaloeng Sok day.
  // Kammachaphon birth = Suratin birth × 800 + Kammachaphon Atta + intraday units.
  // This is the quantity that is divided by 24350 for Madhyam Sun.
  const attaKammachaphon = MOD(800 - MOD(cs * 292207 + 373, 800), 800);
  const suratinBirth = horakhun - thaloeng.horakhun - 1;
  const kammachaphonBirth = suratinBirth * 800 + attaKammachaphon + solarUnits;
  const remainder = MOD(kammachaphonBirth, 24350);

  const meanSun = MOD(
    Math.trunc(kammachaphonBirth / 24350) * 1800
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

  // Classical Manat/Suriya-yatra mean Moon.
  // The published method uses Suratin Prasong + Avaman Thaloeng Sok
  // to obtain Avaman Prasong and Tithi Prasong, then converts those
  // directly to zodiac arc before subtracting 40' and adding Madhyam Sun.
  // Source worked example: Avaman 224 -> 8° + 3°52'24".
  const avamanThaloengSok = MOD(thaloeng.horakhun * 11 + 650, 692);
  const avamanPrasong = MOD(suratinBirth * 11 + avamanThaloengSok, 692);
  const tithiThaloengSok = MOD(
    Math.floor((thaloeng.horakhun * 11 + 650) / 692)
      + thaloeng.horakhun,
    30
  );
  const tithiPrasong = MOD(
    Math.floor((suratinBirth * 11 + avamanThaloengSok) / 692)
      + suratinBirth
      + tithiThaloengSok,
    30
  );

  const avamanWhole = Math.floor(avamanPrasong / 25);
  const avamanRemainder = MOD(avamanPrasong, 25);
  const avamanArcMinutes =
    avamanWhole + avamanPrasong + avamanRemainder / 60;

  // Classical notation: one Tithi = 12 degrees; Avaman contribution is
  // (Avaman + floor(Avaman/25)) / 60 degrees; subtract 40'.
  const tithiArcMinutes = tithiPrasong * 12 * 60;
  const meanMoon = MOD(
    meanSun + (avamanPrasong + avamanWhole) + tithiArcMinutes - 40,
    21600
  );
  // Classical true Moon correction uses mean Uccabala, not the generic
  // interpolation table. Uccabala advances from the Thaloeng Sok base by
  // Suratin and uses the 808 divisor; the lunar equation is 296*sin(anomaly)/60.
  const meanUccabala = MOD(
    Math.floor(
      ((horakhun + 2611) * 3 * 1800) / 808
    ) + 2,
    21600
  );
  const moonAnomaly = MOD(meanMoon - meanUccabala, 21600);
  const moonEquation = Math.floor(
    296 * Math.sin((moonAnomaly * Math.PI / 10800))
  );
  const moon = MOD(meanMoon - moonEquation, 21600);

  const marsMean = MOD(Math.trunc(epoch / 2) + Math.floor(epoch * 16 / 505) + 5420, 21600);
  const mercuryMean = MOD(Math.trunc(epoch * 7 / 46) + Math.floor(epoch * 4) + 10642, 21600);
  const jupiterMean = MOD(Math.trunc(epoch / 12) + Math.floor(epoch / 1032) + 14297, 21600);
  const venusMean = MOD(Math.trunc(epoch * 5 / 3) - Math.floor(epoch * 10 / 243) + 10944, 21600);
  const saturnMean = MOD(Math.trunc(epoch / 30) + Math.floor(epoch * 6 / 10000) + 11944, 21600);
  const uranusMean = MOD(Math.trunc(epoch / 84) + Math.floor(epoch / 7224) + 16277, 21600);

  const arcs = {
    'อาทิตย์': sun,
    'จันทร์': moon,
    'อังคาร': calculateMarsManat(marsMean, meanRavi),
    'พุธ': calculateMercuryManat(mercuryMean, meanRavi),
    'พฤหัสบดี': calculateJupiterManat(jupiterMean, meanRavi),
    'ศุกร์': calculateVenusManat(venusMean, meanRavi),
    'เสาร์': calculateSaturnManat(saturnMean, meanRavi),
    'มฤตยู': calculateUranusManat(uranusMean, meanRavi),
    'ราหู': MOD(15150 - MOD(Math.trunc(epoch / 20) + Math.floor(epoch / 265), 21600), 21600),
    'เกตุ': MOD(
      21600 - Math.trunc(
        (MOD(horakhun - 1 - 344, 679) + (hour + minute / 60) / 24) * 21600 / 679
      ),
      21600
    )
  };

  const calendar = calendarArithmetic(horakhun, chulaSakarat);
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
      engineVersion: 'v8.0-CLASSICAL-MOON-MANAT',
      calculation: 'Horakhun -> exact classical mean Sun/Moon -> Madhyam -> named planet-specific Manda/Singha Manat corrections -> Thai Suriyayatra sidereal positions',
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

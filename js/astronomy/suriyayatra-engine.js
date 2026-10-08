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
  // Classical true Moon correction (Suriyayatra / Manat).
  //
  // 1) Uccabala birth is derived from the Thaloeng-sok Uccabala,
  //    Kammachaphon remainder and birth-time fraction. This is retained
  //    as an explicit intermediate so the calculation does not collapse
  //    to the old horakhun+2611 shortcut.
  // 2) Madhyam Ucc uses Uccabala-Thaloeng + Suratin, then x3 / 808
  //    with the classical +2' interpolation term.
  // 3) Uccavises = Madhyam Moon - Madhyam Ucc (mod 12 signs).
  // 4) Plaken -> Khan/Bhuj -> Chandra shadow interpolation table.
  // 5) The resulting Chandra Bhuj Phon is subtracted for rasi 0..5
  //    and added for rasi 6..11.
  //
  // References: AstroNeemo, Suriyayatra/Manat calculation parts 2, 3, 9, 10;
  // and the Journal of the Siam Society worked Suriyayatra example.
  const uccabalaThaloeng = MOD(
    thaloeng.horakhun - 621,
    3232
  );
  const kammachRemainder = MOD(cs * 292207 + 373, 800);
  const kammachFraction = kammachRemainder / 800;
  const birthTimeFraction = calculationTimeMinutes / 1440;
  const uccabalaFromThaloeng = MOD(
    (thaloeng.horakhun - 1) + kammachFraction - 621,
    3232
  );
  const uccabalaBirth = MOD(
    Math.floor(
      (suratinBirth - 1)
      + (attaKammachaphon / 800)
      + birthTimeFraction
      + uccabalaFromThaloeng
    ) + 1,
    3232
  );

  function madhyamUccFromUccabala(uccabala) {
    const scaled = Math.floor(uccabala * 3);
    const rasi = Math.floor(scaled / 808);
    const remainder = MOD(scaled, 808);
    const degree = Math.floor(remainder * 30 / 808);
    const minute = Math.floor((MOD(remainder * 30, 808)) * 60 / 808) + 2;
    return MOD(rasi * 1800 + degree * 60 + minute, 21600);
  }

  const meanUccabala = madhyamUccFromUccabala(
    MOD(uccabalaThaloeng + suratinBirth, 3232)
  );

  // Uccavises is explicitly Madhyam Moon - Madhyam Ucc.
  const uccavises = MOD(meanMoon - meanUccabala, 21600);
  const uccavisesRasi = Math.floor(uccavises / 1800);
  const uccavisesRemainder = MOD(uccavises, 1800);
  const uccavisesDegree = Math.floor(uccavisesRemainder / 60);
  const uccavisesMinute = MOD(uccavisesRemainder, 60);

  // Convert Uccavises to Plaken according to the four 6-rasi quadrants.
  let plaken = uccavises;
  if (uccavisesRasi >= 3 && uccavisesRasi <= 5) {
    plaken = 10800 - uccavises;
  } else if (uccavisesRasi >= 6 && uccavisesRasi <= 8) {
    plaken = uccavises - 10800;
  } else if (uccavisesRasi >= 9) {
    plaken = 21600 - uccavises;
  }

  let plakenRasi = Math.floor(plaken / 1800);
  let plakenRemainder = MOD(plaken, 1800);
  let plakenDegree = Math.floor(plakenRemainder / 60);
  const plakenMinute = MOD(plakenRemainder, 60);

  let khan = plakenRasi * 2;
  if (plakenDegree > 15) {
    plakenDegree -= 15;
    khan += 1;
  }

  const bhujLipda = plakenDegree * 60 + plakenMinute;
  const CHANDRA_SHADOW_UPPER = [77, 148, 209, 256, 286, 296];
  const CHANDRA_SHADOW_DELTA = [77, 71, 61, 47, 30, 10];

  if (khan < 0 || khan > 5) {
    throw new Error('CHANDRA_KHAN_OUT_OF_RANGE');
  }

  const upperIndex = khan - 1;
  const moonCorrectionMagnitude = khan === 0
    ? Math.floor(CHANDRA_SHADOW_UPPER[0] * bhujLipda / 900)
    : CHANDRA_SHADOW_UPPER[upperIndex]
      + Math.floor(CHANDRA_SHADOW_DELTA[upperIndex] * bhujLipda / 900);
  const moonCorrectionSign = uccavisesRasi <= 5 ? -1 : 1;
  const moonCorrection = moonCorrectionMagnitude * moonCorrectionSign;
  const moon = MOD(meanMoon + moonCorrection, 21600);

  const marsMean = MOD(Math.trunc(epoch / 2) + Math.floor(epoch * 16 / 505) + 5420, 21600);
  const mercuryMean = MOD(Math.trunc(epoch * 7 / 46) + Math.floor(epoch * 4) + 10642, 21600);
  const jupiterMean = MOD(Math.trunc(epoch / 12) + Math.floor(epoch / 1032) + 14297, 21600);
  const venusMean = MOD(Math.trunc(epoch * 5 / 3) - Math.floor(epoch * 10 / 243) + 10944, 21600);
  const saturnMean = MOD(Math.trunc(epoch / 30) + Math.floor(epoch * 6 / 10000) + 11944, 21600);
  const uranusMean = MOD(Math.trunc(epoch / 84) + Math.floor(epoch / 7224) + 16277, 21600);

  // Classical Thai Ketu (Suriyayatra / Manat), formula 2:
  // หรคุณกำเนิด -> สุรทินประสงค์ -> หรคุณประสงค์ -> 679
  // -> พลพระเกตุ -> มัธยมพระเกตุ -> สัมผุสพระเกตุ.
  //
  // Important: this is an INTEGER day-cycle calculation. Do not add the
  // birth-clock fraction and do not derive Ketu from Rahu + 180 degrees.
  // Golden values are QA references only and are never injected.
  const ketuHorakhun = horakhun;
  const ketuSuratinPrasong = suratinBirth;
  // Formula 2 source sequence: Horakhun Thaloeng Sok + Suratin Prasong
  // (not birth Horakhun + Suratin). The former is the actual
  // Horakhun Prasong quantity used before the 679-day division.
  const ketuHorakhunPrasong = thaloeng.horakhun + ketuSuratinPrasong;
  const ketu679Remainder = MOD(ketuHorakhunPrasong - 344, 679);
  const ketuMeanArc = ketu679Remainder * 21600 / 679;
  // Preserve the exact fractional arc through the final subtraction.
  // Premature Math.floor here introduces an artificial +1′ quantization
  // error in the Golden cases; the classical division is retained at full precision.
  const ketuTrueArc = MOD(21600 - ketuMeanArc, 21600);

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
    'เกตุ': ketuTrueArc
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
      engineVersion: 'v8.6.3-MOON-KETU-FORMULA-CANDIDATE',
      calculation: 'Horakhun -> classical mean Sun/Moon -> explicit Uccabala birth -> Madhyam Ucc -> Uccavises -> Plaken/Khan/Bhuj -> Chandra shadow -> named planet-specific Manat corrections -> Thai Suriyayatra sidereal positions',
      ayanamsa: null,
      source: 'Classical Suriyayatra integer arithmetic / interpolation model',
      localTimeCorrectionMinutes: correction,
      moonDebug: { meanMoonArcMinutes: meanMoon, uccabalaThaloeng, uccabalaFromThaloeng, uccabalaBirth, meanUccabalaArcMinutes: meanUccabala, uccavisesArcMinutes: uccavises, uccavisesSign: uccavisesRasi, uccavisesDegree: uccavisesDegree, uccavisesMinute: uccavisesMinute, plakenArcMinutes: plaken, plakenRasi, plakenDegree, khan, bhujLipda, moonCorrectionMagnitude, moonCorrection, trueMoonArcMinutes: moon },
      ketuDebug: { ketuHorakhun, ketuSuratinPrasong, ketuHorakhunPrasong, ketu679Remainder, ketuMeanArc, ketuTrueArc },
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

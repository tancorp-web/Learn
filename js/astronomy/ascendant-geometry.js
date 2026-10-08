// HORA — Classical Thai Suriyayatra ascendant.
// Uses the traditional ordinary rising-time (อันโตนาทีสามัญ) model.
// The province correction is derived from longitude, not from a chart-specific
// constant: 4 minutes per degree from the Thai standard meridian 105°E.
//
// This deliberately does NOT use LST/geometric tropical ascendant. The
// planetary engine and ascendant therefore share the same Suriyayatra frame.

const MOD = (v,d) => {
  const r = v % d;
  return r < 0 ? r + d : r === 0 ? 0 : r;
};

const SIGN_DURATIONS = [120,96,72,120,144,168,168,144,120,72,96,120];
const STANDARD_MERIDIAN_LONGITUDE = 105;

export function provinceTimeCorrectionMinutes(longitude) {
  const lon = Number(longitude);
  if (!Number.isFinite(lon)) throw new Error('LONGITUDE_INVALID');
  return 4 * (STANDARD_MERIDIAN_LONGITUDE - lon);
}

function ascendantArcMinutes(sunLongitudeDegrees, timeMinutes, correctionMinutes) {
  const sun = MOD(Number(sunLongitudeDegrees) * 60, 21600);
  const sunSign = Math.floor(sun / 1800);
  const elapsedSun =
    SIGN_DURATIONS.slice(0, sunSign).reduce((sum,d) => sum + d, 0)
    + SIGN_DURATIONS[sunSign] * MOD(sun,1800) / 1800;

  // Traditional sequence: sunrise reference = 06:00, then remove the
  // province's local-meridian time correction.
  const progression = MOD(
    elapsedSun + Number(timeMinutes) - 360 - Number(correctionMinutes),
    1440
  );

  let cumulative = 0;
  let longitude = 0;
  const starts = [];

  for (let sign=0; sign<12; sign++) {
    const duration = SIGN_DURATIONS[sign];
    starts.push(MOD(360 - elapsedSun + cumulative - Number(correctionMinutes), 1440));
    if (progression >= cumulative && progression < cumulative + duration) {
      longitude = sign * 1800
        + (progression - cumulative) * 1800 / duration;
    }
    cumulative += duration;
  }
  return { longitude: MOD(longitude,21600), starts };
}

export function calculateSuriyayatraAscendant({
  timeMinutes,
  sunLongitude,
  longitude,
  localTimeCorrectionMinutes
}) {
  if (!Number.isFinite(Number(sunLongitude))) throw new Error('ASCENDANT_SUN_INVALID');

  const correction = localTimeCorrectionMinutes === undefined
    ? provinceTimeCorrectionMinutes(longitude)
    : Number(localTimeCorrectionMinutes);

  if (!Number.isFinite(correction)) throw new Error('ASCENDANT_CORRECTION_INVALID');

  const minutes = timeMinutes === undefined ? 0 : Number(timeMinutes);
  if (!Number.isFinite(minutes) || minutes < 0 || minutes >= 1440) {
    throw new Error('ASCENDANT_TIME_INVALID');
  }

  return ascendantArcMinutes(sunLongitude, minutes, correction).longitude / 60;
}

// Kept for UI compatibility. The returned times are the traditional sign
// starts generated from the exact same ascendant function; no lookup table.
export function calculateAscendantBoundaryTimes({
  sunLongitude,
  longitude,
  localTimeCorrectionMinutes = undefined
}) {
  if (!Number.isFinite(Number(sunLongitude))) return [];
  const correction = localTimeCorrectionMinutes === undefined
    ? provinceTimeCorrectionMinutes(longitude)
    : Number(localTimeCorrectionMinutes);

  const minutes = [];
  const sun = MOD(Number(sunLongitude) * 60,21600);
  const sunSign = Math.floor(sun/1800);
  const elapsedSun =
    SIGN_DURATIONS.slice(0,sunSign).reduce((s,d)=>s+d,0)
    + SIGN_DURATIONS[sunSign] * MOD(sun,1800) / 1800;

  let cumulative=0;
  for(let sign=0;sign<12;sign++){
    minutes.push({
      sign,
      minutes: MOD(360 - elapsedSun + cumulative - correction,1440)
    });
    cumulative += SIGN_DURATIONS[sign];
  }
  return minutes;
}

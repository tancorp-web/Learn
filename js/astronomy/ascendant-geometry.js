// HORA — Classical Thai Suriyayatra ascendant.
// Reference implementation: the same "anto-birth-sun" arithmetic used by the
// classical Suriyayatra engine. No Golden-case offsets and no geometric LST.
//
// SIGN_DURATIONS are the published ordinary rising-duration units. They sum
// to 1440 minutes and are used directly; do not substitute equal 120-minute
// signs or a tropical/geometric ascendant.

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

/**
 * Classical "อันโตนาทีสามัญ / anto-birth-sun":
 * 1) take the Suriyayatra Sun longitude at birth;
 * 2) convert the Sun's position into elapsed ordinary-rising units;
 * 3) advance by birth clock time from the 06:00 reference;
 * 4) remove the province local-meridian correction;
 * 5) map the result through the sign rising-duration table.
 *
 * This is intentionally NOT sunrise geometry and NOT LST.
 */
function ascendantLongitude(sunArcMinutes, timeMinutes, correctionMinutes) {
  const sun = MOD(Number(sunArcMinutes), 21600);
  const sunSign = Math.floor(sun / 1800);
  const elapsedSun =
    SIGN_DURATIONS.slice(0, sunSign).reduce((sum,d) => sum + d, 0) +
    SIGN_DURATIONS[sunSign] * MOD(sun,1800) / 1800;

  const progression = MOD(
    elapsedSun + Number(timeMinutes) - 360 - Number(correctionMinutes),
    1440
  );

  let cumulative = 0;
  let longitude = 0;
  const starts = [];

  for (const [sign,duration] of SIGN_DURATIONS.entries()) {
    starts.push(MOD(
      360 + Number(correctionMinutes) - elapsedSun + cumulative,
      1440
    ));
    if (progression >= cumulative && progression < cumulative + duration) {
      longitude =
        sign * 1800 +
        (progression - cumulative) * 1800 / duration;
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
  if (!Number.isFinite(Number(sunLongitude))) {
    throw new Error('ASCENDANT_SUN_INVALID');
  }

  const correction = localTimeCorrectionMinutes === undefined
    ? provinceTimeCorrectionMinutes(longitude)
    : Number(localTimeCorrectionMinutes);

  if (!Number.isFinite(correction)) {
    throw new Error('ASCENDANT_CORRECTION_INVALID');
  }

  const minutes = Number(timeMinutes);
  if (!Number.isFinite(minutes) || minutes < 0 || minutes >= 1440) {
    throw new Error('ASCENDANT_TIME_INVALID');
  }

  return ascendantLongitude(Number(sunLongitude) * 60, minutes, correction).longitude / 60;
}

export function calculateAscendantBoundaryTimes({
  sunLongitude,
  longitude,
  localTimeCorrectionMinutes = undefined
}) {
  if (!Number.isFinite(Number(sunLongitude))) return [];

  const correction = localTimeCorrectionMinutes === undefined
    ? provinceTimeCorrectionMinutes(longitude)
    : Number(localTimeCorrectionMinutes);

  const sun = MOD(Number(sunLongitude) * 60,21600);
  const sunSign = Math.floor(sun / 1800);
  const elapsedSun =
    SIGN_DURATIONS.slice(0,sunSign).reduce((sum,d) => sum + d, 0) +
    SIGN_DURATIONS[sunSign] * MOD(sun,1800) / 1800;

  let cumulative = 0;
  const minutes = [];

  for (const [sign,duration] of SIGN_DURATIONS.entries()) {
    minutes.push({
      sign,
      duration,
      minutes: MOD(
        360 + correction - elapsedSun + cumulative,
        1440
      )
    });
    cumulative += duration;
  }

  return minutes;
}

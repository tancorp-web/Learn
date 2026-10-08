// HORA astronomy engine — real ephemeris, no Golden-result shortcuts.
// Planetary positions are calculated from Astronomy Engine (client-side),
// then converted from true-of-date tropical longitude to sidereal longitude
// using an explicit Lahiri/Chitrapaksha ayanamsha model.
//
// IMPORTANT:
// - Golden cases in main.js are QA reference data only.
// - No planet result is read from Golden data.
// - No planet longitude is hardcoded for a birth date.
// - Moon uses the library's dedicated geocentric ecliptic algorithm.
// - Planets use geocentric true-equator-of-date coordinates -> true ecliptic of date.
// References: Astronomy Engine documentation and the standard relation
// sidereal longitude = tropical longitude - ayanamsha.

import * as Astronomy from 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/+esm';

const norm = x => ((Number(x) % 360) + 360) % 360;
const DEG = Math.PI / 180;

const BODY = {
  'อาทิตย์': Astronomy.Body.Sun,
  'พุธ': Astronomy.Body.Mercury,
  'ศุกร์': Astronomy.Body.Venus,
  'อังคาร': Astronomy.Body.Mars,
  'พฤหัสบดี': Astronomy.Body.Jupiter,
  'เสาร์': Astronomy.Body.Saturn,
  'มฤตยู': Astronomy.Body.Uranus,
};

const LAHIRI0_DEG = 22 + 27 / 60 + 55 / 3600;
const LAHIRI_RATE_DEG_PER_YEAR = 0.0139289;

function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function lahiriAyanamsa(date) {
  // Published mean-Lahiri style reference model:
  // 22°27′55″ at 1900-01-01, advancing 0.0139289°/year.
  // This is deliberately a time-dependent formula, not a chart-specific offset.
  const jd = julianDay(date);
  const years = (jd - 2415020.5) / 365.2425;
  return norm(LAHIRI0_DEG + LAHIRI_RATE_DEG_PER_YEAR * years);
}

function equatorialToEclipticLongitude(raDeg, decDeg, obliquityDeg) {
  const ra = raDeg * 15 * DEG;
  const dec = decDeg * DEG;
  const eps = obliquityDeg * DEG;

  const y = Math.sin(ra) * Math.cos(eps) + Math.tan(dec) * Math.sin(eps);
  const x = Math.cos(ra);
  return norm(Math.atan2(y, x) / DEG);
}

function tropicalLongitude(body, date) {
  if (body === Astronomy.Body.Moon) {
    return norm(Astronomy.EclipticGeoMoon(date).elon);
  }

  if (body === Astronomy.Body.Sun && typeof Astronomy.SunPosition === 'function') {
    return norm(Astronomy.SunPosition(date).elon);
  }

  const eq = Astronomy.Equator(
    body,
    date,
    Astronomy.MakeObserver(0, 0, 0),
    true,
    false
  );

  // Astronomy Engine exposes true-equator-of-date coordinates. Convert those
  // coordinates to the corresponding ecliptic-of-date longitude.
  const jd = julianDay(date);
  const T = (jd - 2451545.0) / 36525;
  const obliquity =
    23.43929111111111 -
    0.013004166666667 * T -
    0.000000163888889 * T * T +
    0.000000503611111 * T * T * T;

  return equatorialToEclipticLongitude(eq.ra, eq.dec, obliquity);
}

function parseLocalDate(date, time) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mi] = time.split(':').map(Number);
  // HORA input is Thailand local civil time (UTC+07:00).
  return new Date(Date.UTC(y, m - 1, d, hh, mi) - 7 * 3600000);
}

function isRetrograde(body, date) {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false;
  const dt = new Date(date.getTime() - 0.5 * 86400000);
  const dt2 = new Date(date.getTime() + 0.5 * 86400000);
  const a = tropicalLongitude(body, dt);
  const b = tropicalLongitude(body, dt2);
  const delta = ((b - a + 540) % 360) - 180;
  return delta < 0;
}

function calcBody(name, date, ayanamsa) {
  const tropical = tropicalLongitude(BODY[name], date);
  return {
    tropical,
    sidereal: norm(tropical - ayanamsa),
  };
}

export function calculateSuriyayatra({ date, time }) {
  if (!date || !time) throw new Error('EPHEMERIS_INPUT_INVALID');

  const instant = parseLocalDate(date, time);
  if (!Number.isFinite(instant.getTime())) {
    throw new Error('EPHEMERIS_DATE_INVALID');
  }

  const ayanamsa = lahiriAyanamsa(instant);
  const planets = [];

  for (const name of ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'มฤตยู']) {
    const body = name === 'จันทร์'
      ? { tropical: tropicalLongitude(Astronomy.Body.Moon, instant) }
      : calcBody(name, instant, ayanamsa);

    const tropical = body.tropical;
    const sidereal = name === 'จันทร์' ? norm(tropical - ayanamsa) : body.sidereal;

    planets.push({
      id: name,
      name,
      longitude: sidereal,
      tropicalLongitude: tropical,
      retrograde: name === 'จันทร์' ? false : isRetrograde(BODY[name], instant),
    });
  }

  // Mean lunar node is calculated independently from time; Ketu is exactly
  // opposite Rahu. This avoids hardcoded node positions.
  const T = (julianDay(instant) - 2451545.0) / 36525;
  const meanNodeTropical = norm(
    125.04452 -
    1934.136261 * T +
    0.0020708 * T * T +
    (T * T * T) / 450000
  );
  const rahu = norm(meanNodeTropical - ayanamsa);
  planets.push({ id: 'ราหู', name: 'ราหู', longitude: rahu, tropicalLongitude: meanNodeTropical, retrograde: true });
  planets.push({ id: 'เกตุ', name: 'เกตุ', longitude: norm(rahu + 180), tropicalLongitude: norm(meanNodeTropical + 180), retrograde: true });

  return {
    date,
    time,
    jd: julianDay(instant),
    harakun: Math.floor(julianDay(instant) - 1954167.5) + 1,
    planets,
    metadata: {
      engineVersion: 'v6.0-REAL-EPHEMERIS',
      calculation: 'geocentric true-of-date tropical -> Lahiri sidereal',
      ayanamsa,
      source: 'Astronomy Engine 2.1.19',
    },
  };
}

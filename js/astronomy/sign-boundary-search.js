// Adaptive zodiac-boundary enumeration for the HORA 791 page.
// Coarse samples find ordinary crossings. A detected change in orbital
// direction triggers a bounded extremum search (golden-section), not a
// minute-by-minute scan. This detects brief leave-and-return excursions with
// logarithmically many extra ephemeris evaluations around each station.
const MINUTE_MS = 60_000;
const GOLDEN_RATIO = (Math.sqrt(5) - 1) / 2;

function wrapDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function signedAngularDelta(from, to) {
  let delta = wrapDegrees(to) - wrapDegrees(from);
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

export async function findSignBoundaryEvents({
  start,
  planet,
  longitude,
  targetSign,
  direction,
  step,
  maxSpanMs = 5 * 366 * 86_400_000,
  positionAt,
  pause = async () => {}
}) {
  if (!Number.isFinite(start) || !Number.isFinite(step) || step <= 0
      || ![1, -1].includes(direction) || typeof positionAt !== 'function') {
    throw new Error('SIGN_BOUNDARY_SEARCH_INVALID_ARGUMENT');
  }

  const events = [];
  const longitudeAt = async stamp => {
    const value = Number(await positionAt(stamp, planet, longitude));
    if (!Number.isFinite(value)) throw new Error('SIGN_BOUNDARY_POSITION_INVALID');
    return wrapDegrees(value);
  };
  const signAt = async stamp => Math.floor((await longitudeAt(stamp)) / 30);

  const refine = async (a, b, aIsTarget) => {
    let lo = Math.min(a, b);
    let hi = Math.max(a, b);
    const lowIsTarget = a <= b ? aIsTarget : await signAt(lo) === targetSign;
    while (hi - lo > MINUTE_MS) {
      const mid = lo + Math.floor((hi - lo) / (2 * MINUTE_MS)) * MINUTE_MS;
      if (mid <= lo || mid >= hi) break;
      if ((await signAt(mid) === targetSign) === lowIsTarget) lo = mid;
      else hi = mid;
      if (hi - lo > MINUTE_MS) await pause();
    }
    return { stamp: hi, type: lowIsTarget ? 'ออก' : 'เข้า' };
  };

  const addEvent = event => {
    if (!events.some(item => item.type === event.type
        && Math.abs(item.stamp - event.stamp) <= MINUTE_MS)) events.push(event);
  };

  // Locate the single local extremum bracketed by the sampled direction
  // reversal. Search in traversal order so the same logic works backwards.
  // Angular displacement is unwrapped relative to the first endpoint; the
  // bracket is at most two coarse steps and therefore safely below 180°.
  const inspectStationWindow = async (a, b, aLongitude, maximize) => {
    const span = Math.abs(b - a);
    if (span <= MINUTE_MS) return;
    const displacementAt = async offset => {
      const stamp = a + Math.sign(b - a) * offset;
      return signedAngularDelta(aLongitude, await longitudeAt(stamp));
    };

    let lo = 0;
    let hi = span;
    let x1 = hi - GOLDEN_RATIO * (hi - lo);
    let x2 = lo + GOLDEN_RATIO * (hi - lo);
    let f1 = await displacementAt(x1);
    let f2 = await displacementAt(x2);

    while (hi - lo > MINUTE_MS) {
      const keepLeft = maximize ? f1 > f2 : f1 < f2;
      if (keepLeft) {
        hi = x2;
        x2 = x1;
        f2 = f1;
        x1 = hi - GOLDEN_RATIO * (hi - lo);
        f1 = await displacementAt(x1);
      } else {
        lo = x1;
        x1 = x2;
        f1 = f2;
        x2 = lo + GOLDEN_RATIO * (hi - lo);
        f2 = await displacementAt(x2);
      }
    }

    const extremumStamp = a + Math.sign(b - a) * Math.round((lo + hi) / 2 / MINUTE_MS) * MINUTE_MS;
    const [aSign, extremumSign, bSign] = await Promise.all([
      signAt(a), signAt(extremumStamp), signAt(b)
    ]);

    if (aSign !== extremumSign) {
      addEvent(await refine(a, extremumStamp, aSign === targetSign));
    }
    if (extremumSign !== bSign) {
      addEvent(await refine(extremumStamp, b, extremumSign === targetSign));
    }
    await pause();
  };

  let previousStamp = start;
  let previousIndex = await signAt(start);
  let previousLongitude = await longitudeAt(start);
  let previousDirection = 0;
  let priorSampleStamp = start;

  for (let elapsed = step, tries = 0; elapsed <= maxSpanMs; elapsed += step, tries++) {
    const stamp = start + direction * elapsed;
    const currentLongitude = await longitudeAt(stamp);
    const currentIndex = Math.floor(currentLongitude / 30);

    const segmentDelta = signedAngularDelta(previousLongitude, currentLongitude);
    const segmentDirection = Math.abs(segmentDelta) < 1e-8 ? 0 : Math.sign(segmentDelta);

    // Direction reversal brackets a station over the preceding two segments.
    // Inspect its extremum directly; never enumerate every minute in the span.
    if (segmentDirection && previousDirection && segmentDirection !== previousDirection) {
      await inspectStationWindow(priorSampleStamp, stamp, await longitudeAt(priorSampleStamp), previousDirection > 0);
    }

    if (previousIndex !== currentIndex) {
      const low = Math.min(previousStamp, stamp);
      const high = Math.max(previousStamp, stamp);
      const lowIsTarget = previousStamp <= stamp
        ? previousIndex === targetSign
        : currentIndex === targetSign;
      addEvent(await refine(low, high, lowIsTarget));
    }

    if (segmentDirection) previousDirection = segmentDirection;
    priorSampleStamp = previousStamp;
    previousStamp = stamp;
    previousIndex = currentIndex;
    previousLongitude = currentLongitude;

    if (tries % 12 === 0) await pause();
  }

  events.sort((a, b) => direction < 0 ? b.stamp - a.stamp : a.stamp - b.stamp);
  return events;
}

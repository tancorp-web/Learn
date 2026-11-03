// Adaptive zodiac-boundary enumeration for the HORA 791 page.
// Coarse samples find ordinary crossings. A detected change in orbital
// direction triggers a one-minute scan across the surrounding coarse window,
// so a brief leave-and-return near a station is not hidden by equal endpoints.
const MINUTE_MS = 60_000;

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
  const signAt = async stamp => {
    const value = Number(await positionAt(stamp, planet, longitude));
    if (!Number.isFinite(value)) throw new Error('SIGN_BOUNDARY_POSITION_INVALID');
    return Math.floor(wrapDegrees(value) / 30);
  };

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

  const scanFineWindow = async (a, b) => {
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    let previousStamp = low;
    let previousInside = await signAt(low) === targetSign;
    for (let stamp = Math.min(low + MINUTE_MS, high); stamp <= high; stamp = Math.min(stamp + MINUTE_MS, high)) {
      const inside = await signAt(stamp) === targetSign;
      if (inside !== previousInside) addEvent(await refine(previousStamp, stamp, previousInside));
      previousStamp = stamp;
      previousInside = inside;
      if ((stamp - low) % (30 * MINUTE_MS) === 0) await pause();
      if (stamp === high) break;
    }
  };

  let previousStamp = start;
  let previousIndex = await signAt(start);
  let previousLongitude = Number(await positionAt(start, planet, longitude));
  let previousDirection = 0;
  let priorSampleStamp = start;

  for (let elapsed = step, tries = 0; elapsed <= maxSpanMs; elapsed += step, tries++) {
    const stamp = start + direction * elapsed;
    const currentLongitude = Number(await positionAt(stamp, planet, longitude));
    if (!Number.isFinite(currentLongitude)) throw new Error('SIGN_BOUNDARY_POSITION_INVALID');
    const currentIndex = Math.floor(wrapDegrees(currentLongitude) / 30);

    const segmentDelta = signedAngularDelta(previousLongitude, currentLongitude);
    const segmentDirection = Math.abs(segmentDelta) < 1e-8 ? 0 : Math.sign(segmentDelta);

    // A direction reversal brackets a local station between the previous
    // coarse sample and this one. Scan the full two-segment neighborhood at
    // one-minute resolution, including cases where both coarse endpoints
    // remain in the selected sign.
    if (segmentDirection && previousDirection && segmentDirection !== previousDirection) {
      await scanFineWindow(priorSampleStamp, stamp);
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

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSuriyayatra } from '../../js/astronomy/suriyayatra-engine.js';
import { calculateSuriyayatraAscendant } from '../../js/astronomy/ascendant-geometry.js';

const toArcMinutes = (sign, degree, minute) => sign * 1800 + degree * 60 + minute;
const circularMinuteDifference = (a, b) => {
  const d = ((a - b + 10800) % 21600 + 21600) % 21600 - 10800;
  return Math.abs(d);
};

const cases = [
  {
    label: '1991 Khon Kaen',
    date: '1991-10-14',
    time: '01:05',
    longitude: 102.8236,
    expected: {
      sun: toArcMinutes(5, 25, 38),
      moon: toArcMinutes(8, 6, 27),
      asc: toArcMinutes(3, 25, 58)
    }
  },
  {
    label: '1975 Bangkok',
    date: '1975-10-14',
    time: '01:05',
    longitude: 100.494066,
    expected: {
      sun: toArcMinutes(5, 25, 48),
      moon: toArcMinutes(9, 15, 35),
      asc: toArcMinutes(3, 23, 51)
    }
  }
];

for (const item of cases) {
  test(item.label + ' Sun and Moon remain within the saved Golden tolerance', () => {
    const result = calculateSuriyayatra({
      date: item.date,
      time: item.time,
      longitude: item.longitude,
      includeMotion: false
    });
    const sun = result.planets.find(p => p.name === 'อาทิตย์');
    const moon = result.planets.find(p => p.name === 'จันทร์');
    assert.ok(circularMinuteDifference(sun.arcMinutes, item.expected.sun) <= 1.2,
      item.label + ' Sun delta arcminutes=' + circularMinuteDifference(sun.arcMinutes, item.expected.sun));
    assert.ok(circularMinuteDifference(moon.arcMinutes, item.expected.moon) <= 1.2,
      item.label + ' Moon delta arcminutes=' + circularMinuteDifference(moon.arcMinutes, item.expected.moon));
  });

  test(item.label + ' ascendant remains within the saved Golden tolerance', () => {
    const result = calculateSuriyayatra({
      date: item.date,
      time: item.time,
      longitude: item.longitude,
      includeMotion: false
    });
    const sun = result.planets.find(p => p.name === 'อาทิตย์');
    const [hour, minute] = item.time.split(':').map(Number);
    const asc = calculateSuriyayatraAscendant({
      timeMinutes: hour * 60 + minute,
      sunLongitude: sun.longitude,
      longitude: item.longitude,
      localTimeCorrectionMinutes: result.metadata.localTimeCorrectionMinutes
    });
    assert.ok(circularMinuteDifference(asc * 60, item.expected.asc) <= 1.2,
      item.label + ' Ascendant delta arcminutes=' + circularMinuteDifference(asc * 60, item.expected.asc));
  });
}

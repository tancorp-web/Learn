// HORA local Thai lunar calendar engine for month 8/8 date verification.
// Ported from KranaxALT/thailunar (MIT), itself ported from pythaidate and
// based on classical Thai calendrical arithmetic (horakhun, avoman, tithi).
// This module calculates dates from the algorithm; it does not read backup
// reference data and does not make network requests.
//
// Upstream source: https://github.com/KranaxALT/thailunar
// License: MIT. This compact port keeps the year/month arithmetic needed to
// identify the first civil date of the repeated eighth month.

const DAYS_IN_800_YEARS = 292207;
const TIME_UNITS_IN_DAY = 800;
const EPOCH_OFFSET = 373;
const CS_JULIAN_DAY_OFFSET = 1954167;
const LUNAR_MONTHS = [0, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 8, 88, 5, 6];

function floorMod(a, b) {
  const remainder = a % b;
  return remainder < 0 ? remainder + b : remainder;
}

function gregorianToJulianDay(year, month, day) {
  let yearp;
  let monthp;
  if (month === 1 || month === 2) {
    yearp = year - 1;
    monthp = month + 12;
  } else {
    yearp = year;
    monthp = month;
  }
  let b = 0;
  if (year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day >= 15)))) {
    const a = Math.trunc(yearp / 100);
    b = 2 - a + Math.trunc(a / 4);
  }
  let c = Math.trunc(365.25 * yearp);
  if (yearp < 0) c = Math.trunc(365.25 * yearp - 0.75);
  const d = Math.trunc(30.6001 * (monthp + 1));
  return Math.trunc(b + c + d + day + 1720994.5 + 0.5);
}

function newLunarYear(year) {
  const total = year * DAYS_IN_800_YEARS + EPOCH_OFFSET;
  const horakhun = Math.trunc(total / TIME_UNITS_IN_DAY) + 1;
  const kammacapon = TIME_UNITS_IN_DAY - floorMod(total, TIME_UNITS_IN_DAY);
  const avomanRaw = horakhun * 11 + 650;
  const avoman = floorMod(avomanRaw, 692) || 692;
  let tithi = floorMod(Math.trunc(avomanRaw / 692) + horakhun, 30);
  if (avoman === 692) tithi -= 1;

  const nextHorakhun = Math.trunc(((year + 1) * DAYS_IN_800_YEARS + EPOCH_OFFSET) / TIME_UNITS_IN_DAY) + 1;
  const nextTithi = floorMod(Math.trunc((nextHorakhun * 11 + 650) / 692) + nextHorakhun, 30);

  let langsak = tithi;
  if (langsak < 1) langsak = 1;
  let nydDay = langsak;
  if (nydDay < 6) nydDay += 29;
  const nyd = floorMod(floorMod(horakhun, 7) - nydDay + 1 + 35, 7);
  const leapday = kammacapon <= 207;

  let calType = 'A';
  if (tithi > 24 || tithi < 6) calType = 'C';
  if (tithi === 25 && nextTithi === 5) calType = 'A';
  if ((leapday && avoman <= 126) || (!leapday && avoman <= 137)) {
    calType = calType !== 'C' ? 'B' : 'c';
  }

  let nextNyd;
  if (calType === 'A') nextNyd = floorMod(nyd + 4, 7);
  else if (calType === 'B') nextNyd = floorMod(nyd + 5, 7);
  else nextNyd = floorMod(nyd + 6, 7);

  return { horakhun, avoman, tithi, langsak, nyd, nextNyd, leapday, calType, offset: false };
}

function calculateYear0(year) {
  const years = [
    newLunarYear(year - 2),
    newLunarYear(year - 1),
    newLunarYear(year),
    newLunarYear(year + 1),
    newLunarYear(year + 2)
  ];

  if (years[2].tithi === 24 && years[3].tithi === 6) {
    for (const item of years) {
      item.calType = 'C';
      item.nextNyd = floorMod(item.nextNyd + 2, 7);
    }
  }

  for (let i = 1; i <= 3; i += 1) {
    if (years[i].calType === 'c') {
      const j = years[i].nyd === years[i - 1].nextNyd ? 1 : -1;
      years[i + j].calType = 'B';
      years[i + j].nextNyd = floorMod(years[i + j].nextNyd + 1, 7);
    }
  }

  for (let i = 1; i <= 3; i += 1) {
    if (years[i - 1].nextNyd !== years[i].nyd && years[i].nextNyd !== years[i + 1].nyd) {
      years[i].offset = true;
      years[i].langsak += 1;
      years[i].nyd = floorMod(years[i].nyd + 6, 7);
      years[i].nextNyd = floorMod(years[i].nextNyd + 6, 7);
    }
  }

  if (years[2].calType === 'c') years[2].calType = 'C';
  const result = { ...years[2] };
  result.offsetDays = result.langsak;
  if (result.offsetDays < 6 + (result.offset ? 1 : 0)) result.offsetDays += 29;
  return result;
}

function findLunarDate(calType, days) {
  const tables = {
    A: [[383,16],[354,15],[324,12],[295,11],[265,10],[236,9],[206,8],[177,7],[147,6],[118,5],[88,4],[59,3],[29,2]],
    B: [[384,16],[355,15],[325,12],[296,11],[266,10],[237,9],[207,8],[178,7],[148,6],[119,5],[89,4],[59,3],[29,2]],
    C: [[384,15],[354,12],[325,11],[295,10],[266,9],[236,8],[207,7],[177,6],[148,5],[118,14],[88,13],[59,3],[29,2]]
  };
  let month = LUNAR_MONTHS[1];
  for (const [threshold, slot] of tables[calType]) {
    if (days > threshold) {
      days -= threshold;
      month = LUNAR_MONTHS[slot];
      return { month, day: days };
    }
  }
  return { month, day: days };
}

function lunarMonthForGregorianDate(year, month, day) {
  const jd = gregorianToJulianDay(year, month, day);
  const horakhun = jd - CS_JULIAN_DAY_OFFSET;
  let csYear = Math.trunc((horakhun * 800 - 373) / DAYS_IN_800_YEARS);
  let days;
  if (floorMod(horakhun, DAYS_IN_800_YEARS) === 95333) {
    csYear -= 1;
    days = 365;
  } else {
    days = horakhun - calculateYear0(csYear).horakhun;
  }

  let yearInfo = calculateYear0(csYear);
  let daysInYear = yearInfo.leapday ? 366 : 365;
  while (days > daysInYear) {
    csYear += 1;
    days -= daysInYear;
    yearInfo = calculateYear0(csYear);
    daysInYear = yearInfo.leapday ? 366 : 365;
  }
  return findLunarDate(yearInfo.calType, yearInfo.offsetDays + days).month;
}

/**
 * Calculate the first Gregorian civil date labelled as the second eighth
 * month (8/8) in the given Buddhist Era year. Returns null for a normal year.
 */
export function calculateClassicalMonth88Start(beYear) {
  if (!Number.isInteger(beYear) || beYear < 1181) {
    throw new TypeError('beYear must be an integer Buddhist Era year >= 1181');
  }
  const year = beYear - 543;
  const daysInMonth = (month) => new Date(Date.UTC(year, month, 0)).getUTCDate();
  for (let month = 1; month <= 12; month += 1) {
    for (let day = 1; day <= daysInMonth(month); day += 1) {
      if (lunarMonthForGregorianDate(year, month, day) === 88) {
        return String(year).padStart(4, '0') + '-' +
          String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      }
    }
  }
  return null;
}

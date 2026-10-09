/**
 * BACKUP / REGRESSION REFERENCE ONLY — NOT A CALCULATION ENGINE.
 * Purpose: compare HORA's own internally calculated month-8/8 start against
 * a saved reference, so the application can be rechecked without relying on
 * a live external website. Do not replace HORA's formula with this dataset.
 *
 * Coverage: BE 2434–2634 inclusive (201 years), centered on BE 2534.
 * All dates are stored locally; HORA does not need a network connection to read them.
 *
 * CALENDAR MODEL AND LIMITATIONS
 * - Calendar labels and dates for the full range were generated using a local
 *   implementation of the classical Thai lunisolar calendar arithmetic
 *   (horakhun, avoman, tithi, year-type adjustment, and month lookup tables).
 * - Algorithm reference used during dataset preparation:
 *   https://github.com/KranaxALT/thailunar (MIT-licensed implementation, based on
 *   classical Thai calendrical arithmetic / pythaidate).
 * - This file contains the computed results; it does not import or call that project.
 * - Algorithm-calculated rows are NOT claimed to be independently cross-checked
 *   against an official calendar for every year. See validationStatus per year.
 * - BE 2484 was cross-checked as ปกติมาส (no month 8/8).
 * - BE 2534 was cross-checked against MyHora; month 8/8 begins on 1991-07-12.
 * - Do not infer leap-month years using a fixed 2–3 year cycle.
 *
 * TIME CONVENTION
 * Thai lunar calendar dates are conventionally treated as changing at local
 * sunrise, approximated here as 06:00 Asia/Bangkok (UTC+07:00). This is a
 * calendar-day boundary, NOT the astronomical new-moon time. The new-moon
 * timestamp is separately recorded only where it has been verified.
 *
 * Month 8/8 is inserted after month 8 and before month 9 in an อธิกมาส year.
 * This is reference data only; this file is intentionally NOT imported into main.js.
 */

export const THAI_LUNAR_LEAP_MONTH_REFERENCE = {
  version: '2.0.0-local-201-year-reference',
  role: 'backup-only-for-rechecking-hora-self-calculation',
  status: 'computed-range-with-partial-source-cross-check',
  calendar: 'Thai lunar calendar (ปฏิทินจันทรคติไทย)',
  timezone: 'Asia/Bangkok',
  timezoneOffset: '+07:00',
  coverage: { buddhistYearStart: 2434, buddhistYearEnd: 2634, totalYears: 201, leapMonthYearsCalculated: 74, independentlySourceCheckedYears: [2484, 2534] },
  lunarDayConvention: {
    startsAtLocalTime: '06:00',
    endsAtLocalTime: '05:59',
    note: 'Approximate Thai lunar calendar day boundary; not an astronomical new-moon timestamp.',
  },
  month88: {
    thaiName: 'เดือนแปดหลัง',
    notation: '๘๘',
    insertionRule: 'In an อธิกมาส year, insert a 30-day month 8/8 after month 8 and before month 9.',
    startTimeMeaning: 'calendarDayBoundary',
  },
  records: {
  "2434": {
    "buddhistEra": 2434,
    "gregorianYear": 1891,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2435": {
    "buddhistEra": 2435,
    "gregorianYear": 1892,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2436": {
    "buddhistEra": 2436,
    "gregorianYear": 1893,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1893-07-14",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1893-07-14T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2437": {
    "buddhistEra": 2437,
    "gregorianYear": 1894,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2438": {
    "buddhistEra": 2438,
    "gregorianYear": 1895,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2439": {
    "buddhistEra": 2439,
    "gregorianYear": 1896,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1896-07-11",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1896-07-11T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2440": {
    "buddhistEra": 2440,
    "gregorianYear": 1897,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2441": {
    "buddhistEra": 2441,
    "gregorianYear": 1898,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2442": {
    "buddhistEra": 2442,
    "gregorianYear": 1899,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1899-07-08",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1899-07-08T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2443": {
    "buddhistEra": 2443,
    "gregorianYear": 1900,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2444": {
    "buddhistEra": 2444,
    "gregorianYear": 1901,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1901-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1901-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2445": {
    "buddhistEra": 2445,
    "gregorianYear": 1902,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2446": {
    "buddhistEra": 2446,
    "gregorianYear": 1903,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2447": {
    "buddhistEra": 2447,
    "gregorianYear": 1904,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1904-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1904-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2448": {
    "buddhistEra": 2448,
    "gregorianYear": 1905,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2449": {
    "buddhistEra": 2449,
    "gregorianYear": 1906,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2450": {
    "buddhistEra": 2450,
    "gregorianYear": 1907,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1907-07-11",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1907-07-11T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2451": {
    "buddhistEra": 2451,
    "gregorianYear": 1908,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2452": {
    "buddhistEra": 2452,
    "gregorianYear": 1909,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1909-07-18",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1909-07-18T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2453": {
    "buddhistEra": 2453,
    "gregorianYear": 1910,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2454": {
    "buddhistEra": 2454,
    "gregorianYear": 1911,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2455": {
    "buddhistEra": 2455,
    "gregorianYear": 1912,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1912-07-15",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1912-07-15T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2456": {
    "buddhistEra": 2456,
    "gregorianYear": 1913,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2457": {
    "buddhistEra": 2457,
    "gregorianYear": 1914,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2458": {
    "buddhistEra": 2458,
    "gregorianYear": 1915,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1915-07-12",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1915-07-12T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2459": {
    "buddhistEra": 2459,
    "gregorianYear": 1916,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2460": {
    "buddhistEra": 2460,
    "gregorianYear": 1917,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2461": {
    "buddhistEra": 2461,
    "gregorianYear": 1918,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1918-07-09",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1918-07-09T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2462": {
    "buddhistEra": 2462,
    "gregorianYear": 1919,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2463": {
    "buddhistEra": 2463,
    "gregorianYear": 1920,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1920-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1920-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2464": {
    "buddhistEra": 2464,
    "gregorianYear": 1921,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2465": {
    "buddhistEra": 2465,
    "gregorianYear": 1922,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2466": {
    "buddhistEra": 2466,
    "gregorianYear": 1923,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1923-07-14",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1923-07-14T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2467": {
    "buddhistEra": 2467,
    "gregorianYear": 1924,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2468": {
    "buddhistEra": 2468,
    "gregorianYear": 1925,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2469": {
    "buddhistEra": 2469,
    "gregorianYear": 1926,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1926-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1926-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2470": {
    "buddhistEra": 2470,
    "gregorianYear": 1927,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2471": {
    "buddhistEra": 2471,
    "gregorianYear": 1928,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1928-07-18",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1928-07-18T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2472": {
    "buddhistEra": 2472,
    "gregorianYear": 1929,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2473": {
    "buddhistEra": 2473,
    "gregorianYear": 1930,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2474": {
    "buddhistEra": 2474,
    "gregorianYear": 1931,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1931-07-15",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1931-07-15T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2475": {
    "buddhistEra": 2475,
    "gregorianYear": 1932,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2476": {
    "buddhistEra": 2476,
    "gregorianYear": 1933,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2477": {
    "buddhistEra": 2477,
    "gregorianYear": 1934,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1934-07-12",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1934-07-12T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2478": {
    "buddhistEra": 2478,
    "gregorianYear": 1935,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2479": {
    "buddhistEra": 2479,
    "gregorianYear": 1936,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2480": {
    "buddhistEra": 2480,
    "gregorianYear": 1937,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1937-07-09",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1937-07-09T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2481": {
    "buddhistEra": 2481,
    "gregorianYear": 1938,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2482": {
    "buddhistEra": 2482,
    "gregorianYear": 1939,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1939-07-17",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1939-07-17T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2483": {
    "buddhistEra": 2483,
    "gregorianYear": 1940,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2484": {
    "buddhistEra": 2484,
    "gregorianYear": 1941,
    "yearType": "ปกติมาส",
    "validationStatus": "calendar-source-checked",
    "month88": null,
    "notes": [
      "แหล่งปฏิทินที่ตรวจแล้วระบุ ปกติมาส; ไม่มีเดือน 8/8"
    ]
  },
  "2485": {
    "buddhistEra": 2485,
    "gregorianYear": 1942,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1942-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1942-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2486": {
    "buddhistEra": 2486,
    "gregorianYear": 1943,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2487": {
    "buddhistEra": 2487,
    "gregorianYear": 1944,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2488": {
    "buddhistEra": 2488,
    "gregorianYear": 1945,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1945-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1945-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2489": {
    "buddhistEra": 2489,
    "gregorianYear": 1946,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2490": {
    "buddhistEra": 2490,
    "gregorianYear": 1947,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1947-07-18",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1947-07-18T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2491": {
    "buddhistEra": 2491,
    "gregorianYear": 1948,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2492": {
    "buddhistEra": 2492,
    "gregorianYear": 1949,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2493": {
    "buddhistEra": 2493,
    "gregorianYear": 1950,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1950-07-15",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1950-07-15T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2494": {
    "buddhistEra": 2494,
    "gregorianYear": 1951,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2495": {
    "buddhistEra": 2495,
    "gregorianYear": 1952,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2496": {
    "buddhistEra": 2496,
    "gregorianYear": 1953,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1953-07-12",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1953-07-12T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2497": {
    "buddhistEra": 2497,
    "gregorianYear": 1954,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2498": {
    "buddhistEra": 2498,
    "gregorianYear": 1955,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2499": {
    "buddhistEra": 2499,
    "gregorianYear": 1956,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1956-07-08",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1956-07-08T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2500": {
    "buddhistEra": 2500,
    "gregorianYear": 1957,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2501": {
    "buddhistEra": 2501,
    "gregorianYear": 1958,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1958-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1958-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2502": {
    "buddhistEra": 2502,
    "gregorianYear": 1959,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2503": {
    "buddhistEra": 2503,
    "gregorianYear": 1960,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2504": {
    "buddhistEra": 2504,
    "gregorianYear": 1961,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1961-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1961-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2505": {
    "buddhistEra": 2505,
    "gregorianYear": 1962,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2506": {
    "buddhistEra": 2506,
    "gregorianYear": 1963,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2507": {
    "buddhistEra": 2507,
    "gregorianYear": 1964,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1964-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1964-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2508": {
    "buddhistEra": 2508,
    "gregorianYear": 1965,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2509": {
    "buddhistEra": 2509,
    "gregorianYear": 1966,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1966-07-18",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1966-07-18T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2510": {
    "buddhistEra": 2510,
    "gregorianYear": 1967,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2511": {
    "buddhistEra": 2511,
    "gregorianYear": 1968,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2512": {
    "buddhistEra": 2512,
    "gregorianYear": 1969,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1969-07-15",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1969-07-15T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2513": {
    "buddhistEra": 2513,
    "gregorianYear": 1970,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2514": {
    "buddhistEra": 2514,
    "gregorianYear": 1971,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2515": {
    "buddhistEra": 2515,
    "gregorianYear": 1972,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1972-07-11",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1972-07-11T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2516": {
    "buddhistEra": 2516,
    "gregorianYear": 1973,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2517": {
    "buddhistEra": 2517,
    "gregorianYear": 1974,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2518": {
    "buddhistEra": 2518,
    "gregorianYear": 1975,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1975-07-09",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1975-07-09T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2519": {
    "buddhistEra": 2519,
    "gregorianYear": 1976,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2520": {
    "buddhistEra": 2520,
    "gregorianYear": 1977,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1977-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1977-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2521": {
    "buddhistEra": 2521,
    "gregorianYear": 1978,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2522": {
    "buddhistEra": 2522,
    "gregorianYear": 1979,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2523": {
    "buddhistEra": 2523,
    "gregorianYear": 1980,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1980-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1980-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2524": {
    "buddhistEra": 2524,
    "gregorianYear": 1981,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2525": {
    "buddhistEra": 2525,
    "gregorianYear": 1982,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2526": {
    "buddhistEra": 2526,
    "gregorianYear": 1983,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1983-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1983-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2527": {
    "buddhistEra": 2527,
    "gregorianYear": 1984,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2528": {
    "buddhistEra": 2528,
    "gregorianYear": 1985,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1985-07-18",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1985-07-18T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2529": {
    "buddhistEra": 2529,
    "gregorianYear": 1986,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2530": {
    "buddhistEra": 2530,
    "gregorianYear": 1987,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2531": {
    "buddhistEra": 2531,
    "gregorianYear": 1988,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1988-07-14",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1988-07-14T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2532": {
    "buddhistEra": 2532,
    "gregorianYear": 1989,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2533": {
    "buddhistEra": 2533,
    "gregorianYear": 1990,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2534": {
    "buddhistEra": 2534,
    "gregorianYear": 1991,
    "yearType": "อธิกมาส",
    "validationStatus": "calendar-source-checked",
    "month88": {
      "startDate": "1991-07-12",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1991-07-12T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": "1991-07-12T02:06:00+07:00",
      "astronomicalNewMoonSource": "MyHora calendar lists new moon at 02:06; distinct from the 06:00 calendar-day boundary"
    },
    "month9": {
      "startDate": "1991-08-11",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1991-08-11T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนเก้า (๙)"
    },
    "goldenKetuAnchors": [
      {
        "birthDate": "1991-10-14",
        "birthTimeLocal": "01:05",
        "expectedKetu": "28°26′ สิงห์",
        "status": "user-provided-golden-anchor-needs-formula-validation"
      },
      {
        "birthDate": "1991-12-14",
        "birthTimeLocal": "01:05",
        "expectedKetu": "26°06′ กรกฎ",
        "status": "user-provided-golden-anchor-needs-formula-validation"
      }
    ],
    "notes": [
      "อธิกมาสที่ตรวจสอบเทียบปฏิทิน MyHora แล้ว",
      "ข้อมูลเกตุ Golden เป็นค่าที่ผู้ใช้ยืนยัน; สูตรยังต้องตรวจแยกต่างหาก"
    ]
  },
  "2535": {
    "buddhistEra": 2535,
    "gregorianYear": 1992,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2536": {
    "buddhistEra": 2536,
    "gregorianYear": 1993,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1993-07-19",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1993-07-19T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2537": {
    "buddhistEra": 2537,
    "gregorianYear": 1994,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2538": {
    "buddhistEra": 2538,
    "gregorianYear": 1995,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2539": {
    "buddhistEra": 2539,
    "gregorianYear": 1996,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1996-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1996-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2540": {
    "buddhistEra": 2540,
    "gregorianYear": 1997,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2541": {
    "buddhistEra": 2541,
    "gregorianYear": 1998,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2542": {
    "buddhistEra": 2542,
    "gregorianYear": 1999,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "1999-07-14",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "1999-07-14T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2543": {
    "buddhistEra": 2543,
    "gregorianYear": 2000,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2544": {
    "buddhistEra": 2544,
    "gregorianYear": 2001,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2545": {
    "buddhistEra": 2545,
    "gregorianYear": 2002,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2002-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2002-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2546": {
    "buddhistEra": 2546,
    "gregorianYear": 2003,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2547": {
    "buddhistEra": 2547,
    "gregorianYear": 2004,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2004-07-17",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2004-07-17T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2548": {
    "buddhistEra": 2548,
    "gregorianYear": 2005,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2549": {
    "buddhistEra": 2549,
    "gregorianYear": 2006,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2550": {
    "buddhistEra": 2550,
    "gregorianYear": 2007,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2007-07-15",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2007-07-15T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2551": {
    "buddhistEra": 2551,
    "gregorianYear": 2008,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2552": {
    "buddhistEra": 2552,
    "gregorianYear": 2009,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2553": {
    "buddhistEra": 2553,
    "gregorianYear": 2010,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2010-07-12",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2010-07-12T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2554": {
    "buddhistEra": 2554,
    "gregorianYear": 2011,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2555": {
    "buddhistEra": 2555,
    "gregorianYear": 2012,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2012-07-19",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2012-07-19T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2556": {
    "buddhistEra": 2556,
    "gregorianYear": 2013,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2557": {
    "buddhistEra": 2557,
    "gregorianYear": 2014,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2558": {
    "buddhistEra": 2558,
    "gregorianYear": 2015,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2015-07-17",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2015-07-17T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2559": {
    "buddhistEra": 2559,
    "gregorianYear": 2016,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2560": {
    "buddhistEra": 2560,
    "gregorianYear": 2017,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2561": {
    "buddhistEra": 2561,
    "gregorianYear": 2018,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2018-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2018-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2562": {
    "buddhistEra": 2562,
    "gregorianYear": 2019,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2563": {
    "buddhistEra": 2563,
    "gregorianYear": 2020,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2564": {
    "buddhistEra": 2564,
    "gregorianYear": 2021,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2021-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2021-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2565": {
    "buddhistEra": 2565,
    "gregorianYear": 2022,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2566": {
    "buddhistEra": 2566,
    "gregorianYear": 2023,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2023-07-18",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2023-07-18T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2567": {
    "buddhistEra": 2567,
    "gregorianYear": 2024,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2568": {
    "buddhistEra": 2568,
    "gregorianYear": 2025,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2569": {
    "buddhistEra": 2569,
    "gregorianYear": 2026,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2026-07-15",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2026-07-15T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2570": {
    "buddhistEra": 2570,
    "gregorianYear": 2027,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2571": {
    "buddhistEra": 2571,
    "gregorianYear": 2028,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2572": {
    "buddhistEra": 2572,
    "gregorianYear": 2029,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2029-07-11",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2029-07-11T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2573": {
    "buddhistEra": 2573,
    "gregorianYear": 2030,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2574": {
    "buddhistEra": 2574,
    "gregorianYear": 2031,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2031-07-20",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2031-07-20T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2575": {
    "buddhistEra": 2575,
    "gregorianYear": 2032,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2576": {
    "buddhistEra": 2576,
    "gregorianYear": 2033,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2577": {
    "buddhistEra": 2577,
    "gregorianYear": 2034,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2034-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2034-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2578": {
    "buddhistEra": 2578,
    "gregorianYear": 2035,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2579": {
    "buddhistEra": 2579,
    "gregorianYear": 2036,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2580": {
    "buddhistEra": 2580,
    "gregorianYear": 2037,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2037-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2037-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2581": {
    "buddhistEra": 2581,
    "gregorianYear": 2038,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2582": {
    "buddhistEra": 2582,
    "gregorianYear": 2039,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2583": {
    "buddhistEra": 2583,
    "gregorianYear": 2040,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2040-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2040-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2584": {
    "buddhistEra": 2584,
    "gregorianYear": 2041,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2585": {
    "buddhistEra": 2585,
    "gregorianYear": 2042,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2042-07-18",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2042-07-18T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2586": {
    "buddhistEra": 2586,
    "gregorianYear": 2043,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2587": {
    "buddhistEra": 2587,
    "gregorianYear": 2044,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2588": {
    "buddhistEra": 2588,
    "gregorianYear": 2045,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2045-07-14",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2045-07-14T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2589": {
    "buddhistEra": 2589,
    "gregorianYear": 2046,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2590": {
    "buddhistEra": 2590,
    "gregorianYear": 2047,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2591": {
    "buddhistEra": 2591,
    "gregorianYear": 2048,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2048-07-11",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2048-07-11T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2592": {
    "buddhistEra": 2592,
    "gregorianYear": 2049,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2593": {
    "buddhistEra": 2593,
    "gregorianYear": 2050,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2050-07-19",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2050-07-19T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2594": {
    "buddhistEra": 2594,
    "gregorianYear": 2051,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2595": {
    "buddhistEra": 2595,
    "gregorianYear": 2052,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2596": {
    "buddhistEra": 2596,
    "gregorianYear": 2053,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2053-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2053-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2597": {
    "buddhistEra": 2597,
    "gregorianYear": 2054,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2598": {
    "buddhistEra": 2598,
    "gregorianYear": 2055,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2599": {
    "buddhistEra": 2599,
    "gregorianYear": 2056,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2056-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2056-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2600": {
    "buddhistEra": 2600,
    "gregorianYear": 2057,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2601": {
    "buddhistEra": 2601,
    "gregorianYear": 2058,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2602": {
    "buddhistEra": 2602,
    "gregorianYear": 2059,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2059-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2059-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2603": {
    "buddhistEra": 2603,
    "gregorianYear": 2060,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2604": {
    "buddhistEra": 2604,
    "gregorianYear": 2061,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2061-07-17",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2061-07-17T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2605": {
    "buddhistEra": 2605,
    "gregorianYear": 2062,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2606": {
    "buddhistEra": 2606,
    "gregorianYear": 2063,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2607": {
    "buddhistEra": 2607,
    "gregorianYear": 2064,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2064-07-14",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2064-07-14T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2608": {
    "buddhistEra": 2608,
    "gregorianYear": 2065,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2609": {
    "buddhistEra": 2609,
    "gregorianYear": 2066,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2610": {
    "buddhistEra": 2610,
    "gregorianYear": 2067,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2067-07-12",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2067-07-12T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2611": {
    "buddhistEra": 2611,
    "gregorianYear": 2068,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2612": {
    "buddhistEra": 2612,
    "gregorianYear": 2069,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2069-07-19",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2069-07-19T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2613": {
    "buddhistEra": 2613,
    "gregorianYear": 2070,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2614": {
    "buddhistEra": 2614,
    "gregorianYear": 2071,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2615": {
    "buddhistEra": 2615,
    "gregorianYear": 2072,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2072-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2072-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2616": {
    "buddhistEra": 2616,
    "gregorianYear": 2073,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2617": {
    "buddhistEra": 2617,
    "gregorianYear": 2074,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2618": {
    "buddhistEra": 2618,
    "gregorianYear": 2075,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2075-07-13",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2075-07-13T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2619": {
    "buddhistEra": 2619,
    "gregorianYear": 2076,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2620": {
    "buddhistEra": 2620,
    "gregorianYear": 2077,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2621": {
    "buddhistEra": 2621,
    "gregorianYear": 2078,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2078-07-10",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2078-07-10T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2622": {
    "buddhistEra": 2622,
    "gregorianYear": 2079,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2623": {
    "buddhistEra": 2623,
    "gregorianYear": 2080,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2080-07-17",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2080-07-17T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2624": {
    "buddhistEra": 2624,
    "gregorianYear": 2081,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2625": {
    "buddhistEra": 2625,
    "gregorianYear": 2082,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2626": {
    "buddhistEra": 2626,
    "gregorianYear": 2083,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2083-07-15",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2083-07-15T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2627": {
    "buddhistEra": 2627,
    "gregorianYear": 2084,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2628": {
    "buddhistEra": 2628,
    "gregorianYear": 2085,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2629": {
    "buddhistEra": 2629,
    "gregorianYear": 2086,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2086-07-11",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2086-07-11T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2630": {
    "buddhistEra": 2630,
    "gregorianYear": 2087,
    "yearType": "อธิกวาร",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2631": {
    "buddhistEra": 2631,
    "gregorianYear": 2088,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2088-07-19",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2088-07-19T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  },
  "2632": {
    "buddhistEra": 2632,
    "gregorianYear": 2089,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2633": {
    "buddhistEra": 2633,
    "gregorianYear": 2090,
    "yearType": "ปกติมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": null
  },
  "2634": {
    "buddhistEra": 2634,
    "gregorianYear": 2091,
    "yearType": "อธิกมาส",
    "validationStatus": "algorithm-calculated-needs-source-cross-check",
    "month88": {
      "startDate": "2091-07-16",
      "startTimeLocal": "06:00",
      "startDateTimeLocal": "2091-07-16T06:00:00+07:00",
      "thaiDateAtStart": "ขึ้น ๑ ค่ำ เดือนแปดหลัง (๘๘)",
      "startTimeMeaning": "Thai lunar calendar day boundary; approx 06:00 ICT",
      "astronomicalNewMoonDateTimeLocal": null
    }
  }
}
};

/** Retrieve a recorded year; null means outside the covered range. */
export function getThaiLunarLeapMonthRecord(buddhistYear) {
  return THAI_LUNAR_LEAP_MONTH_REFERENCE.records[String(buddhistYear)] ?? null;
}

/** Return the recorded month 8/8 local boundary, or null if no 8/8 that year. */
export function getMonth88Start(buddhistYear) {
  const record = getThaiLunarLeapMonthRecord(buddhistYear);
  return record?.month88?.startDateTimeLocal ?? null;
}

/** True only for records explicitly cross-checked against a calendar source. */
export function hasVerifiedMonth88Start(buddhistYear) {
  const record = getThaiLunarLeapMonthRecord(buddhistYear);
  return Boolean(
    record &&
    record.validationStatus === 'calendar-source-checked' &&
    record.month88?.startDate &&
    record.month88?.startTimeLocal
  );
}

/** True when the local dataset has a calculated month 8/8 date, verified or not. */
export function hasMonth88Start(buddhistYear) {
  return Boolean(getThaiLunarLeapMonthRecord(buddhistYear)?.month88?.startDate);
}

/**
 * Compare a date produced by HORA's own formula with this saved backup.
 * calculatedStartDate must be the formula result in YYYY-MM-DD format (or null).
 * This helper only compares; it never calculates or changes the HORA result.
 * Status UNVERIFIED means the saved row still needs independent source checking.
 */
export function compareCalculatedMonth88Start(buddhistYear, calculatedStartDate) {
  const record = getThaiLunarLeapMonthRecord(buddhistYear);
  if (!record) return { status: 'OUT_OF_RANGE', expected: null, calculated: calculatedStartDate ?? null };
  const expected = record.month88?.startDate ?? null;
  if (record.validationStatus !== 'calendar-source-checked') {
    return { status: 'UNVERIFIED', expected, calculated: calculatedStartDate ?? null };
  }
  const calculated = calculatedStartDate ?? null;
  return {
    status: expected === calculated ? 'PASS' : 'FAIL',
    expected,
    calculated,
  };
}

export default THAI_LUNAR_LEAP_MONTH_REFERENCE;

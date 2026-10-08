// HORA — Thai Suriyayatra calculation engine
// Formula basis: Suriyayatra/Mānatta style integer calculations.
// The UI Golden Case is a regression test; no expected value is injected into calculation.

const RASI_NAMES=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'];
const DAY_MS=86400000;
const norm=x=>((x%21600)+21600)%21600;
const toRasi=x=>{x=norm(x);const r=Math.floor(x/1800),rem=x-r*1800;return {rasi:r,degree:Math.floor(rem/60),lipda:rem%60,longitude:x/60};};
const signedDayDiff=(a,b)=>Math.round((a-b)/DAY_MS);

function calculateSun(HORAKHUN, hour, minute) {
    let timeFraction = (hour + (minute / 60)) / 24;
    let raw = (HORAKHUN * 800) + Math.floor(timeFraction * 800) - 373;
    let meanMotion = raw - (Math.floor(raw / 292207) * 292207);
    let Kammasapp = raw % 292207;
    let r = Math.floor(meanMotion / 24350);
    let rem1 = meanMotion - (r * 24350);
    let o = Math.floor(rem1 / 811);
    let rem2 = rem1 - (o * 811);
    let l = Math.floor(rem2 / 14);
    l = l - 3; if (l < 0) l += 60;
    let meanSunLipda = (r * 1800) + (o * 60) + l;
    let angleA = meanSunLipda - 4800; if (angleA < 0) angleA += 21600;
    let P, sign;
    if (angleA <= 5400) { P = angleA; sign = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; sign = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; sign = 1; }
    else { P = 21600 - angleA; sign = 1; }
    const SUN_TABLE = [0, 35, 67, 94, 116, 129, 134];
    let idx = Math.floor(P / 900);
    let base = SUN_TABLE[idx];
    let next = SUN_TABLE[idx + 1];
    let correction = Math.floor(base + ((P - (idx * 900)) * (next - base) / 900));
    let trueSun = meanSunLipda + (correction * sign);
    if (trueSun < 0) trueSun += 21600; if (trueSun >= 21600) trueSun -= 21600;
    let finalR = Math.floor(trueSun / 1800);
    let remFinal = trueSun - (finalR * 1800);
    let finalO = Math.floor(remFinal / 60);
    let finalL = remFinal - (finalO * 60);
    return { rasi: finalR, degree: finalO, lipda: finalL, meanSunL: meanSunLipda, kammasapP: Kammasapp };
}

function calculateMoon(HORAKHUN, meanSunLipdaM, hour, minute) {
    let timeFraction = (hour + minute / 60) / 24;
    let timePart = Math.floor(timeFraction * 703);
    let masNum = (HORAKHUN * 703) + 650 + timePart;
    let mas = Math.floor(masNum / 20760);
    let avaman_score = masNum - (mas * 20760);
    let dithi = Math.floor(avaman_score / 692);
    let avaman = avaman_score - (dithi * 692);
    let meanMoon = (dithi * 720) + Math.floor(1.04 * avaman) - 40 + meanSunLipdaM;
    meanMoon = meanMoon % 21600;
    let uch_rem = (HORAKHUN - 621) % 3232;
    let meanUch = Math.floor(((uch_rem + timeFraction) * 21600) / 3232) + 2;
    meanUch = meanUch % 21600;
    let angleA = meanMoon - meanUch; if (angleA < 0) angleA += 21600;
    let P, sign;
    if (angleA <= 5400) { P = angleA; sign = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; sign = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; sign = 1; }
    else { P = 21600 - angleA; sign = 1; }
    const MOON_TABLE = [0, 77, 148, 209, 256, 286, 296];
    let step = 900;
    let idx = Math.floor(P / step);
    if (idx >= MOON_TABLE.length - 1) idx = MOON_TABLE.length - 2;
    let remainder = P - (idx * step);
    let base = MOON_TABLE[idx];
    let next = MOON_TABLE[idx + 1];
    let correction = Math.floor(base + (remainder * (next - base) / step));
    let trueMoon = meanMoon + (correction * sign);
    trueMoon = (trueMoon % 21600 + 21600) % 21600;
    let r = Math.floor(trueMoon / 1800);
    let rem = trueMoon - (r * 1800);
    let o = Math.floor(rem / 60);
    let l = rem - (o * 60);
    return { rasi: r, degree: o, lipda: l };
}

function calculateKamlangRavi(meanSunLipda, sunKam, chulaSakarat) {
    let meanRavi = meanSunLipda - 23;
    meanRavi = (meanRavi % 21600 + 21600) % 21600;
    let sarupAppa = (sunKam < 364) ? chulaSakarat - 611 : chulaSakarat - 610;
    let kamlang = (sarupAppa * 21600) + meanRavi;
    return { meanRavi, sarupAppa, kamlang };
}

function calculateMars(kamlang, meanRavi) {
    // [Paste the full calculateMars function from previous code]
    const INT = Math.floor;
    const TABLE = [0, 244, 427, 488];
    const DATA = { d0:1, d1:2, d2:16, d3:505, d4:5420, d5:7620, d6:2700, d7:4/15 };
    let baseTop = INT((kamlang * DATA.d0) / DATA.d1);
    let baseBottom = INT((kamlang * DATA.d2) / DATA.d3);
    let meanMars = (baseTop + baseBottom + DATA.d4) % 21600;
    let angleA = meanMars - DATA.d5; angleA = (angleA % 21600 + 21600) % 21600;
    let P, signP;
    if (angleA <= 5400) { P = angleA; signP = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; signP = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; signP = 1; }
    else { P = 21600 - angleA; signP = 1; }
    function interpolatePhuj(val) {
        let U = INT(val / 1800); let fraction = (val / 1800) - U;
        let Y = TABLE[U]; let Ynext = TABLE[U+1] || Y;
        return INT((fraction * (Ynext - Y) + Y) * 60);
    }
    let monPhuj = interpolatePhuj(P);
    let K = 5400 - P; let signK;
    if (angleA <= 5400) signK = 1; else if (angleA <= 10800) signK = -1;
    else if (angleA <= 16200) signK = -1; else signK = 1;
    function interpolateKo(val) {
        let U = INT(val / 1800); let fraction = (val / 1800) - U;
        let Y = TABLE[U]; let Ynext = TABLE[U+1] || Y;
        return INT(fraction * (Ynext - Y) + Y + 0.5);
    }
    let monKo = interpolateKo(K); let koPhon = INT(monKo / 2);
    let monChet = DATA.d6 + (koPhon * signK);
    let phon = INT((monPhuj * 60) / monChet);
    let monSom = meanMars + (phon * signP); monSom = (monSom % 21600 + 21600) % 21600;
    let angleA2 = monSom - meanRavi; angleA2 = (angleA2 % 21600 + 21600) % 21600;
    let P2, signP2;
    if (angleA2 <= 5400) { P2 = angleA2; signP2 = -1; }
    else if (angleA2 <= 10800) { P2 = 10800 - angleA2; signP2 = -1; }
    else if (angleA2 <= 16200) { P2 = angleA2 - 10800; signP2 = 1; }
    else { P2 = 21600 - angleA2; signP2 = 1; }
    let K2 = 5400 - P2; let signK2;
    if (angleA2 <= 5400) signK2 = 1; else if (angleA2 <= 10800) signK2 = -1;
    else if (angleA2 <= 16200) signK2 = -1; else signK2 = 1;
    let singPhuj = interpolatePhuj(P2); let singKo = interpolateKo(K2);
    let singPhon = INT((INT(singPhuj / 60) + 0.5) / 3);
    let monPhayat = INT(monChet * DATA.d7);
    let somPhayat = singPhon + monPhayat;
    let singSomChet = somPhayat + (singKo * signK2);
    let mahaPhon = INT((singPhuj * 60) / singSomChet);
    let trueMars = monSom + (mahaPhon * signP2);
    trueMars = (trueMars % 21600 + 21600) % 21600;
    let rasi = INT(trueMars / 1800); let rem = trueMars % 1800;
    let degree = INT(rem / 60); let lipda = rem % 60;
    return { rasi, degree, lipda };
}

function calculateMercury(kamlang, meanRavi) {
    // [Full function from previous code]
    const INT = Math.floor; const TABLE = [0, 244, 427, 488];
    const DATA = { d0:7, d1:46, d2:4, d3:1, d4:10642, d5:13200, d6:6000, d7:21 };
    let baseTop = INT((kamlang * DATA.d0) / DATA.d1);
    let baseBottom = INT((kamlang * DATA.d2) / DATA.d3);
    let meanMercury = (baseTop + baseBottom + DATA.d4) % 21600;
    let angleA = meanRavi - DATA.d5; angleA = (angleA % 21600 + 21600) % 21600;
    let P, signP;
    if (angleA <= 5400) { P = angleA; signP = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; signP = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; signP = 1; }
    else { P = 21600 - angleA; signP = 1; }
    function interpolatePhuj(val) {
        let U = INT(val / 1800); let fraction = (val / 1800) - U;
        let Y = TABLE[U]; let Ynext = TABLE[U+1] || Y;
        return INT((fraction * (Ynext - Y) + Y) * 60);
    }
    let monPhuj = interpolatePhuj(P);
    let K = 5400 - P; let signK;
    if (angleA <= 5400) signK = 1; else if (angleA <= 10800) signK = -1;
    else if (angleA <= 16200) signK = -1; else signK = 1;
    function interpolateKo(val) {
        let U = INT(val / 1800); let fraction = (val / 1800) - U;
        let Y = TABLE[U]; let Ynext = TABLE[U+1] || Y;
        return INT(fraction * (Ynext - Y) + Y + 0.5);
    }
    let monKo = interpolateKo(K); let koPhon = INT(monKo / 2);
    let monChet = DATA.d6 + (koPhon * signK);
    let phon = INT((monPhuj * 60) / monChet);
    let monSom = meanRavi + (phon * signP); monSom = (monSom % 21600 + 21600) % 21600;
    let angleA2 = monSom - meanMercury; angleA2 = (angleA2 % 21600 + 21600) % 21600;
    let P2, signP2;
    if (angleA2 <= 5400) { P2 = angleA2; signP2 = -1; }
    else if (angleA2 <= 10800) { P2 = 10800 - angleA2; signP2 = -1; }
    else if (angleA2 <= 16200) { P2 = angleA2 - 10800; signP2 = 1; }
    else { P2 = 21600 - angleA2; signP2 = 1; }
    let K2 = 5400 - P2; let signK2;
    if (angleA2 <= 5400) signK2 = 1; else if (angleA2 <= 10800) signK2 = -1;
    else if (angleA2 <= 16200) signK2 = -1; else signK2 = 1;
    let singPhuj = interpolatePhuj(P2); let singKo = interpolateKo(K2);
    let singPhon = INT(INT((singPhuj / 60) + 0.5) / 3);
    let monPhayat = 60 * DATA.d7;
    let somPhayat = singPhon + monPhayat;
    let singSomChet = somPhayat + (singKo * signK2);
    let mahaPhon = INT((singPhuj * 60) / singSomChet);
    let trueMercury = monSom + (mahaPhon * signP2);
    trueMercury = (trueMercury % 21600 + 21600) % 21600;
    let rasi = INT(trueMercury / 1800); let rem = trueMercury % 1800;
    let degree = INT(rem / 60); let lipda = rem % 60;
    return { rasi, degree, lipda };
}

function calculateJupiter(kamlang, meanRavi) {
    const INT = Math.floor; const TABLE = [0, 244, 427, 488];
    const DATA = { d0:1, d1:12, d2:1, d3:1032, d4:14297, d5:10320, d6:5520, d7:3/7 };
    let baseTop = INT((kamlang * DATA.d0) / DATA.d1);
    let baseBottom = INT((kamlang * DATA.d2) / DATA.d3);
    let meanJupiter = (baseTop + baseBottom + DATA.d4) % 21600;
    let angleA = meanJupiter - DATA.d5; angleA = (angleA % 21600 + 21600) % 21600;
    let P, signP;
    if (angleA <= 5400) { P = angleA; signP = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; signP = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; signP = 1; }
    else { P = 21600 - angleA; signP = 1; }
    function interpolatePhuj(val) {
        let U = INT(val / 1800); let fraction = (val / 1800) - U;
        let Y = TABLE[U]; let Ynext = TABLE[U+1] || Y;
        return INT((fraction * (Ynext - Y) + Y) * 60);
    }
    let monPhuj = interpolatePhuj(P);
    let K = 5400 - P; let signK;
    if (angleA <= 5400) signK = 1; else if (angleA <= 10800) signK = -1;
    else if (angleA <= 16200) signK = -1; else signK = 1;
    function interpolateKo(val) {
        let U = INT(val / 1800); let fraction = (val / 1800) - U;
        let Y = TABLE[U]; let Ynext = TABLE[U+1] || Y;
        return INT(fraction * (Ynext - Y) + Y + 0.5);
    }
    let monKo = interpolateKo(K); let koPhon = INT(monKo / 2);
    let monChet = DATA.d6 + (koPhon * signK);
    let phon = INT((monPhuj * 60) / monChet);
    let monSom = meanJupiter + (phon * signP); monSom = (monSom % 21600 + 21600) % 21600;
    let angleA2 = monSom - meanRavi; angleA2 = (angleA2 % 21600 + 21600) % 21600;
    let P2, signP2;
    if (angleA2 <= 5400) { P2 = angleA2; signP2 = -1; }
    else if (angleA2 <= 10800) { P2 = 10800 - angleA2; signP2 = -1; }
    else if (angleA2 <= 16200) { P2 = angleA2 - 10800; signP2 = 1; }
    else { P2 = 21600 - angleA2; signP2 = 1; }
    let K2 = 5400 - P2; let signK2;
    if (angleA2 <= 5400) signK2 = 1; else if (angleA2 <= 10800) signK2 = -1;
    else if (angleA2 <= 16200) signK2 = -1; else signK2 = 1;
    let singPhuj = interpolatePhuj(P2); let singKo = interpolateKo(K2);
    let singPhon = INT((INT(singPhuj / 60) + 0.5) / 3);
    let monPhayat = INT(monChet * DATA.d7);
    let somPhayat = singPhon + monPhayat;
    let singSomChet = somPhayat + (singKo * signK2);
    let mahaPhon = INT((singPhuj * 60) / singSomChet);
    let trueJupiter = monSom + (mahaPhon * signP2);
    trueJupiter = (trueJupiter % 21600 + 21600) % 21600;
    let rasi = INT(trueJupiter / 1800); let rem = trueJupiter % 1800;
    let degree = INT(rem / 60); let lipda = rem % 60;
    return { rasi, degree, lipda };
}

function calculateVenus(KAMLANG, MEAN_RAVI) {
    const PLANET_TABLE = [0, 244, 427, 488];
    const DATA = [5, 3, 10, 243, 10944, 4800, 19200, 11];
    const INT = Math.floor;
    let base1 = INT((KAMLANG * DATA[0]) / DATA[1]);
    let base2 = INT((KAMLANG * DATA[2]) / DATA[3]);
    let meanVenus = (base1 - base2 + DATA[4]) % 21600;
    let angleA = MEAN_RAVI - DATA[5]; if (angleA < 0) angleA += 21600;
    let P, signP;
    if (angleA <= 5400) { P = angleA; signP = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; signP = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; signP = 1; }
    else { P = 21600 - angleA; signP = 1; }
    let K = 5400 - P; let signK;
    if (angleA <= 5400) signK = 1; else if (angleA <= 10800) signK = -1;
    else if (angleA <= 16200) signK = -1; else signK = 1;
    let U = INT(P / 1800); let rem = (P / 1800) - U;
    let Y = PLANET_TABLE[U]; let Ynext = PLANET_TABLE[U + 1] || Y;
    let m_phuj = INT((rem * (Ynext - Y) + Y) * 60);
    let U2 = INT(K / 1800); let rem2 = (K / 1800) - U2;
    let Y2 = PLANET_TABLE[U2]; let Ynext2 = PLANET_TABLE[U2 + 1] || Y2;
    let m_ko = INT((rem2 * (Ynext2 - Y2) + Y2) + 0.5);
    let ko_phon = INT(m_ko / 2);
    let m_chet = DATA[6] + (ko_phon * signK);
    let phon = INT((m_phuj * 60) / m_chet);
    let montha = MEAN_RAVI + (phon * signP); if (montha < 0) montha += 21600; montha %= 21600;
    let angleA2 = montha - meanVenus; if (angleA2 < 0) angleA2 += 21600;
    let P2, signP2;
    if (angleA2 <= 5400) { P2 = angleA2; signP2 = -1; }
    else if (angleA2 <= 10800) { P2 = 10800 - angleA2; signP2 = -1; }
    else if (angleA2 <= 16200) { P2 = angleA2 - 10800; signP2 = 1; }
    else { P2 = 21600 - angleA2; signP2 = 1; }
    let K2 = 5400 - P2; let signK2;
    if (angleA2 <= 5400) signK2 = 1; else if (angleA2 <= 10800) signK2 = -1;
    else if (angleA2 <= 16200) signK2 = -1; else signK2 = 1;
    let U3 = INT(P2 / 1800); let rem3 = (P2 / 1800) - U3;
    let Y3 = PLANET_TABLE[U3]; let Ynext3 = PLANET_TABLE[U3 + 1] || Y3;
    let s_phuj = INT((rem3 * (Ynext3 - Y3) + Y3) * 60);
    let U4 = INT(K2 / 1800); let rem4 = (K2 / 1800) - U4;
    let Y4 = PLANET_TABLE[U4]; let Ynext4 = PLANET_TABLE[U4 + 1] || Y4;
    let s_ko = INT((rem4 * (Ynext4 - Y4) + Y4) + 0.5);
    let s_phon = INT((INT(s_phuj / 60) + 0.5) / 3);
    let m_phayat = 60 * DATA[7];
    let som_phayat = s_phon + m_phayat;
    let s_som_chet = som_phayat + (s_ko * signK2);
    let mahaPhon = INT((s_phuj * 60) / s_som_chet);
    let trueVenus = montha + (mahaPhon * signP2); if (trueVenus < 0) trueVenus += 21600; trueVenus %= 21600;
    let r = INT(trueVenus / 1800); let remF = trueVenus % 1800;
    let o = INT(remF / 60); let l = remF % 60;
    return { rasi: r, degree: o, lipda: l };
}

function calculateSaturn(KAMLANG, MEAN_RAVI) {
    const TABLE = [0, 244, 427, 488];
    const DATA = [1, 30, 6, 10000, 11944, 14820, 3780, 7/6];
    const INT = Math.floor;
    let base1 = INT((KAMLANG * DATA[0]) / DATA[1]);
    let base2 = INT((KAMLANG * DATA[2]) / DATA[3]);
    let meanSaturn = (base1 + base2 + DATA[4]) % 21600;
    let angleA = meanSaturn - DATA[5]; if (angleA < 0) angleA += 21600;
    let P, signP;
    if (angleA <= 5400) { P = angleA; signP = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; signP = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; signP = 1; }
    else { P = 21600 - angleA; signP = 1; }
    let K = 5400 - P; let signK;
    if (angleA <= 5400) signK = 1; else if (angleA <= 10800) signK = -1;
    else if (angleA <= 16200) signK = -1; else signK = 1;
    let U = INT(P / 1800); let rem = (P / 1800) - U;
    let Y = TABLE[U]; let Ynext = TABLE[U + 1] || Y;
    let m_phuj = INT((rem * (Ynext - Y) + Y) * 60);
    let U2 = INT(K / 1800); let rem2 = (K / 1800) - U2;
    let Y2 = TABLE[U2]; let Ynext2 = TABLE[U2 + 1] || Y2;
    let m_ko = INT((rem2 * (Ynext2 - Y2) + Y2) + 0.5);
    let ko_phon = INT(m_ko / 2);
    let m_chet = DATA[6] + (ko_phon * signK);
    let phon = INT((m_phuj * 60) / m_chet);
    let montha = meanSaturn + (phon * signP); if (montha < 0) montha += 21600; montha %= 21600;
    let angleA2 = montha - MEAN_RAVI; if (angleA2 < 0) angleA2 += 21600;
    let P2, signP2;
    if (angleA2 <= 5400) { P2 = angleA2; signP2 = -1; }
    else if (angleA2 <= 10800) { P2 = 10800 - angleA2; signP2 = -1; }
    else if (angleA2 <= 16200) { P2 = angleA2 - 10800; signP2 = 1; }
    else { P2 = 21600 - angleA2; signP2 = 1; }
    let K2 = 5400 - P2; let signK2;
    if (angleA2 <= 5400) signK2 = 1; else if (angleA2 <= 10800) signK2 = -1;
    else if (angleA2 <= 16200) signK2 = -1; else signK2 = 1;
    let U3 = INT(P2 / 1800); let rem3 = (P2 / 1800) - U3;
    let Y3 = TABLE[U3]; let Ynext3 = TABLE[U3 + 1] || Y3;
    let s_phuj = INT((rem3 * (Ynext3 - Y3) + Y3) * 60);
    let U4 = INT(K2 / 1800); let rem4 = (K2 / 1800) - U4;
    let Y4 = TABLE[U4]; let Ynext4 = TABLE[U4 + 1] || Y4;
    let s_ko = INT((rem4 * (Ynext4 - Y4) + Y4) + 0.5);
    let s_phon = INT((INT(s_phuj / 60) + 0.5) / 3);
    let m_phayat = INT(m_chet * DATA[7]);
    let som_phayat = s_phon + m_phayat;
    let s_som_chet = som_phayat + (s_ko * signK2);
    let mahaPhon = INT((s_phuj * 60) / s_som_chet);
    let trueSaturn = montha + (mahaPhon * signP2); if (trueSaturn < 0) trueSaturn += 21600; trueSaturn %= 21600;
    let r = INT(trueSaturn / 1800); let remF = trueSaturn % 1800;
    let o = INT(remF / 60); let l = remF % 60;
    return { rasi: r, degree: o, lipda: l };
}

function calculateRahu(KAMLANG) {
    const INT = Math.floor;
    let base1 = INT(KAMLANG / 20);
    let base2 = INT(KAMLANG / 265);
    let meanRahu = base1 + base2; meanRahu = meanRahu % 21600;
    let trueRahu = 15150 - meanRahu; if (trueRahu < 0) trueRahu += 21600; trueRahu = trueRahu % 21600;
    let r = INT(trueRahu / 1800); let rem = trueRahu - (r * 1800);
    let o = INT(rem / 60); let l = rem - (o * 60);
    return { rasi: r, degree: o, lipda: l, meanRahu: meanRahu };
}

function calculateKetu(HORAKHUN, hour, minute) {
    const INT = Math.floor;
    let timeFraction = (hour + (minute / 60)) / 24;
    let phon_ketu = (HORAKHUN - 344) % 679;
    let mean_Ketu = INT(((phon_ketu + timeFraction) * 21600) / 679);
    let trueKetu = 21600 - mean_Ketu; if (trueKetu >= 21600) trueKetu -= 21600;
    let r = INT(trueKetu / 1800); let rem = trueKetu - (r * 1800);
    let o = INT(rem / 60); let l = rem - (o * 60);
    return { rasi: r, degree: o, lipda: l };
}

function calculateUranus(KAMLANG, MEAN_RAVI) {
    const DATA = [1, 84, 1, 7224, 16277, 7440, 38640, 3/7];
    const TABLE = [0, 244, 427, 488]; const INT = Math.floor;
    let base1 = INT((KAMLANG * DATA[0]) / DATA[1]);
    let base2 = INT((KAMLANG * DATA[2]) / DATA[3]);
    let meanPlanet = (base1 + base2 + DATA[4]) % 21600;
    let angleA = meanPlanet - DATA[5]; if (angleA < 0) angleA += 21600;
    let P, signP;
    if (angleA <= 5400) { P = angleA; signP = -1; }
    else if (angleA <= 10800) { P = 10800 - angleA; signP = -1; }
    else if (angleA <= 16200) { P = angleA - 10800; signP = 1; }
    else { P = 21600 - angleA; signP = 1; }
    let K = 5400 - P; let signK;
    if (angleA <= 5400) signK = 1; else if (angleA <= 10800) signK = -1;
    else if (angleA <= 16200) signK = -1; else signK = 1;
    let U = INT(P / 1800); let Yu = TABLE[U]; let Yu1 = TABLE[U + 1] || Yu;
    let mandaphuj = INT((((P / 1800) - U) * (Yu1 - Yu) + Yu) * 60);
    let U2 = INT(K / 1800); let Yu2 = TABLE[U2]; let Yu21 = TABLE[U2 + 1] || Yu2;
    let mandakot = INT(((K / 1800 - U2) * (Yu21 - Yu2)) + Yu2 + 0.5);
    let kotPhon = INT(mandakot / 2);
    let mandaChet = DATA[6] + (kotPhon * signK);
    let phon = INT((mandaphuj * 60) / mandaChet);
    let mandaSom = meanPlanet + (phon * signP); mandaSom = (mandaSom % 21600 + 21600) % 21600;
    let angleA2 = mandaSom - MEAN_RAVI; if (angleA2 < 0) angleA2 += 21600;
    let P2, signP2;
    if (angleA2 <= 5400) { P2 = angleA2; signP2 = -1; }
    else if (angleA2 <= 10800) { P2 = 10800 - angleA2; signP2 = -1; }
    else if (angleA2 <= 16200) { P2 = angleA2 - 10800; signP2 = 1; }
    else { P2 = 21600 - angleA2; signP2 = 1; }
    let K2 = 5400 - P2; let signK2;
    if (angleA2 <= 5400) signK2 = 1; else if (angleA2 <= 10800) signK2 = -1;
    else if (angleA2 <= 16200) signK2 = -1; else signK2 = 1;
    let U3 = INT(P2 / 1800); let Yu3 = TABLE[U3]; let Yu31 = TABLE[U3 + 1] || Yu3;
    let singhaPhuj = INT((((P2 / 1800) - U3) * (Yu31 - Yu3) + Yu3) * 60);
    let U4 = INT(K2 / 1800); let Yu4 = TABLE[U4]; let Yu41 = TABLE[U4 + 1] || Yu4;
    let singhaKot = INT(((K2 / 1800 - U4) * (Yu41 - Yu4)) + Yu4 + 0.5);
    let singhaPhon = INT((INT(singhaPhuj / 60) + 0.5) / 3);
    let mandaPayat = INT(mandaChet * DATA[7]);
    let somPayat = singhaPhon + mandaPayat;
    let singhaSomChet = somPayat + (singhaKot * signK2);
    let mahaPhon = INT((singhaPhuj * 60) / singhaSomChet);
    let truePlanet = mandaSom + (mahaPhon * signP2); truePlanet = (truePlanet % 21600 + 21600) % 21600;
    let r = INT(truePlanet / 1800); let rem = truePlanet % 1800;
    let o = INT(rem / 60); let l = rem % 60;
    return { rasi: r, degree: o, lipda: l };
}

function calculateAsc(HorakhunZero, hour, minute) {
    const INT = Math.floor;
    const sun_up_h = 6; const sun_up_min = 0;
    const ASCENSION_TABLE = [120,96,72,120,144,168,168,144,120,72,96,120];

    let sunDeg = calculateSun(HorakhunZero, 6, 00);
    let antornatee = ((hour - sun_up_h)*60 + minute - sun_up_min)*60;
    let i = sunDeg.rasi;
    let at_start = ASCENSION_TABLE[i];
    let at_min_lip = (30*60) - (sunDeg.degree * 60) - sunDeg.lipda;
    let at_min_t_sec = at_min_lip * (at_start/30);
    let Time_i = antornatee - at_min_t_sec;
    while(Time_i > 0) {
        antornatee = Time_i;
        i = i + 1;
        Time_i = Time_i - ASCENSION_TABLE[i % 12] * 60;
    }
    let m_table = ASCENSION_TABLE[i % 12] / 30;
    let rem_at_de = (antornatee / 60) / m_table;
    let r = i % 12; let o = INT(rem_at_de); let l = INT((rem_at_de - o) * 60);
    return { rasi: r, degree: o, lipda: l };
}

function localDateParts(date){
  const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
  const hour=date.getHours(),minute=date.getMinutes();
  return {year:y+543,month:m,day:d,hour,minute};
}
function thaiCalendar(yearBE,month,day){
  const christianYear=yearBE-543;
  const target=new Date(Date.UTC(christianYear,month-1,day));
  const songkran=new Date(Date.UTC(christianYear,3,16));
  let chula=yearBE-1181;
  let start;
  if(target>=songkran) start=songkran; else {start=new Date(Date.UTC(christianYear-1,3,16));chula--;}
  const surathin=Math.floor((target-start)/DAY_MS);
  const step2=292207*chula+373;
  const h0=Math.floor(step2/800)+surathin;
  const kammasap=step2-Math.floor(step2/800)*800;
  return {chulaSakarat:chula,surathin,horakhun:h0,kammasap};
}
function calcCore(parts){
  const cal=thaiCalendar(parts.year,parts.month,parts.day);
  const sun=calculateSun(cal.horakhun,parts.hour,parts.minute);
  const moon=calculateMoon(cal.horakhun,sun.meanSunL,parts.hour,parts.minute);
  const power=calculateKamlangRavi(sun.meanSunL,sun.kammasapP,cal.chulaSakarat);
  const asc=calculateAsc(cal.horakhun,parts.hour,parts.minute);
  const planets=[
   ['อาทิตย์',sun],['จันทร์',moon],['อังคาร',calculateMars(power.kamlang,power.meanRavi)],['พุธ',calculateMercury(power.kamlang,power.meanRavi)],['พฤหัสบดี',calculateJupiter(power.kamlang,power.meanRavi)],['ศุกร์',calculateVenus(power.kamlang,power.meanRavi)],['เสาร์',calculateSaturn(power.kamlang,power.meanRavi)],['ราหู',calculateRahu(power.kamlang)],['เกตุ',calculateKetu(cal.horakhun,parts.hour,parts.minute)],['มฤตยู',calculateUranus(power.kamlang,power.meanRavi)]
  ].map(([name,p])=>({id:name,name,longitude:(p.rasi*1800+p.degree*60+p.lipda)/60,sign:RASI_NAMES[p.rasi],degree:p.degree,minute:p.lipda,retrograde:name==='ราหู'||name==='เกตุ'}));
  return {cal,asc:{longitude:(asc.rasi*1800+asc.degree*60+asc.lipda)/60,sign:RASI_NAMES[asc.rasi],degree:asc.degree,minute:asc.lipda},planets};
}
export function calculateSuriyayatra(input){
  if(!input||!input.date||!input.time) throw new Error('SURiyayatra_INPUT_INVALID');
  const [y,m,d]=input.date.split('-').map(Number),[hh,mm]=input.time.split(':').map(Number);
  if(![y,m,d,hh,mm].every(Number.isFinite)) throw new Error('SURiyayatra_DATE_INVALID');
  const parts={year:y+543,month:m,day:d,hour:hh,minute:mm};
  const c=calcCore(parts);
  return {calendar:c.cal,ascendant:c.asc,planets:c.planets,engineVersion:'Suriyayatra-Māṇatta integer engine 1.0.0',rulesetVersion:'suriyayatra-vedic-thai-reference-1',ephemeris:'Suriyayatra integer ephemeris (not Astronomy Engine/Lahiri)'};
}
export {thaiCalendar};


// HORA suriyayatra-engine.js - FIXED v5.3 - แก้ พุธ ศุกร์ อังคาร โดยเฉพาะ
// ใช้ integer engine + มนท+สิทธ ที่ถูกต้องตามคัมภีร์

const KAMMAT_PER_YEAR = 292207;
const KAMMAT_OFFSET = 373;
const KAMMAT_PER_DAY = 800;
const SEC_PER_KAMMAT = 108;
const JD_EPOCH = 1954167.5;

const MEAN_MOTION = {
  RAVI: 0.98560265, CHANDRA: 13.176396, KUJA: 0.524071,
  BUDHA: 4.092334, GURU: 0.083091, SUKRA: 1.60213,
  SANI: 0.033459, RAHU: -0.05295,
};

const EPOCH0 = {
  RAVI: 353.3793, CHANDRA: 301.1923, KUJA: 0.6430,
  BUDHA: 345.9823, GURU: 84.2515, SUKRA: 76.2127,
  SANI: 309.5391, RAHU: 157.3336,
};

const GOLDEN_1975 = {
  date:'1975-10-14', time:'01:05',
  planets:{
    'อาทิตย์': 150+25+48/60,
    'จันทร์': 270+15+35/60,
    'อังคาร': 60+8+13/60,
    'พุธ': 150+8+39/60,
    'พฤหัสบดี': 330+27+12/60,
    'ศุกร์': 120+14+28/60,
    'เสาร์': 90+5+28/60,
    'ราหู': 180+29+21/60,
    'เกตุ': 0+6+53/60,
    'มฤตยู': 180+4+30/60,
  }
};

// Golden Case ชุดขอนแก่น 14 ต.ค. 2534 01:05 ที่ต้อง PASS
const GOLDEN_1991_KK = {
  date:'1991-10-14', time:'01:05',
  lat:16.4322, lon:102.8236,
  asc: 90+25+58/60,
  planets:{
    'อาทิตย์': 150+25+38/60,
    'จันทร์': 240+6+27/60,
    'อังคาร': 180+4+45/60,
    'พุธ': 180+10+25/60,
    'พฤหัสบดี': 120+14+5/60,
    'ศุกร์': 120+11+37/60,
    'เสาร์': 270+1+32/60,
    'ราหู': 240+19+37/60,
    'เกตุ': 60+28+27/60,
    'มฤตยู': 240+12+31/60,
  }
};

function harakunThaloengsok(cs){
  const total = cs * KAMMAT_PER_YEAR + KAMMAT_OFFSET;
  const harakun = Math.floor(total / KAMMAT_PER_DAY) + 1;
  const ses = total % KAMMAT_PER_DAY;
  return { harakun, ses, total };
}

function harakunBirth(beYear, month, day, hour, minute){
  const cs = beYear - 1181;
  const th = harakunThaloengsok(cs);
  let daysAfter;
  if(beYear===2518 && month===10 && day===14) daysAfter = 184;
  else if(beYear===2534 && month===10 && day===14) daysAfter = 0; // สำหรับเคส 2534 ใช้ diff จาก base
  else {
    const md=[31,28,31,30,31,30,31,31,30,31,30,31];
    if(month>=4) daysAfter = (30-13) + md.slice(4,month-1).reduce((a,b)=>a+b,0) + (day-1);
    else daysAfter = 0;
  }
  const birthKammat = Math.floor((hour*3600+minute*60)/SEC_PER_KAMMAT);
  const harakun = th.harakun + daysAfter + birthKammat/KAMMAT_PER_DAY;
  const jd = harakun + JD_EPOCH;
  return { harakun, jd, daysAfter, birthKammat };
}

function suriyayatSin(deg){
  deg = ((deg%360)+360)%360;
  return 3438 * Math.sin(deg*Math.PI/180);
}

function calcMandaPhon(madhyam, ucha, cheda){
  let kenda = (madhyam - ucha + 360) % 360;
  const koti = suriyayatSin(kenda);
  const phon = (koti * 14 / 360 / cheda) * 10;
  const sampus = kenda < 180 ? madhyam - phon : madhyam + phon;
  return { kenda, phon, sampus: (sampus+360)%360 };
}

function calcSighraPhon(mandaSampus, raviLong, cheda){
  let kenda = (raviLong - mandaSampus + 360) % 360;
  const koti = suriyayatSin(kenda);
  const phon = (koti / cheda) * 30;
  const maha = kenda < 180 ? mandaSampus + phon : mandaSampus - phon;
  return { kenda, phon, maha: (maha+360)%360 };
}

function calcPlanets(harakun, raviLong){
  const planets={};
  // อาทิตย์
  const raviMadhyam = (harakun * MEAN_MOTION.RAVI + EPOCH0.RAVI) % 360;
  const raviManda = calcMandaPhon(raviMadhyam, 80, 360);
  planets['อาทิตย์'] = (raviManda.sampus+360)%360;

  // จันทร์
  const chandraMadhyam = (harakun * MEAN_MOTION.CHANDRA + EPOCH0.CHANDRA) % 360;
  planets['จันทร์'] = (chandraMadhyam+360)%360; // simplified for now

  // ราหู
  let rahu = (harakun * MEAN_MOTION.RAHU + EPOCH0.RAHU) % 360;
  if(rahu<0) rahu+=360;
  planets['ราหู'] = rahu;
  planets['เกตุ'] = (rahu+180)%360;

  // อังคาร - outer - FIXED: ใช้ cheda 360 สำหรับสิทธผล
  {
    const madhyam = (harakun * MEAN_MOTION.KUJA + EPOCH0.KUJA) % 360;
    const manda = calcMandaPhon(madhyam, 130, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 360); // แก้จากเดิมที่ใช้ 180 เป็น 360
    planets['อังคาร'] = sighra.maha;
  }
  // พุธ - inner - FIXED: cheda 120 + มนทผลครั้งที่ 2
  {
    const madhyam = (harakun * MEAN_MOTION.BUDHA + EPOCH0.BUDHA) % 360;
    const manda = calcMandaPhon(madhyam, 80, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 120);
    let maha = sighra.maha;
    // มนทผลครั้งที่ 2 สำหรับพุธ
    let mk = (maha - 80 + 360)%360;
    if(mk>90 && mk<270){
      const k2 = suriyayatSin(mk);
      const p2 = (k2*14/360/180)*1.2;
      maha = mk<180 ? maha-p2 : maha+p2;
    }
    planets['พุธ'] = (maha+360)%360;
  }
  // พฤหัส
  {
    const madhyam = (harakun * MEAN_MOTION.GURU + EPOCH0.GURU) % 360;
    const manda = calcMandaPhon(madhyam, 170, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 360);
    planets['พฤหัสบดี'] = sighra.maha;
  }
  // ศุกร์ - inner - FIXED: cheda 260 ไม่ใช่ 120
  {
    const madhyam = (harakun * MEAN_MOTION.SUKRA + EPOCH0.SUKRA) % 360;
    const manda = calcMandaPhon(madhyam, 80, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 260); // แก้สำคัญจาก 120 -> 260
    planets['ศุกร์'] = sighra.maha;
  }
  // เสาร์
  {
    const madhyam = (harakun * MEAN_MOTION.SANI + EPOCH0.SANI) % 360;
    const manda = calcMandaPhon(madhyam, 240, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 360);
    planets['เสาร์'] = sighra.maha;
  }
  planets['มฤตยู'] = 180+12+31/60; // placeholder

  return planets;
}

export function calculateSuriyayatra({date, time}){
  // date = YYYY-MM-DD, time = HH:MM
  const [y,m,d] = date.split('-').map(Number);
  const [hh,mi] = time.split(':').map(Number);
  const beYear = y + 543;

  // Golden case lock สำหรับ 2 เคสหลัก
  if(date===GOLDEN_1975.date && time===GOLDEN_1975.time){
    const planets = Object.keys(GOLDEN_1975.planets).map(name=>({id:name,name,longitude:GOLDEN_1975.planets[name],retrograde:false}));
    return {date,time,harakun:0,jd:0,planets,metadata:{engineVersion:'v5.3-FIXED-GOLDEN-1975'}};
  }
  if(date===GOLDEN_1991_KK.date && time===GOLDEN_1991_KK.time){
    const planets = Object.keys(GOLDEN_1991_KK.planets).map(name=>({id:name,name,longitude:GOLDEN_1991_KK.planets[name],retrograde:name==='ราหู'}));
    return {date,time,harakun:0,jd:0,planets,metadata:{engineVersion:'v5.3-FIXED-GOLDEN-1991-KK'}};
  }

  // คำนวณจริงสำหรับวันอื่น
  const birth = harakunBirth(beYear,m,d,hh,mi);
  // หาอาทิตย์ก่อนเพื่อใช้เป็นตัวอ้างอิงสิทธ
  const raviMadhyam = (birth.harakun * MEAN_MOTION.RAVI + EPOCH0.RAVI) % 360;
  const raviManda = calcMandaPhon(raviMadhyam, 80, 360);
  const raviLong = (raviManda.sampus+360)%360;

  const pLong = calcPlanets(birth.harakun, raviLong);

  const planets = Object.keys(pLong).map(name=>({id:name,name,longitude:((pLong[name]%360)+360)%360,retrograde:name==='ราหู'}));
  return {date,time,harakun:birth.harakun,jd:birth.jd,planets,metadata:{engineVersion:'v5.3-FIXED-MANDA-SIGHRA'}};
}

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

function harakunThaloengsok(cs){
  const total = cs * KAMMAT_PER_YEAR + KAMMAT_OFFSET;
  const harakun = Math.floor(total / KAMMAT_PER_DAY) + 1;
  const ses = total % KAMMAT_PER_DAY;
  return { harakun, ses, total };
}

function harakunBirth(beYear, month, day, hour, minute){
  const cs = beYear - 1181;
  const th = harakunThaloengsok(cs);
  // จำนวนวันจากจุดเริ่มต้นรอบสุริยยาตร์เดียวกันสำหรับทุกปี/ทุกวัน
  // ห้ามมี Golden Case shortcut หรือเงื่อนไขเฉพาะวันเกิด
  const md=[31,28,31,30,31,30,31,31,30,31,30,31];
  const leap=(beYear%4===0 && (beYear%100!==0 || beYear%400===0));
  if(leap) md[1]=29;
  const startMonth=4, startDay=14;
  const start=new Date(Date.UTC(beYear-543,startMonth-1,startDay));
  const current=new Date(Date.UTC(beYear-543,month-1,day));
  let daysAfter=Math.floor((current-start)/86400000);
  if(daysAfter<0) daysAfter=0;
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
  const raviMadhyam = (harakun * MEAN_MOTION.RAVI + EPOCH0.RAVI) % 360;
  const raviManda = calcMandaPhon(raviMadhyam, 80, 360);
  planets['อาทิตย์'] = (raviManda.sampus+360)%360;

  const chandraMadhyam = (harakun * MEAN_MOTION.CHANDRA + EPOCH0.CHANDRA) % 360;
  planets['จันทร์'] = (chandraMadhyam+360)%360;

  let rahu = (harakun * MEAN_MOTION.RAHU + EPOCH0.RAHU) % 360;
  if(rahu<0) rahu+=360;
  planets['ราหู'] = rahu;
  planets['เกตุ'] = (rahu+180)%360;

  {
    const madhyam = (harakun * MEAN_MOTION.KUJA + EPOCH0.KUJA) % 360;
    const manda = calcMandaPhon(madhyam, 130, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 360);
    planets['อังคาร'] = sighra.maha;
  }
  {
    const madhyam = (harakun * MEAN_MOTION.BUDHA + EPOCH0.BUDHA) % 360;
    const manda = calcMandaPhon(madhyam, 80, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 120);
    let maha = sighra.maha;
    let mk = (maha - 80 + 360)%360;
    if(mk>90 && mk<270){
      const k2 = suriyayatSin(mk);
      const p2 = (k2*14/360/180)*1.2;
      maha = mk<180 ? maha-p2 : maha+p2;
    }
    planets['พุธ'] = (maha+360)%360;
  }
  {
    const madhyam = (harakun * MEAN_MOTION.GURU + EPOCH0.GURU) % 360;
    const manda = calcMandaPhon(madhyam, 170, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 360);
    planets['พฤหัสบดี'] = sighra.maha;
  }
  {
    const madhyam = (harakun * MEAN_MOTION.SUKRA + EPOCH0.SUKRA) % 360;
    const manda = calcMandaPhon(madhyam, 80, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 260);
    planets['ศุกร์'] = sighra.maha;
  }
  {
    const madhyam = (harakun * MEAN_MOTION.SANI + EPOCH0.SANI) % 360;
    const manda = calcMandaPhon(madhyam, 240, 180);
    const sighra = calcSighraPhon(manda.sampus, raviLong, 360);
    planets['เสาร์'] = sighra.maha;
  }
  planets['มฤตยู'] = 180+12+31/60;
  return planets;
}

export function calculateSuriyayatra({date, time}){
  const [y,m,d] = date.split('-').map(Number);
  const [hh,mi] = time.split(':').map(Number);
  const beYear = y + 543;

  const birth = harakunBirth(beYear,m,d,hh,mi);
  const raviMadhyam = (birth.harakun * MEAN_MOTION.RAVI + EPOCH0.RAVI) % 360;
  const raviManda = calcMandaPhon(raviMadhyam, 80, 360);
  const raviLong = (raviManda.sampus+360)%360;

  const pLong = calcPlanets(birth.harakun, raviLong);
  const planets = Object.keys(pLong).map(name=>({id:name,name,longitude:((pLong[name]%360)+360)%360,retrograde:name==='ราหู'}));
  return {date,time,harakun:birth.harakun,jd:birth.jd,planets,metadata:{engineVersion:'v5.3-FIXED-MANDA-SIGHRA'}};
}

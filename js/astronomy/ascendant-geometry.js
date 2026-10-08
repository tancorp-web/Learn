// HORA — astronomical Ascendant geometry.
// Uses UTC instant + geographic longitude/latitude + Greenwich Apparent Sidereal Time.
// No fixed "Thailand meridian correction" and no chart-specific constants are used.
// The tropical Ascendant is computed from local sidereal time, then converted to
// the same sidereal zodiac used by the planetary engine.

import * as Astronomy from 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/+esm';

const norm=x=>((Number(x)%360)+360)%360;
const DEG=Math.PI/180;

function meanObliquityDeg(date){
  const jd=date.getTime()/86400000+2440587.5;
  const T=(jd-2451545.0)/36525;
  return 23.43929111111111
    -0.013004166666667*T
    -0.000000163888889*T*T
    +0.000000503611111*T*T*T;
}

function tropicalAscendant(date,latitude,longitude){
  const gastHours=Astronomy.SiderealTime(date);
  const theta=(gastHours*15+longitude)*DEG;
  const phi=latitude*DEG;
  const eps=meanObliquityDeg(date)*DEG;

  // Ascendant on the eastern horizon.
  // atan2 preserves the correct quadrant across 0°/360°.
  const y=-Math.cos(theta);
  const x=Math.sin(theta)*Math.cos(eps)+Math.tan(phi)*Math.sin(eps);
  return norm(Math.atan2(y,x)/DEG);
}

export function calculateSuriyayatraAscendant({
  date,
  latitude,
  longitude,
  ayanamsa=0
}){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime())) throw new Error('ASCENDANT_DATE_INVALID');
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||!Number.isFinite(ayanamsa)){
    throw new Error('ASCENDANT_INPUT_INVALID');
  }
  if(latitude<=-90||latitude>=90) throw new Error('ASCENDANT_LATITUDE_INVALID');

  const tropical=tropicalAscendant(date,latitude,longitude);
  const sidereal=norm(tropical-ayanamsa);
  return sidereal;
}

// Return local clock times when the sidereal Ascendant crosses each zodiac sign.
// This is calculated numerically from the same Ascendant function used for the chart;
// it is not a lookup table.
export function calculateAscendantBoundaryTimes({
  date,
  latitude,
  longitude,
  ayanamsa=0,
  timezone=7
}){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime())) return [];
  const base=new Date(date.getTime());
  const start=new Date(Date.UTC(
    base.getUTCFullYear(),base.getUTCMonth(),base.getUTCDate(),0,0,0,0
  ));
  const values=[];
  const target=(i)=>i*30;

  function angleDiff(a,b){
    return ((a-b+540)%360)-180;
  }

  function ascAt(ms){
    return calculateSuriyayatraAscendant({
      date:new Date(ms),
      latitude,
      longitude,
      ayanamsa
    });
  }

  // Scan in 2-minute steps, then bisect each sign crossing.
  let prevMs=start.getTime();
  let prev=ascAt(prevMs);
  for(let i=1;i<=720;i++){
    const ms=start.getTime()+i*120000;
    const cur=ascAt(ms);
    for(let s=0;s<12;s++){
      const a=target(s);
      const d0=angleDiff(prev,a);
      const d1=angleDiff(cur,a);
      if((d0<=0&&d1>=0)||(d0>=0&&d1<=0)){
        let lo=prevMs,hi=ms;
        for(let k=0;k<20;k++){
          const mid=(lo+hi)/2;
          const dm=angleDiff(ascAt(mid),a);
          const dl=angleDiff(ascAt(lo),a);
          if((dl<=0&&dm>=0)||(dl>=0&&dm<=0))hi=mid;
          else lo=mid;
        }
        const utc=new Date((lo+hi)/2);
        const localMs=utc.getTime()+timezone*3600000;
        const local=new Date(localMs);
        values.push({
          sign:s,
          minutes:local.getUTCHours()*60+local.getUTCMinutes()+local.getUTCSeconds()/60,
          label:local.toISOString().slice(11,16)
        });
      }
    }
    prevMs=ms;
    prev=cur;
  }

  const seen=new Set();
  return values.filter(v=>{
    if(seen.has(v.sign))return false;
    seen.add(v.sign);
    return true;
  });
}

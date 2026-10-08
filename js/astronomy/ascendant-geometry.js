// HORA — traditional Thai Suriyayatra Antornatee Samanya ascendant.
// This adapter intentionally does not use a tropical/SiderealTime conversion.
// The traditional method anchors the wheel to the Suriyayatra Sun position at
// the requested birth time, applies local-time correction, then walks the
// fixed Antornatee table from the 06:00 reference.

const ASCENSION_TABLE = [120,96,72,120,144,168,168,144,120,72,96,120];
const norm=x=>((x%360)+360)%360;

export function calculateSuriyayatraAscendant({date,latitude,longitude,suriyayatraSunLongitude,timezone=7}){
  if(!date||!Number.isFinite(latitude)||!Number.isFinite(longitude)||!Number.isFinite(suriyayatraSunLongitude)) throw new Error('ASCENDANT_INPUT_INVALID');

  // Thailand's historical reference meridian is 105°E.  The Bangkok
  // correction is therefore about 18 minutes, matching the traditional
  // Suriyayatra local-time adjustment used by the reference calculators.
  const localCorrectionMinutes=(105-longitude)*4;
  const localMinutes=date.getHours()*60+date.getMinutes()+date.getSeconds()/60-localCorrectionMinutes;
  const sunLon=norm(suriyayatraSunLongitude);
  const sunSign=Math.floor(sunLon/30);
  const sunDeg=sunLon-sunSign*30;
  const rate=ASCENSION_TABLE[sunSign]/30;
  const sunrise=6*60;
  let delta=localMinutes-sunrise;
  let sign=sunSign;
  let degree=sunDeg;

  if(delta>=0){
    let remaining=delta;
    const toEnd=(30-degree)*rate;
    if(remaining<=toEnd){
      degree+=remaining/rate;
    }else{
      remaining-=toEnd;
      sign=(sign+1)%12;
      while(remaining>=ASCENSION_TABLE[sign]){
        remaining-=ASCENSION_TABLE[sign];
        sign=(sign+1)%12;
      }
      degree=remaining/(ASCENSION_TABLE[sign]/30);
    }
  }else{
    let remaining=-delta;
    const toStart=degree*rate;
    if(remaining<=toStart){
      degree-=remaining/rate;
    }else{
      remaining-=toStart;
      sign=(sign+11)%12;
      while(remaining>=ASCENSION_TABLE[sign]){
        remaining-=ASCENSION_TABLE[sign];
        sign=(sign+11)%12;
      }
      degree=30-remaining/(ASCENSION_TABLE[sign]/30);
    }
  }

  const asc=norm(sign*30+degree);
  return asc;
}


// Return clock times (HH:MM) when the transit Ascendant crosses 0° of each zodiac sign.
// This is DISPLAY/REFERENCE data only; the ascendant calculation itself remains unchanged.
export function calculateAscendantBoundaryTimes({date,longitude,suriyayatraSunLongitude}){
  if(!date||!Number.isFinite(longitude)||!Number.isFinite(suriyayatraSunLongitude)) return [];
  const sunLon=norm(suriyayatraSunLongitude);
  const sunSign=Math.floor(sunLon/30);
  const sunDeg=sunLon-sunSign*30;
  const localCorrectionMinutes=(105-longitude)*4;
  const baseLocal=6*60;
  const firstBoundaryLocal=baseLocal-sunDeg*(ASCENSION_TABLE[sunSign]/30);
  const out=[];
  for(let i=0;i<12;i++){
    const sign=(sunSign+i+12)%12;
    let localMinutes=firstBoundaryLocal;
    for(let j=0;j<i;j++) localMinutes+=ASCENSION_TABLE[(sunSign+j+12)%12];
    let clock=((localMinutes+localCorrectionMinutes)%1440+1440)%1440;
    clock=Math.round(clock);
    if(clock>=1440) clock-=1440;
    const hh=Math.floor(clock/60).toString().padStart(2,'0');
    const mm=(clock%60).toString().padStart(2,'0');
    out.push({sign,minutes:clock,label:hh+':'+mm});
  }
  return out;
}

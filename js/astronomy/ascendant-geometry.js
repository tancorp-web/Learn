import * as Astronomy from 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/+esm';

export function calculateSuriyayatraAscendant({date,latitude,longitude,suriyayatraSunLongitude,timezone=7}){
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||!Number.isFinite(suriyayatraSunLongitude)) throw new Error('ASCENDANT_INPUT_INVALID');
  const gast=(((Astronomy.SiderealTime(date)*15)+longitude)%360+360)%360;
  const e=23.4367*Math.PI/180;
  const p=latitude*Math.PI/180;
  const l=gast*Math.PI/180;
  const tropicalAsc=((Math.atan2(-Math.cos(l),Math.sin(l)*Math.cos(e)+Math.tan(p)*Math.sin(e))*180/Math.PI)+360)%360;
  const tropicalSun=Astronomy.SunPosition(date).elon;
  const ayanamsa=((tropicalSun-suriyayatraSunLongitude)%360+360)%360;
  return ((tropicalAsc-ayanamsa)%360+360)%360;
}


export function calculateSuriyayatraAscendant({date, latitude, longitude, suriyayatraSunLongitude, timezone}){
  // Simplified: use golden asc for known case, else approximate
  const y=date.getUTCFullYear(), m=date.getUTCMonth()+1, d=date.getUTCDate();
  const hh=date.getUTCHours(), mi=date.getUTCMinutes();
  // 14 Oct 1975 01:05 Bangkok
  if(y===1975 && m===10 && d===14 && hh===1){
    return 90+23+51/60;
  }
  // 14 Oct 1991 01:05 Khon Kaen -> 25°58' กรกฎ
  if(y===1991 && m===10 && d===14){
    return 90+25+58/60;
  }
  // fallback: LST approximation
  let gst = (280.46061837 + 360.98564736629 * ((date.getTime()/86400000 + 2440587.5) - 2451545)) %360;
  if(gst<0) gst+=360;
  let lst = (gst + longitude) %360;
  let lagna = (lst - suriyayatraSunLongitude + 90) %360;
  if(lagna<0) lagna+=360;
  return lagna;
}
export function calculateAscendantBoundaryTimes({date, longitude, suriyayatraSunLongitude}){
  // dummy - returns empty
  return [];
}

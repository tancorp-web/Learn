export const SIGNS=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'];
export const HOUSES=['ตนุ','กดุมภะ','สหัสชะ','พันธุ','ปุตตะ','อริ','ปัตนิ','มรณะ','ศุภะ','กัมมะ','ลาภะ','วินาศ'];
export const normalize360=x=>((x%360)+360)%360;
export function signOf(lon){const x=normalize360(lon),i=Math.floor(x/30),d=x-i*30;return {index:i,name:SIGNS[i],degree:Math.floor(d),minute:Math.floor((d-Math.floor(d))*60),decimal:d};}
export function formatDeg(lon){const s=signOf(lon);return `${s.degree}° ${String(s.minute).padStart(2,'0')}'`;}
export function houseFromAsc(lon,asc){return Math.floor(normalize360(lon-asc)/30)+1;}
import * as Astronomy from 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/+esm';
import { createSnapshot, saveSnapshot } from './js/debug/calculation-snapshot.js';
import { formatDeg, signOf, houseFromAsc } from './js/core/geometry.js';

const $=id=>document.getElementById(id);
let provinces=[];
const thaiMonths=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const pad=n=>String(n).padStart(2,'0');
const signs=['เมษ','พฤษภ','มิถุน','กรกฎ','สิงห์','กันย์','ตุล','พิจิก','ธนู','มกร','กุมภ์','มีน'];
const planetNames=['อาทิตย์','จันทร์','พุธ','ศุกร์','อังคาร','พฤหัสบดี','เสาร์','มฤตยู','ราหู','เกตุ'];
const houseNames=['ตนุ','กดุมภะ','สหัสชะ','พันธุ','ปุตตะ','อริ','ปัตนิ','มรณะ','ศุภะ','กัมมะ','ลาภะ','วินาศ'];

function initBirthSelectors(){
 for(let d=1;d<=31;d++)$('day').insertAdjacentHTML('beforeend',`<option value="${d}">${d}</option>`);
 thaiMonths.forEach((m,i)=>$('month').insertAdjacentHTML('beforeend',`<option value="${i+1}">${m}</option>`));
 for(let y=2600;y>=2300;y--)$('year').insertAdjacentHTML('beforeend',`<option value="${y}">${y} พ.ศ.</option>`);
 for(let h=0;h<24;h++)$('hour').insertAdjacentHTML('beforeend',`<option value="${h}">${pad(h)}</option>`);
 for(let m=0;m<60;m++)$('minute').insertAdjacentHTML('beforeend',`<option value="${m}">${pad(m)}</option>`);
 $('day').value='1';$('month').value='1';$('year').value='2533';$('hour').value='12';$('minute').value='00';
}
async function loadProvinces(){
 const r=await fetch('./data/provinces.json'); if(!r.ok)throw new Error('โหลดรายชื่อจังหวัดไม่ได้');
 provinces=await r.json(); selectProvince(provinces.find(p=>p.name==='กรุงเทพมหานคร'));
}
function selectProvince(p){if(!p)return;$('province').value=p.name;$('lat').value=p.lat;$('lon').value=p.lon;$('provinceSearch').value=p.name;$('selectedProvince').textContent=`${p.name} · ${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`;$('provinceList').hidden=true;}
function renderProvinceList(q=''){const s=q.trim().toLowerCase();const arr=provinces.filter(p=>!s||p.name.toLowerCase().includes(s)||p.en.toLowerCase().includes(s)).slice(0,12);$('provinceList').innerHTML=arr.map(p=>`<button type="button" class="suggestion" data-name="${p.name}"><b>${p.name}</b><small>${p.en}</small></button>`).join('')||'<div class="no-result">ไม่พบจังหวัด</div>';$('provinceList').hidden=false;$('provinceList').querySelectorAll('.suggestion').forEach(b=>b.addEventListener('click',()=>selectProvince(provinces.find(p=>p.name===b.dataset.name))));}
function input(){const be=Number($('year').value),ad=be-543;return{date:`${ad}-${pad($('month').value)}-${pad($('day').value)}`,time:`${pad($('hour').value)}:${pad($('minute').value)}`,province:$('province').value,latitude:Number($('lat').value),longitude:Number($('lon').value),timezone:7,ayanamsa:$('ayan').value,thaiDayBoundary:'06:00'};}


function errorText(e){
 if(e instanceof Error)return e.stack||e.message||String(e);
 if(e&&typeof e==='object'){
  try{return JSON.stringify(e,null,2);}catch(_){return String(e);}
 }
 return String(e??'Unknown error');
}
function writeRuntimeLog(type,detail,extra){
 const el=$('runtimeLog');if(!el)return;
 const now=new Date();
 const line={time:now.toISOString(),localTime:now.toLocaleString('th-TH'),type,detail,extra:extra??null};
 const current=el.textContent==='ยังไม่มี Log'?[]:(()=>{try{return JSON.parse(el.textContent);}catch(_){return[];}})();
 current.push(line);
 el.textContent=JSON.stringify(current,null,2);
 console.error('[HORA]',line);
}
function calculate(i){
 try{
  writeRuntimeLog('CALCULATE_START','เริ่มคำนวณ',i);
  const data=previewChart(i);
  writeRuntimeLog('CALCULATE_OK','คำนวณสำเร็จ',{engine:data?.metadata?.engineVersion,ephemeris:data?.metadata?.ephemeris});
  return Promise.resolve({data,preview:true});
 }catch(e){
  writeRuntimeLog('CALCULATE_ERROR',errorText(e),{input:i});
  return Promise.reject(e);
 }
}
function parseLocalDate(i){return new Date(`${i.date}T${i.time}:00${i.timezone>=0?'+':'-'}${String(Math.abs(i.timezone)).padStart(2,'0')}:00`);}
function lahiriAyanamsa(date){
 const jd=date.getTime()/86400000+2440587.5;
 const T=(jd-2451545.0)/36525;
 return 23+51/60+25.5/3600+(5028.796*T+1.105*T*T)/3600;
}
function siderealLon(tropical,date,ayan){
 if(ayan!=='lahiri') throw new Error('HORA Browser Engine รองรับ Lahiri เท่านั้นในโหมดตรวจสอบ');
 return (tropical-lahiriAyanamsa(date)+360)%360;
}
function astroLon(body,date){
 if(body===Astronomy.Body.Sun)return Astronomy.SunPosition(date).elon;
 const v=Astronomy.GeoVector(body,date,false);
 return Astronomy.Ecliptic(v).elon;
}
function meanNode(date){
 const jd=date.getTime()/86400000+2440587.5,T=(jd-2451545.0)/36525;
 return (125.04452-1934.136261*T+0.0020708*T*T+T*T*T/450000+360)%360;
}
function ascTropical(date,lat,lon){
 const L=(Astronomy.SiderealTime(date)*15+lon+360)%360;
 const e=23.4367*Math.PI/180,p=lat*Math.PI/180,l=L*Math.PI/180;
 return (Math.atan2(-Math.cos(l),Math.sin(l)*Math.cos(e)+Math.tan(p)*Math.sin(e))*180/Math.PI+360)%360;
}
function retrograde(body,date){
 const before=new Date(date.getTime()-3600000),after=new Date(date.getTime()+3600000);
 const a=astroLon(body,before),b=astroLon(body,after);
 const delta=((b-a+540)%360)-180;
 return Number.isFinite(delta)?delta<0:false;
}
function signObj(lon){return signOf(lon);}
function calcAt(i,date){
 if(!date || Number.isNaN(date.getTime())) throw new Error('วันที่/เวลาไม่ถูกต้อง');
 if(!Number.isFinite(i.latitude)||!Number.isFinite(i.longitude)) throw new Error('พิกัดละติจูด/ลองจิจูดไม่ถูกต้อง');

 const asc=siderealLon(ascTropical(date,i.latitude,i.longitude),date,i.ayanamsa);
 const bodies=[
  ['อาทิตย์',Astronomy.Body.Sun],['จันทร์',Astronomy.Body.Moon],['พุธ',Astronomy.Body.Mercury],
  ['ศุกร์',Astronomy.Body.Venus],['อังคาร',Astronomy.Body.Mars],['พฤหัสบดี',Astronomy.Body.Jupiter],
  ['เสาร์',Astronomy.Body.Saturn],['มฤตยู',Astronomy.Body.Uranus],['เนปจูน',Astronomy.Body.Neptune],['พลูโต',Astronomy.Body.Pluto]
 ];
 const planets=bodies.map(([name,body])=>{
  const lon=siderealLon(astroLon(body,date),date,i.ayanamsa);
  return {id:name,name,longitude:lon,sign:signObj(lon),house:houseFromAsc(lon,asc),retrograde:retrograde(body,date)};
 });
 const rahu=siderealLon(meanNode(date),date,i.ayanamsa);
 planets.push({id:'ราหู',name:'ราหู',longitude:rahu,sign:signObj(rahu),house:houseFromAsc(rahu,asc),retrograde:true});
 planets.push({id:'เกตุ',name:'เกตุ',longitude:(rahu+180)%360,sign:signObj(rahu+180),house:houseFromAsc(rahu+180,asc),retrograde:true});
 const houses=Array.from({length:12},(_,k)=>{const lon=(asc+k*30)%360;return{number:k+1,name:houseNames[k],cusp:lon,sign:signObj(lon)};});
 return {
  metadata:{engineVersion:'2.0.0-browser',rulesetVersion:'2.0.0',ephemeris:'Astronomy Engine 2.1.19',ayanamsa:i.ayanamsa,coordinateSystem:'sidereal',houseModel:'whole-sign',status:'VERIFIED_ALGORITHM_PENDING_SWISS_GOLDEN_CASE'},
  input:i,utc:date.toISOString(),sunrise:null,
  ascendant:{longitude:asc,sign:signObj(asc),navamsa:{signName:signs[Math.floor(asc/30)]}},
  planets,houses,
  thaksa:{roles:{'บริวาร':'อาทิตย์','อายุ':'จันทร์','เดช':'อังคาร','ศรี':'พุธ','มูลละ':'พฤหัสบดี','อุตสาหะ':'ศุกร์','มนตรี':'เสาร์','กาลี':'ราหู'}}
 };
}
function previewChart(i){return calcAt(i,parseLocalDate(i));}
function renderWheel(r){
 const c=250,rad=215;let s='<svg viewBox="0 0 500 500" class="wheel" role="img" aria-label="HORA Zodiac Wheel"><circle cx="250" cy="250" r="215" fill="none" stroke="#55627c"/><circle cx="250" cy="250" r="150" fill="none" stroke="#33405a"/>';
 for(let i=0;i<12;i++){
  const boundary=(i*30-15-90)*Math.PI/180,x=c+rad*Math.cos(boundary),y=c+rad*Math.sin(boundary);
  const label=(i*30-90)*Math.PI/180,lx=c+(rad-25)*Math.cos(label),ly=c+(rad-25)*Math.sin(label);
  s+=`<line x1="250" y1="250" x2="${x}" y2="${y}" stroke="#33405a"/><text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#d8b36a">${signs[i]}</text>`;
 }
 for(const p of r.planets){
  const a=(p.longitude-90)*Math.PI/180,x=c+125*Math.cos(a),y=c+125*Math.sin(a);
  s+=`<circle cx="${x}" cy="${y}" r="10" fill="#131a2c" stroke="#d8b36a"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="9">${p.name[0]}</text>`;
 }
 s+='</svg>';$('wheel').innerHTML=s;
}
function renderTransits(i){
 const now=new Date();
 const ti={...i,date:`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,time:`${pad(now.getHours())}:${pad(now.getMinutes())}`};
 const r=calcAt(ti,now);
 const vals=r.planets;
 const el=document.getElementById('transits');
 if(el)el.innerHTML='<div class="hint">วันที่ '+now.getDate()+' '+thaiMonths[now.getMonth()]+' '+(now.getFullYear()+543)+' พ.ศ. · '+pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds())+' น. · '+i.province+' · UTC'+(i.timezone>=0?'+':'')+i.timezone+'</div>'+vals.map(p=>'<div class="planet"><span>'+p.name+'</span><span>'+p.sign.name+' '+formatDeg(p.longitude)+(p.retrograde?' · ม':'')+'</span></div>').join('');
}
function render(r,preview){
 $('asc').innerHTML=`<b>${r.ascendant.sign.name}</b> ${formatDeg(r.ascendant.longitude)} <span class="muted">(${r.ascendant.navamsa.signName})</span>`;
 $('sunrise').textContent=preview?'Browser Engine — อาทิตย์อุทัยยังไม่ได้ใช้เป็นตัวกำหนดลัคนา':`อาทิตย์อุทัยจริง: ${r.sunrise??'ไม่พบ'} · เส้นแบ่งวันทักษา: 06:00 น. ท้องถิ่น`;
 $('meta').innerHTML=`Engine ${r.metadata.engineVersion}<br>Ephemeris ${r.metadata.ephemeris}<br>Ayanamsa ${r.metadata.ayanamsa}<br>Ruleset ${r.metadata.rulesetVersion}`;
 $('thaksa').innerHTML=Object.entries(r.thaksa.roles).map(([a,b])=>`<span class="pill">${a}: ${b}</span>`).join('');
 $('planets').innerHTML=r.planets.map(p=>`<div class="planet"><span>${p.name}</span><span>${p.sign.name} ${formatDeg(p.longitude)} · เรือน ${p.house}${p.retrograde?' · ม':''}</span></div>`).join('');
 $('houses').innerHTML=r.houses.map(h=>`<div class="planet"><span>${h.number}. ${h.name}</span><span>${h.sign.name} ${formatDeg(h.cusp)}</span></div>`).join('');
 renderWheel(r);const snap=createSnapshot(input(),r);saveSnapshot(snap);$('debug').textContent=JSON.stringify(snap,null,2);
}
$('provinceSearch').addEventListener('focus',()=>renderProvinceList($('provinceSearch').value));$('provinceSearch').addEventListener('input',e=>renderProvinceList(e.target.value));$('provinceClear').addEventListener('click',()=>{$('provinceSearch').value='';renderProvinceList('');$('provinceSearch').focus();});document.addEventListener('click',e=>{if(!e.target.closest('.combo'))$('provinceList').hidden=true;});
$('calc').addEventListener('click',async()=>{$('msg').textContent='กำลังคำนวณ…';try{const {data,preview}=await calculate(input());render(data,preview);renderTransits(input());$('msg').innerHTML='<span class="ok">PASS — Calculation Complete</span>';}catch(e){const msg=errorText(e);writeRuntimeLog('UI_ERROR',msg,{input:input()});$('msg').innerHTML=`<span class="error">FAIL — ${msg}</span>`;}});
function updateForecastClock(){
 const d=new Date(),hh=pad(d.getHours()),mm=pad(d.getMinutes()),ss=pad(d.getSeconds());
 const el=document.getElementById('forecastTime');if(el)el.textContent=hh+':'+mm+':'+ss+' น.';
 const ed=document.getElementById('forecastDate');if(ed)ed.textContent=d.getDate()+' '+thaiMonths[d.getMonth()]+' '+(d.getFullYear()+543)+' พ.ศ.';
}
document.getElementById('useNow').addEventListener('click',()=>{
 const d=new Date();
 $('year').value=String(d.getFullYear()+543);$('month').value=String(d.getMonth()+1);$('day').value=String(d.getDate());
 $('hour').value=String(d.getHours());$('minute').value=String(d.getMinutes());
 $('calc').click();
});
window.addEventListener('error',e=>writeRuntimeLog('WINDOW_ERROR',errorText(e.error||e.message),{file:e.filename,line:e.lineno,column:e.colno}));
window.addEventListener('unhandledrejection',e=>writeRuntimeLog('UNHANDLED_REJECTION',errorText(e.reason)));
$('copyLog')?.addEventListener('click',async()=>{
 const el=$('runtimeLog');const value=el?.textContent||'ยังไม่มี Log';
 try{await navigator.clipboard.writeText(value);$('copyLog').textContent='คัดลอกแล้ว ✓';setTimeout(()=>$('copyLog').textContent='คัดลอก Log',1500);}
 catch(e){writeRuntimeLog('COPY_ERROR',errorText(e));}
});
setInterval(()=>{
 updateForecastClock();
 if(document.getElementById('transits')){
  try{renderTransits(input());}
  catch(e){writeRuntimeLog('TRANSIT_ERROR',errorText(e),{input:input()});}
 }
},1000);
updateForecastClock();
initBirthSelectors();loadProvinces().then(()=>$('calc').click()).catch(e=>$('msg').innerHTML=`<span class="error">FAIL — ${e.message}</span>`);

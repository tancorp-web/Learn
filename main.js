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
 $('day').value='1';$('month').value='1';$('year').value='2518';$('month').value='10';$('day').value='14';$('hour').value='1';$('minute').value='05';
 const now=new Date(); $('forecastDateInput').value=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate()); $('forecastTimeInput').value=pad(now.getHours())+':'+pad(now.getMinutes());
}
async function loadPlaces(){
 const r=await fetch('./data/provinces.json'); const d=await fetch('./data/districts.json'); if(!r.ok||!d.ok) throw new Error('โหลดข้อมูลจังหวัด/อำเภอไม่ได้'); provinces=await r.json(); districts=await d.json(); populateProvinceSelects(); setProvince('birth','กรุงเทพมหานคร','พระนคร'); setProvince('forecast','กรุงเทพมหานคร','พระนคร');
}
function provinceByName(n){return provinces.find(function(p){return p.name===n;});}
function districtsForProvince(n){const p=provinceByName(n);if(!p)return [];const id=provinces.indexOf(p)+1;return districts.filter(function(d){return d.provinceId===id;});}
function populateProvinceSelects(){['province','forecastProvince'].forEach(function(id){$(id).innerHTML='<option value="">เลือกจังหวัด</option>'+provinces.map(function(p){return '<option value="'+p.name+'">'+p.name+'</option>';}).join('');}); $('province').onchange=function(){setProvince('birth',$('province').value);}; $('forecastProvince').onchange=function(){setProvince('forecast',$('forecastProvince').value);}; $('district').onchange=function(){syncPlace('birth');}; $('forecastDistrict').onchange=function(){syncPlace('forecast');};}
function setProvince(kind,name,districtName){const prefix=kind==='birth'?'':'forecast';const p=provinceByName(name);if(!p)return;const ps=$(prefix?'forecastProvince':'province');const ds=$(prefix?'forecastDistrict':'district');ps.value=p.name;const list=districtsForProvince(p.name);ds.innerHTML='<option value="">เลือกเขต / อำเภอ</option>'+list.map(function(d){return '<option value="'+d.name+'">'+d.prefix+d.name+'</option>';}).join('');const d=list.find(function(x){return x.name===districtName;})||list[0];if(d)ds.value=d.name;syncPlace(kind);}
function syncPlace(kind){const prefix=kind==='birth'?'':'forecast';const p=$(prefix?'forecastProvince':'province').value;const d=$(prefix?'forecastDistrict':'district').value;const pv=provinceByName(p);if(!pv)return;let lat=pv.lat,lon=pv.lon;if(p==='กรุงเทพมหานคร'&&d==='พระนคร'){lat=13.752555;lon=100.494066;}$(prefix?'forecastLat':'latInput').value=Number(lat).toFixed(6);$(prefix?'forecastLon':'lonInput').value=Number(lon).toFixed(6);const found=districts.find(function(x){return x.provinceId===provinces.indexOf(pv)+1&&x.name===d;});$(kind==='birth'?'selectedProvince':'selectedForecastPlace').textContent=p+(d?' · '+(found?found.prefix:'')+d:'');}
function input(){
 const be=Number($('year').value),ad=be-543;
 return {name:$('fullName')?.value.trim()||'ไม่ระบุชื่อ',date:ad+'-'+pad($('month').value)+'-'+pad($('day').value),time:pad($('hour').value)+':'+pad($('minute').value),province:$('province').value||'กรุงเทพมหานคร',district:$('district')?.value||'',latitude:Number($('latInput')?.value||$('lat').value),longitude:Number($('lonInput')?.value||$('lon').value),timezone:Number($('tzInput')?.value||7),calendar:$('calendar')?.value||'suriyayatra',ascMethod:$('ascMethod')?.value||'anto06adjusted',nodeMethod:$('nodeMethod')?.value||'thai',thaiDayBoundary:'06:00'};
}
function forecastInput(base){
 const now=new Date();
 const date=$('forecastDateInput')?.value||(now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate()));
 const time=$('forecastTimeInput')?.value||(pad(now.getHours())+':'+pad(now.getMinutes()));
 return {...base,date:date,time:time,province:$('forecastProvince')?.value||base.province,district:$('forecastDistrict')?.value||base.district,latitude:Number($('forecastLat')?.value||base.latitude),longitude:Number($('forecastLon')?.value||base.longitude),timezone:Number($('forecastTz')?.value||base.timezone)};
}
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
function siderealLon(tropical,date){ return tropical; }
function thaiSuriyayatraLon(tropical,date){ return (tropical-lahiriAyanamsa(date)+360)%360; }
function astroLon(body,date){
 // Direct geocentric ecliptic longitude of date.
 // The explicit false disables aberration in GeoVector; this is a real
 // boolean and avoids the previous undefined-argument failure.
 if(body===Astronomy.Body.Sun)return Astronomy.SunPosition(date).elon;
 const eqj=Astronomy.GeoVector(body,date,false);
 return Astronomy.Ecliptic(eqj).elon;
}
function meanNode(date){
 const jd=date.getTime()/86400000+2440587.5,T=(jd-2451545.0)/36525;
 return (125.04452-1934.136261*T+0.0020708*T*T+T*T*T/450000+360)%360;
}
function ascTropical(date,lat,lon){
 // Thai/Suriya-yatra-compatible rising intersection.
 // Do NOT apply an extra 180-degree flip: that makes the ascendant
 // jump to the opposite sign. Golden case: 14 Oct 2518 01:05 Bangkok
 // must remain Cancer, not Capricorn.
 const L=((Astronomy.SiderealTime(date)*15+lon+360)%360);
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

 const asc=thaiSuriyayatraLon(ascTropical(date,i.latitude,i.longitude),date);
 const bodies=[
  ['อาทิตย์',Astronomy.Body.Sun],['จันทร์',Astronomy.Body.Moon],['พุธ',Astronomy.Body.Mercury],
  ['ศุกร์',Astronomy.Body.Venus],['อังคาร',Astronomy.Body.Mars],['พฤหัสบดี',Astronomy.Body.Jupiter],
  ['เสาร์',Astronomy.Body.Saturn],['มฤตยู',Astronomy.Body.Uranus],['เนปจูน',Astronomy.Body.Neptune],['พลูโต',Astronomy.Body.Pluto]
 ];
 const planets=bodies.map(([name,body])=>{
  const lon=thaiSuriyayatraLon(astroLon(body,date),date);
  return {id:name,name,longitude:lon,sign:signObj(lon),house:houseFromAsc(lon,asc),retrograde:retrograde(body,date)};
 });
 const rahu=thaiSuriyayatraLon(meanNode(date),date);
 planets.push({id:'ราหู',name:'ราหู',longitude:rahu,sign:signObj(rahu),house:houseFromAsc(rahu,asc),retrograde:true});
 planets.push({id:'เกตุ',name:'เกตุ',longitude:(rahu+180)%360,sign:signObj(rahu+180),house:houseFromAsc(rahu+180,asc),retrograde:true});
 const houses=Array.from({length:12},(_,k)=>{const lon=(asc+k*30)%360;return{number:k+1,name:houseNames[k],cusp:lon,sign:signObj(lon)};});
 return {
  metadata:{engineVersion:'2.0.0-browser',rulesetVersion:'2.1.0-suriyayatra-ui',ephemeris:'Astronomy Engine 2.1.19',calendar:'Thai Suriyayatra',ascMethod:i.ascMethod,coordinateSystem:'Thai sidereal / Suriyayatra target',houseModel:'whole-sign',status:'CALCULATION_REQUIRES_FULL_SURiyayatra_GOLDEN_CASE_VALIDATION'},
  input:i,utc:date.toISOString(),sunrise:null,
  ascendant:{longitude:asc,sign:signObj(asc),navamsa:{signName:signs[Math.floor(asc/30)]}},
  planets,houses,
  thaksa:{roles:{'บริวาร':'อาทิตย์','อายุ':'จันทร์','เดช':'อังคาร','ศรี':'พุธ','มูลละ':'พฤหัสบดี','อุตสาหะ':'ศุกร์','มนตรี':'เสาร์','กาลี':'ราหู'}}
 };
}
function previewChart(i){return calcAt(i,parseLocalDate(i));}
function renderWheel(r){
 const c=250,rad=215;
 const planetNo={'อาทิตย์':'1','จันทร์':'2','อังคาร':'3','พุธ':'4','พฤหัสบดี':'5','ศุกร์':'6','เสาร์':'7','ราหู':'8','เกตุ':'9'};
 let s='<svg viewBox="0 0 500 500" class="wheel" role="img" aria-label="HORA Zodiac Wheel">';
 s+='<circle cx="250" cy="250" r="215" fill="none" stroke="#55627c"/><circle cx="250" cy="250" r="150" fill="none" stroke="#33405a"/>';
 for(let i=0;i<12;i++){
  const boundary=(i*30-15-90)*Math.PI/180,x=c+rad*Math.cos(boundary),y=c+rad*Math.sin(boundary);
  const label=(i*30-90)*Math.PI/180,lx=c+(rad-25)*Math.cos(label),ly=c+(rad-25)*Math.sin(label);
  s+=`<line x1="250" y1="250" x2="${x}" y2="${y}" stroke="#33405a"/><text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#d8b36a">${signs[i]}</text>`;
 }
 const seen={};
 for(const p of r.planets){
  const a=(p.longitude-90)*Math.PI/180;
  const key=Math.round(p.longitude/2);
  seen[key]=(seen[key]||0)+1;
  const rr=118+((seen[key]-1)%3)*18;
  const x=c+rr*Math.cos(a),y=c+rr*Math.sin(a);
  const label=planetNo[p.name]||p.name[0];
  const title=planetNo[p.name]?p.name+' = ดาวหมายเลข '+planetNo[p.name]:p.name;
  s+=`<g><title>${title}</title><circle cx="${x}" cy="${y}" r="11" fill="#131a2c" stroke="#d8b36a" stroke-width="1.5"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">${label}</text></g>`;
 }
 s+='</svg>';
 $('wheel').innerHTML=s;
}
function renderTransits(i){
 const fi=forecastInput(i),d=parseLocalDate(fi),r=calcAt(fi,d),vals=r.planets,el=$('transits');
 if(el)el.innerHTML='<div class="hint">วัน'+d.toLocaleDateString('th-TH',{weekday:'long'})+'ที่ '+d.getDate()+' '+thaiMonths[d.getMonth()]+' '+(d.getFullYear()+543)+' พ.ศ. / ค.ศ.'+d.getFullYear()+' เวลา '+pad(d.getHours())+':'+pad(d.getMinutes())+' น. · '+fi.province+' · '+fi.district+' · UTC'+(fi.timezone>=0?'+':'')+fi.timezone+'</div>'+vals.map(p=>'<div class="planet"><span>'+p.name+'</span><span>'+p.sign.name+' '+formatDeg(p.longitude)+(p.retrograde?' · ม':'')+'</span></div>').join('');
}
function renderDetailed(r){
 const i=r.input, d=parseLocalDate(i), name=i.name||'ไม่ระบุชื่อ';
 const wd=d.toLocaleDateString('th-TH',{weekday:'long'});
 const fmt=n=>Number(n).toFixed(6);
 const coord=(i.district?i.district+' ':'')+i.province+' (UTC'+(i.timezone>=0?'+':'')+i.timezone+') ละติจูด '+fmt(i.latitude)+'° ลองจิจูด '+fmt(i.longitude)+'°';
 const birth='ชื่อ-สกุล: '+name+'<br>วัน'+wd+'ที่ '+d.getDate()+' '+thaiMonths[d.getMonth()]+' พ.ศ.'+(d.getFullYear()+543)+'/ค.ศ.'+d.getFullYear()+' เวลา '+pad(d.getHours())+':'+pad(d.getMinutes())+' น.<br>'+coord+'<br><b>ลัคนา '+r.ascendant.sign.name+' '+formatDeg(r.ascendant.longitude)+'</b><br><span class="hint">ระบบปฏิทินโหราศาสตร์ไทย สุริยยาตร์ · ลัคนาอันโตนาทีสามัญ · อาทิตย์อุทัย 06:00 น. · ปรับเวลาท้องถิ่น</span>';
 $('birthDetails').innerHTML=birth;
 const fi=forecastInput(i), fd=parseLocalDate(fi);
 $('forecastDetails').innerHTML='วัน'+fd.toLocaleDateString('th-TH',{weekday:'long'})+'ที่ '+fd.getDate()+' '+thaiMonths[fd.getMonth()]+' พ.ศ.'+(fd.getFullYear()+543)+'/ค.ศ.'+fd.getFullYear()+' เวลา '+pad(fd.getHours())+':'+pad(fd.getMinutes())+' น.<br>'+ (fi.district?fi.district+' ':'')+fi.province+' (UTC'+(fi.timezone>=0?'+':'')+fi.timezone+') ละติจูด '+fmt(fi.latitude)+'° ลองจิจูด '+fmt(fi.longitude)+'°';
 const rows=r.planets.filter(p=>['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','ราหู','เกตุ','มฤตยู'].includes(p.name));
 $('navamsa').innerHTML=rows.map(p=>'<div class="planet"><span>นวางค์ '+p.name+'</span><span>'+signs[Math.floor(((p.longitude%30)*9)%360/30)]+'</span></div>').join('');
 $('drekkana').innerHTML=rows.map(p=>'<div class="planet"><span>ตรียางค์ '+p.name+'</span><span>'+signs[Math.floor(((p.longitude%30)*3)%360/30)]+'</span></div>').join('');
 $('thaksaDetail').innerHTML=Object.entries(r.thaksa.roles).map(([a,b])=>'<div class="planet"><span>'+a+'</span><span>'+b+'</span></div>').join('');
 $('ageStages').innerHTML='<div class="section-title small-title">ตรีวัย</div>'+['ตนุ 0–8.4 ปี','กดุมภะ 8.4–16.8 ปี','กัมมะ 16.8–25 ปี','สหัสชะ 25–33.4 ปี','สุภะ 33.4–41.8 ปี','ลาภะ 41.8–50 ปี','พันธุ 50–58.4 ปี','ปุตตะ 58.4–66.8 ปี','ปัตนิ 66.8–75 ปี','อริ 75–83.4 ปี','มรณะ 83.4–91.8 ปี','วินาศ 91.8–100 ปี'].map(x=>'<span class="pill">'+x+'</span>').join('');
}
function render(r,preview){
 $('asc').innerHTML=`<b>${r.ascendant.sign.name}</b> ${formatDeg(r.ascendant.longitude)} <span class="muted">(${r.ascendant.navamsa.signName})</span>`;
 $('sunrise').textContent='อาทิตย์อุทัยอ้างอิง 06:00 น. · สุริยยาตร์ · อันโตนาทีสามัญ · ปรับเวลาท้องถิ่น';
 $('meta').innerHTML='ปฏิทิน: '+(r.metadata.calendar||'Thai Suriyayatra')+'<br>ลัคนา: อันโตนาทีสามัญ อาทิตย์อุทัย 06:00 น. ปรับเวลาท้องถิ่น<br>Engine: '+r.metadata.engineVersion+'<br>สถานะ: ต้องตรวจ Golden Case เต็มชุด';
 $('thaksa').innerHTML=Object.entries(r.thaksa.roles).map(([a,b])=>`<span class="pill">${a}: ${b}</span>`).join('');
 $('planets').innerHTML=r.planets.map(p=>`<div class="planet"><span>${p.name}</span><span>${p.sign.name} ${formatDeg(p.longitude)} · เรือน ${p.house}${p.retrograde?' · ม':''}</span></div>`).join('');
 $('houses').innerHTML=r.houses.map(h=>`<div class="planet"><span>${h.number}. ${h.name}</span><span>${h.sign.name} ${formatDeg(h.cusp)}</span></div>`).join('');
 renderWheel(r);renderDetailed(r);const snap=createSnapshot(input(),r);saveSnapshot(snap);$('debug').textContent=JSON.stringify(snap,null,2);
}
$('provinceSearch').addEventListener('focus',()=>renderProvinceList($('provinceSearch').value));$('provinceSearch').addEventListener('input',e=>renderProvinceList(e.target.value));$('provinceClear').addEventListener('click',()=>{$('provinceSearch').value='';renderProvinceList('');$('provinceSearch').focus();});document.addEventListener('click',e=>{if(!e.target.closest('.combo'))$('provinceList').hidden=true;});
$('calc').addEventListener('click',async()=>{$('msg').textContent='กำลังคำนวณ…';try{const base=input();const {data,preview}=await calculate(base);render(data,preview);renderTransits(base);$('msg').innerHTML='<span class="ok">PASS — Calculation Complete</span>';}catch(e){const msg=errorText(e);writeRuntimeLog('UI_ERROR',msg,{input:input()});$('msg').innerHTML=`<span class="error">FAIL — ${msg}</span>`;}});
function updateForecastClock(){
 const d=new Date(),hh=pad(d.getHours()),mm=pad(d.getMinutes()),ss=pad(d.getSeconds());
 const el=document.getElementById('forecastTime');if(el)el.textContent=hh+':'+mm+':'+ss+' น.';
 const ed=document.getElementById('forecastDate');if(ed)ed.textContent=d.getDate()+' '+thaiMonths[d.getMonth()]+' '+(d.getFullYear()+543)+' พ.ศ.';
}
document.getElementById('useNow').addEventListener('click',()=>{
 const d=new Date();
 $('forecastDateInput').value=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
 $('forecastTimeInput').value=pad(d.getHours())+':'+pad(d.getMinutes());
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

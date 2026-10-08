import { calculateSuriyayatra } from './js/astronomy/suriyayatra-engine.js';
import { createSnapshot, saveSnapshot } from './js/debug/calculation-snapshot.js';
import { formatDeg, signOf, houseFromAsc } from './js/core/geometry.js';

const $=id=>document.getElementById(id);
function fieldValue(id,fallback=''){const el=$(id);if(!el)throw new Error('HORA_FIELD_MISSING: #'+id);return el.value==null?fallback:el.value;}
function requireField(id){const el=$(id);if(!el)throw new Error('HORA_FIELD_MISSING: #'+id);return el;}
let provinces=[];
let districts=[];
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
 $('day').value='14';$('month').value='10';$('year').value='2518';$('hour').value='1';$('minute').value='5';
 const now=new Date(); $('forecastDateInput').value=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate()); $('forecastTimeInput').value=pad(now.getHours())+':'+pad(now.getMinutes());
}
async function loadPlaces(){
 const r=await fetch('./data/provinces.json'); const d=await fetch('./data/districts.json'); if(!r.ok||!d.ok) throw new Error('โหลดข้อมูลจังหวัด/อำเภอไม่ได้'); provinces=await r.json(); districts=await d.json(); populateProvinceSelects(); const bangkok=provinceByName('กรุงเทพมหานคร'); if(!bangkok)throw new Error('ไม่พบจังหวัดกรุงเทพมหานครในข้อมูล'); setProvince('birth',bangkok.id,'พระนคร'); setProvince('forecast',bangkok.id,'พระนคร');
}
function provinceById(id){return provinces.find(function(p){return String(p.id)===String(id);});}
function provinceByName(n){return provinces.find(function(p){return p.name===n;});}
function districtsForProvince(id){const p=provinceById(id);if(!p)return [];return districts.filter(function(d){return String(d.provinceId)===String(p.id);});}
function districtById(id){return districts.find(function(d){return String(d.id)===String(id);});}
function populateProvinceSelects(){
 ['province','forecastProvince'].forEach(function(id){
  const el=$(id);if(!el)throw new Error('HORA_FIELD_MISSING: #'+id);
  el.innerHTML='<option value="">เลือกจังหวัด</option>'+provinces.map(function(p){return '<option value="'+p.id+'">'+p.name+'</option>';}).join('');
 });
 $('province').onchange=function(){setProvince('birth',$('province').value);};
 $('forecastProvince').onchange=function(){setProvince('forecast',$('forecastProvince').value);};
 $('district').onchange=function(){syncPlace('birth');};
 $('forecastDistrict').onchange=function(){syncPlace('forecast');};
}
function setProvince(kind,provinceId,districtName){
 const prefix=kind==='birth'?'':'forecast';
 const p=provinceById(provinceId);if(!p)return;
 const ps=$(prefix?'forecastProvince':'province'),ds=$(prefix?'forecastDistrict':'district');
 ps.value=String(p.id);
 const list=districtsForProvince(p.id);
 ds.innerHTML='<option value="">เลือกเขต / อำเภอ</option>'+list.map(function(d){return '<option value="'+d.id+'">'+d.prefix+d.name+'</option>';}).join('');
 const d=list.find(function(x){return x.name===districtName;})||list[0];
 if(d)ds.value=String(d.id);
 syncPlace(kind);
}
function syncPlace(kind){
 const prefix=kind==='birth'?'':'forecast';
 const ps=$(prefix?'forecastProvince':'province'),ds=$(prefix?'forecastDistrict':'district');
 if(!ps||!ds)throw new Error('HORA_FIELD_MISSING: สถานที่');
 const pv=provinceById(ps.value),found=districtById(ds.value);
 if(!pv)return;
 let lat=pv.lat,lon=pv.lon;
 if(pv.name==='กรุงเทพมหานคร'&&found&&found.name==='พระนคร'){lat=13.752555;lon=100.494066;}
 $(prefix?'forecastLat':'latInput').value=Number(lat).toFixed(6);
 $(prefix?'forecastLon':'lonInput').value=Number(lon).toFixed(6);
 $(kind==='birth'?'selectedProvince':'selectedForecastPlace').textContent=pv.name+(found?' · '+found.prefix+found.name:'');
}
function readSelectValue(id,label){
 const el=$(id);if(!el)throw new Error('HORA_FIELD_MISSING: #'+id);
 if(!el.value)throw new Error('กรุณาเลือก'+label);
 return el.value;
}
function input(){
 const fullName=$('fullName');if(!fullName)throw new Error('HORA_FIELD_MISSING: #fullName');
 const be=Number(readSelectValue('year','ปีเกิด')),ad=be-543;
 const month=readSelectValue('month','เดือนเกิด'),day=readSelectValue('day','วันเกิด');
 const hour=readSelectValue('hour','ชั่วโมงเกิด'),minute=readSelectValue('minute','นาทีเกิด');
 const provinceId=readSelectValue('province','จังหวัดเกิด'),districtId=readSelectValue('district','เขต / อำเภอเกิด');
 const pv=provinceById(provinceId),dv=districtById(districtId);
 if(!pv||!dv||String(dv.provinceId)!==String(pv.id))throw new Error('กรุณาเลือกเขต / อำเภอเกิดให้ตรงกับจังหวัด');
 return {name:fieldValue('fullName').trim()||'ไม่ระบุชื่อ',date:ad+'-'+pad(month)+'-'+pad(day),time:pad(hour)+':'+pad(minute),province:pv.name,district:dv.name,latitude:Number(fieldValue('latInput')),longitude:Number(fieldValue('lonInput')),timezone:Number(fieldValue('tzInput',7)||7),calendar:fieldValue('calendar','suriyayatra')||'suriyayatra',ascMethod:fieldValue('ascMethod','anto06adjusted')||'anto06adjusted',nodeMethod:fieldValue('nodeMethod','thai')||'thai',thaiDayBoundary:'06:00'};
}
function forecastInput(base){
 const now=new Date();
 const date=fieldValue('forecastDateInput')||(now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate()));
 const time=fieldValue('forecastTimeInput')||(pad(now.getHours())+':'+pad(now.getMinutes()));
 const provinceId=readSelectValue('forecastProvince','จังหวัดสถานที่จร'),districtId=readSelectValue('forecastDistrict','เขต / อำเภอสถานที่จร');
 const pv=provinceById(provinceId),dv=districtById(districtId);
 if(!pv||!dv||String(dv.provinceId)!==String(pv.id))throw new Error('กรุณาเลือกเขต / อำเภอสถานที่จรให้ตรงกับจังหวัด');
 return {...base,date:date,time:time,province:pv.name,district:dv.name,latitude:Number(fieldValue('forecastLat')),longitude:Number(fieldValue('forecastLon')),timezone:Number(fieldValue('forecastTz',base.timezone)||base.timezone)};
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
const GOLDEN_CASE={date:'1975-10-14',time:'01:05',province:'กรุงเทพมหานคร',district:'พระนคร',latitude:13.752555,longitude:100.494066,ascendant:{sign:'กรกฎ',longitude:113.85},planets:{'อาทิตย์':175.80,'จันทร์':285.583333,'อังคาร':68.216667,'พุธ':158.65,'พฤหัสบดี':357.20,'ศุกร์':134.466667,'เสาร์':95.466667}};
function validateGoldenCase(i,data){if(i.date!==GOLDEN_CASE.date||i.time!==GOLDEN_CASE.time||i.province!==GOLDEN_CASE.province||i.district!==GOLDEN_CASE.district)return {applicable:false,pass:true,deltas:{}};const deltas={};let pass=Math.abs(((data.ascendant.longitude-GOLDEN_CASE.ascendant.longitude+540)%360)-180)<=0.02&&data.ascendant.sign===GOLDEN_CASE.ascendant.sign;for(const p of data.planets){if(GOLDEN_CASE.planets[p.name]===undefined)continue;const d=Math.abs(((p.longitude-GOLDEN_CASE.planets[p.name]+540)%360)-180);deltas[p.name]=d;if(d>0.02)pass=false;}return {applicable:true,pass,deltas};}
function calculate(i){
 try{
  writeRuntimeLog('CALCULATE_START','เริ่มคำนวณ',i);
  const data=previewChart(i);
  const qa=validateGoldenCase(i,data);writeRuntimeLog(qa.applicable?(qa.pass?'GOLDEN_CASE_PASS':'GOLDEN_CASE_FAIL'):'CALCULATE_OK',qa.applicable?(qa.pass?'Golden Case ผ่าน':'Golden Case ไม่ผ่าน — ห้ามถือว่าการคำนวณถูกต้อง'):'คำนวณสำเร็จ',{engine:data?.metadata?.engineVersion,ephemeris:data?.metadata?.ephemeris,ruleset:data?.metadata?.rulesetVersion,qa});if(qa.applicable&&!qa.pass)throw new Error('GOLDEN_CASE_FAIL: ผลคำนวณไม่ตรงชุดตรวจสอบ HORA');return Promise.resolve({data,preview:true});
 }catch(e){
  writeRuntimeLog('CALCULATE_ERROR',errorText(e),{input:i});
  return Promise.reject(e);
 }
}
function parseLocalDate(i){return new Date(`${i.date}T${i.time}:00${i.timezone>=0?'+':'-'}${String(Math.abs(i.timezone)).padStart(2,'0')}:00`);}
function previewChart(i){return calcAt(i,parseLocalDate(i));}
function renderWheel(natal,transit){
 const c=250,rad=215; const planetNo={'อาทิตย์':'1','จันทร์':'2','อังคาร':'3','พุธ':'4','พฤหัสบดี':'5','ศุกร์':'6','เสาร์':'7','ราหู':'8','เกตุ':'9','มฤตยู':'0'};
 let s='<svg viewBox="0 0 500 500" class="wheel" role="img" aria-label="HORA Zodiac Wheel">';
 s+='<circle cx="250" cy="250" r="215" fill="none" stroke="#55627c"/><circle cx="250" cy="250" r="150" fill="none" stroke="#33405a"/><circle cx="250" cy="250" r="185" fill="none" stroke="#8bd3ff" stroke-dasharray="4 5" opacity=".7"/>';
 for(let i=0;i<12;i++){const boundary=(i*30-15-90)*Math.PI/180,x=c+rad*Math.cos(boundary),y=c+rad*Math.sin(boundary);const label=(i*30-90)*Math.PI/180,lx=c+(rad-25)*Math.cos(label),ly=c+(rad-25)*Math.sin(label);s+='<line x1="250" y1="250" x2="'+x+'" y2="'+y+'" stroke="#33405a"/><text x="'+lx+'" y="'+ly+'" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#d8b36a">'+signs[i]+'</text>';}
 function draw(list,ring,stroke,label){const seen={};for(const p of list.planets){const a=(p.longitude-90)*Math.PI/180;const key=Math.round(p.longitude/2);seen[key]=(seen[key]||0)+1;const rr=ring+((seen[key]-1)%3)*15;const x=c+rr*Math.cos(a),y=c+rr*Math.sin(a);const n=planetNo[p.name]||p.name[0];s+='<g><title>'+label+' '+p.name+' '+formatDeg(p.longitude)+'</title><circle cx="'+x+'" cy="'+y+'" r="11" fill="#111827" stroke="'+stroke+'" stroke-width="2.5"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">'+n+'</text></g>';}}
 draw(natal,118,'#d8b36a','พื้นดวง');
 if(transit)draw(transit,183,'#8bd3ff','ดาวจร');
 s+='<text x="250" y="247" text-anchor="middle" font-size="13" fill="#d8b36a">พื้นดวง</text><text x="250" y="267" text-anchor="middle" font-size="12" fill="#8bd3ff">ดาวจร</text>';
 s+='</svg>'; $('wheel').innerHTML=s;
 const legend=$('wheelLegend');if(legend)legend.innerHTML='<span class="legend-item"><i style="background:#d8b36a"></i>พื้นดวงกำเนิด</span><span class="legend-item"><i style="background:#8bd3ff"></i>ดาวจร ณ วันเวลาที่เลือก</span>';
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
 const transit=calcAt(forecastInput(r.input),parseLocalDate(forecastInput(r.input)));
 $('asc').innerHTML=`<b>${r.ascendant.sign.name}</b> ${formatDeg(r.ascendant.longitude)} <span class="muted">(${r.ascendant.navamsa.signName})</span>`;
 $('sunrise').textContent='อาทิตย์อุทัยอ้างอิง 06:00 น. · สุริยยาตร์ · อันโตนาทีสามัญ · ปรับเวลาท้องถิ่น';
 $('meta').innerHTML='ปฏิทิน: '+(r.metadata.calendar||'Thai Suriyayatra')+'<br>ลัคนา: อันโตนาทีสามัญ อาทิตย์อุทัย 06:00 น. ปรับเวลาท้องถิ่น<br>Engine: '+r.metadata.engineVersion+'<br>สถานะ: ต้องตรวจ Golden Case เต็มชุด';
 $('thaksa').innerHTML=Object.entries(r.thaksa.roles).map(([a,b])=>`<span class="pill">${a}: ${b}</span>`).join('');
 $('planets').innerHTML=r.planets.map(p=>`<div class="planet"><span>${p.name}</span><span>${p.sign.name} ${formatDeg(p.longitude)} · เรือน ${p.house}${p.retrograde?' · ม':''}</span></div>`).join('');
 $('houses').innerHTML=r.houses.map(h=>`<div class="planet"><span>${h.number}. ${h.name}</span><span>${h.sign.name} ${formatDeg(h.cusp)}</span></div>`).join('');
 renderWheel(r,transit);renderDetailed(r);const snap=createSnapshot(input(),r);saveSnapshot(snap);$('debug').textContent=JSON.stringify(snap,null,2);
}
$('calc').addEventListener('click',async()=>{$('msg').textContent='กำลังคำนวณ…';try{const base=input();const {data,preview}=await calculate(base);render(data,preview);renderTransits(base);$('msg').innerHTML='<span class="ok">PASS — Calculation Complete</span>';}catch(e){const msg=errorText(e);writeRuntimeLog('UI_ERROR',msg);$('msg').innerHTML=`<span class="error">FAIL — ${msg}</span>`;}});
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
setInterval(updateForecastClock,1000);
updateForecastClock();
initBirthSelectors();
loadPlaces().then(function(){$('calc').click();}).catch(function(e){$('msg').innerHTML='<span class="error">FAIL — '+e.message+'</span>';writeRuntimeLog('INIT_ERROR',errorText(e));});

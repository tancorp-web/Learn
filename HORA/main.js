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

function lahiriAyanamsa(date){
 const jd=(date.getTime()/86400000)+2440587.5;
 const T=(jd-2451545.0)/36525;
 return (23+51/60+25.5/3600)+(5028.796*T+1.105*T*T)/3600;
}
function siderealLon(tropical,date,ayan){
 const a=ayan==='lahiri'?lahiriAyanamsa(date):lahiriAyanamsa(date);
 return (tropical-a+360)%360;
}
function astroLon(body,date){
 if(body===Astronomy.Body.Sun)return Astronomy.SunPosition(date).elon;
 return Astronomy.Ecliptic(Astronomy.GeoVector(body,date)).elon;
}
function meanNode(date){
 const jd=(date.getTime()/86400000)+2440587.5,T=(jd-2451545)/36525;
 return (125.04452-1934.136261*T+0.0020708*T*T+T*T*T/450000+360)%360;
}
function ascBrowser(date,lat,lon){
 const L=(Astronomy.SiderealTime(date)*15+lon+360)%360;
 const e=23.4367*Math.PI/180,p=lat*Math.PI/180,l=L*Math.PI/180;
 return (Math.atan2(-Math.cos(l),Math.sin(l)*Math.cos(e)+Math.tan(p)*Math.sin(e))*180/Math.PI+360)%360;
}
function previewChart(i){
 const date=new Date(i.date+'T'+i.time+':00+07:00'),asc=ascBrowser(date,i.latitude,i.longitude);
 const bodies=[
  ['อาทิตย์',Astronomy.Body.Sun],['จันทร์',Astronomy.Body.Moon],['พุธ',Astronomy.Body.Mercury],
  ['ศุกร์',Astronomy.Body.Venus],['อังคาร',Astronomy.Body.Mars],['พฤหัสบดี',Astronomy.Body.Jupiter],
  ['เสาร์',Astronomy.Body.Saturn],['มฤตยู',Astronomy.Body.Uranus]
 ];
 const planets=bodies.map(x=>{const lon=siderealLon(astroLon(x[1],date),date,i.ayanamsa);return{id:x[0],name:x[0],longitude:lon,sign:signOf(lon),house:houseFromAsc(lon,asc),retrograde:false};});
 const rahu=siderealLon(meanNode(date),date,i.ayanamsa);
 planets.push({id:'ราหู',name:'ราหู',longitude:rahu,sign:signOf(rahu),house:houseFromAsc(rahu,asc),retrograde:true});
 planets.push({id:'เกตุ',name:'เกตุ',longitude:(rahu+180)%360,sign:signOf(rahu+180),house:houseFromAsc(rahu+180,asc),retrograde:true});
 const houses=Array.from({length:12},(_,k)=>{const lon=(asc+k*30)%360;return{number:k+1,name:houseNames[k],cusp:lon,sign:signOf(lon)};});
 return{metadata:{engineVersion:'1.1.0-browser',rulesetVersion:'1.0.0',ephemeris:'Astronomy Engine 2.1.19',ayanamsa:i.ayanamsa,coordinateSystem:'sidereal',houseModel:'whole-sign'},input:i,utc:date.toISOString(),sunrise:null,ascendant:{longitude:asc,sign:signOf(asc),navamsa:{signName:signs[Math.floor(asc/30)]}},planets,houses,thaksa:{roles:{'บริวาร':'อาทิตย์','อายุ':'จันทร์','เดช':'อังคาร','ศรี':'พุธ','มูลละ':'พฤหัสบดี','อุตสาหะ':'ศุกร์','มนตรี':'เสาร์','กาลี':'ราหู'}}};
}
async function calculate(i){
 try{
  const r=await fetch('./api/chart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(i)});
  if(!r.ok)throw new Error('API '+r.status);
  return {data:await r.json(),preview:false};
 }catch(e){
  return {data:previewChart(i),preview:true};
 }
}
function renderWheel(r){const c=250,rad=215;let s='<svg viewBox="0 0 500 500" class="wheel" role="img" aria-label="HORA Zodiac Wheel"><circle cx="250" cy="250" r="215" fill="none" stroke="#55627c"/><circle cx="250" cy="250" r="150" fill="none" stroke="#33405a"/>';for(let i=0;i<12;i++){const a=(i*30-90)*Math.PI/180,x=c+rad*Math.cos(a),y=c+rad*Math.sin(a);s+=`<line x1="250" y1="250" x2="${x}" y2="${y}" stroke="#33405a"/><text x="${c+(rad-25)*Math.cos((i*30+15-90)*Math.PI/180)}" y="${c+(rad-25)*Math.sin((i*30+15-90)*Math.PI/180)}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#d8b36a">${signs[i]}</text>`;}for(const p of r.planets){const a=(p.longitude-90)*Math.PI/180,x=c+125*Math.cos(a),y=c+125*Math.sin(a);s+=`<circle cx="${x}" cy="${y}" r="10" fill="#131a2c" stroke="#d8b36a"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="9">${p.name[0]}</text>`;}s+='</svg>';$('wheel').innerHTML=s;}
function renderTransits(i){
 const d=new Date(Date.now()+7*3600000); d.setUTCHours(d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds(),0);
 const r=previewChart(i);
 const names=['อาทิตย์','จันทร์','พุธ','ศุกร์','อังคาร','พฤหัสบดี','เสาร์','มฤตยู','ราหู','เกตุ'];
 const vals=r.planets.filter(p=>names.includes(p.name));
 const el=document.getElementById('transits');
 if(el)el.innerHTML='<div class="hint">วันที่ '+d.getUTCDate()+' '+thaiMonths[d.getUTCMonth()]+' '+(d.getUTCFullYear()+543)+' พ.ศ. · '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0')+':'+String(d.getUTCSeconds()).padStart(2,'0')+' น. · '+i.province+'</div>'+vals.map(p=>'<div class="planet"><span>'+p.name+'</span><span>'+p.sign.name+' '+formatDeg(p.longitude)+(p.retrograde?' · ม':'')+'</span></div>').join('');
}
function render(r,preview){$('asc').innerHTML=`<b>${r.ascendant.sign.name}</b> ${formatDeg(r.ascendant.longitude)} <span class="muted">(${r.ascendant.navamsa.signName})</span>`;$('sunrise').textContent=preview?'Preview mode — อาทิตย์อุทัยจริงจะคำนวณเมื่อเปิด API Server':`อาทิตย์อุทัยจริง: ${r.sunrise??'ไม่พบ'} · เส้นแบ่งวันทักษา: 06:00 น. ท้องถิ่น`;$('meta').innerHTML=`Engine ${r.metadata.engineVersion}<br>Ephemeris ${r.metadata.ephemeris}<br>Ayanamsa ${r.metadata.ayanamsa}<br>Ruleset ${r.metadata.rulesetVersion}`;$('thaksa').innerHTML=Object.entries(r.thaksa.roles).map(([a,b])=>`<span class="pill">${a}: ${b}</span>`).join('');$('planets').innerHTML=r.planets.map(p=>`<div class="planet"><span>${p.name}</span><span>${p.sign.name} ${formatDeg(p.longitude)} · เรือน ${p.house}${p.retrograde?' · ม':''}</span></div>`).join('');$('houses').innerHTML=r.houses.map(h=>`<div class="planet"><span>${h.number}. ${h.name}</span><span>${h.sign.name} ${formatDeg(h.cusp)}</span></div>`).join('');renderWheel(r);const snap=createSnapshot(input(),r);saveSnapshot(snap);$('debug').textContent=JSON.stringify(snap,null,2);}
$('provinceSearch').addEventListener('focus',()=>renderProvinceList($('provinceSearch').value));$('provinceSearch').addEventListener('input',e=>renderProvinceList(e.target.value));$('provinceClear').addEventListener('click',()=>{$('provinceSearch').value='';renderProvinceList('');$('provinceSearch').focus();});document.addEventListener('click',e=>{if(!e.target.closest('.combo'))$('provinceList').hidden=true;});
$('calc').addEventListener('click',async()=>{$('msg').textContent='กำลังคำนวณ…';try{const {data,preview}=await calculate(input());render(data,preview);renderTransits(input());$('msg').innerHTML=preview?'<span class="ok">PREVIEW — หน้าเว็บทำงานแล้ว (ต่อ API Server เพื่อผลคำนวณจริง)</span>':'<span class="ok">PASS — Calculation Complete</span>';}catch(e){$('msg').innerHTML=`<span class="error">FAIL — ${e.message}</span>`}});

function updateForecastClock(){
 const d=new Date(Date.now()+7*3600000);
 const hh=String(d.getUTCHours()).padStart(2,'0'),mm=String(d.getUTCMinutes()).padStart(2,'0'),ss=String(d.getUTCSeconds()).padStart(2,'0');
 const el=document.getElementById('forecastTime');if(el)el.textContent=hh+':'+mm+':'+ss+' น.';
 const ed=document.getElementById('forecastDate');if(ed)ed.textContent=d.getUTCDate()+' '+thaiMonths[d.getUTCMonth()]+' '+(d.getUTCFullYear()+543)+' พ.ศ.';
}
document.getElementById('useNow').addEventListener('click',()=>{
 const d=new Date(Date.now()+7*3600000);
 $('hour').value=String(d.getUTCHours());$('minute').value=String(d.getUTCMinutes());
 $('calc').click();
});
setInterval(()=>{updateForecastClock();if(document.getElementById('transits'))renderTransits(input());},1000);updateForecastClock();
initBirthSelectors();loadProvinces().then(()=>$('calc').click()).catch(e=>$('msg').innerHTML=`<span class="error">FAIL — ${e.message}</span>`);
